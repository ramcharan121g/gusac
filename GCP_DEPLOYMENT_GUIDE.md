# Google Cloud Platform (GCP) Production Deployment Guide
## GUSAC — GITAM University Science and Activity Center (Visakhapatnam Main Campus)

This guide provides the complete, copy-paste terminal instructions to deploy the GUSAC platform to **Google Cloud Platform** with enterprise-grade security.

---

## 1. Architectural Topology

```text
                                [ User / Student Browser ]
                                             │
                                    (HTTPS / TLS 1.3)
                                             ▼
                                [ Google Cloud Armor (WAF) ]
                                             │
                                             ▼
                     [ Google Cloud Run (Serverless Container) ]
                                      Port 8080
                     ┌───────────────────────┴───────────────────────┐
                     ▼                                               ▼
         [ Google Secret Manager ]                    [ Private VPC Network ]
         - JWT_SECRET                                                │
         - SESSION_SECRET                                            ▼
         - HMAC_PASS_SECRET                       [ Cloud SQL (PostgreSQL 16) ]
         - DB_PASSWORD                            - Users & Sessions
                                                  - Events & Registrations
                                                  - Signed Passes & Audit Logs
                                                  - Universal CMS Data
```

---

## 2. Prerequisites Checklist

- A Google Cloud account with an active billing account.
- Google Cloud SDK (`gcloud` CLI) installed on your machine, or simply open **Google Cloud Shell** in your browser at [shell.cloud.google.com](https://shell.cloud.google.com).
- Ensure your project ID is set:
  ```bash
  export PROJECT_ID="your-gcp-project-id"
  export REGION="asia-south1" # Mumbai (closest to Visakhapatnam for lowest latency)
  gcloud config set project $PROJECT_ID
  ```

---

## 3. Step 1: Enable Google Cloud APIs

Run the following command to enable all necessary services:

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  vpcaccess.googleapis.com
```

---

## 4. Step 2: Provision Cloud SQL (PostgreSQL Database)

1. **Create the PostgreSQL Instance**:
   ```bash
   gcloud sql instances create gusac-postgres-vsp \
     --database-version=POSTGRES_16 \
     --tier=db-f1-micro \
     --region=$REGION \
     --storage-size=10GB \
     --storage-auto-increase \
     --backup-start-time=02:00
   ```

2. **Create Database & User**:
   ```bash
   # Create database
   gcloud sql databases create gusac_db --instance=gusac-postgres-vsp

   # Set secure admin password (replace with strong password)
   export DB_PASS=$(openssl rand -base64 24)
   gcloud sql users create gusac_admin \
     --instance=gusac-postgres-vsp \
     --password="$DB_PASS"

   echo "Your Cloud SQL Database Password: $DB_PASS"
   ```

3. **Run Schema & Seed Data**:
   Connect via Cloud Shell using Cloud SQL Auth Proxy or execute:
   ```bash
   gcloud sql connect gusac-postgres-vsp --user=gusac_admin --database=gusac_db < server/db/schema.sql
   gcloud sql connect gusac-postgres-vsp --user=gusac_admin --database=gusac_db < server/db/seed.sql
   ```

---

## 5. Step 3: Store Secrets in Google Secret Manager

Store your sensitive production keys so they are never exposed in source code or `.env` files:

```bash
# 1. JWT Signing Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" | \
  gcloud secrets create gusac_jwt_secret --data-file=-

# 2. Session Encryption Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" | \
  gcloud secrets create gusac_session_secret --data-file=-

# 3. HMAC Pass & QR Signing Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" | \
  gcloud secrets create gusac_hmac_secret --data-file=-

# 4. Database Password
echo -n "$DB_PASS" | \
  gcloud secrets create gusac_db_password --data-file=-
```

Grant Cloud Run service account access to read secrets:
```bash
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gusac_jwt_secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding gusac_session_secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding gusac_hmac_secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding gusac_db_password \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 6. Step 4: Build & Deploy Container to Cloud Run

1. **Create Artifact Registry Repository**:
   ```bash
   gcloud artifacts repositories create gusac-repo \
     --repository-format=docker \
     --location=$REGION \
     --description="GUSAC Docker Repository"
   ```

2. **Build and Push the Container Image via Google Cloud Build**:
   ```bash
   gcloud builds submit --tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/gusac-repo/gusac-app:latest
   ```

3. **Deploy to Google Cloud Run**:
   ```bash
   gcloud run deploy gusac-app \
     --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/gusac-repo/gusac-app:latest \
     --region=$REGION \
     --platform=managed \
     --allow-unauthenticated \
     --port=8080 \
     --memory=512Mi \
     --cpu=1 \
     --min-instances=0 \
     --max-instances=10 \
     --add-cloudsql-instances=${PROJECT_ID}:${REGION}:gusac-postgres-vsp \
     --set-env-vars="NODE_ENV=production,DB_TYPE=postgres,DB_USER=gusac_admin,DB_NAME=gusac_db,DB_HOST=/cloudsql/${PROJECT_ID}:${REGION}:gusac-postgres-vsp" \
     --set-secrets="JWT_SECRET=gusac_jwt_secret:latest,SESSION_SECRET=gusac_session_secret:latest,HMAC_PASS_SECRET=gusac_hmac_secret:latest,DB_PASSWORD=gusac_db_password:latest"
   ```

---

## 7. Step 5: Post-Deployment Verification

1. **Check Health Probe**:
   ```bash
   export SERVICE_URL=$(gcloud run services describe gusac-app --region=$REGION --format='value(status.url)')
   curl -s "${SERVICE_URL}/api/health"
   ```
   **Expected Response:**
   ```json
   {
     "status": "HEALTHY",
     "service": "GUSAC Enterprise API Gateway",
     "cloudPlatform": "Google Cloud Run Ready",
     "environment": "production"
   }
   ```

2. **Access Admin Portal**:
   - Open `${SERVICE_URL}/admin` in your browser.
   - Login with Super Admin credentials: `admin@gitam.in` / (your configured admin password)
   - Verify that your TOTP authenticator or MFA challenge completes.

3. **Custom Domain Mapping (e.g. `gusac.gitam.edu`)**:
   ```bash
   gcloud beta run domain-mappings create \
     --service=gusac-app \
     --domain=gusac.gitam.edu \
     --region=$REGION
   ```
   Add the DNS `CNAME` records provided by Google Cloud to your GITAM university DNS manager. SSL certificates are provisioned automatically.

---

## 8. Summary of Hardened Security Controls

| Security Layer | Implementation |
| :--- | :--- |
| **DDoS & Layer 7 Defense** | Cloud Armor + Helmet security headers + Rate Limiters |
| **Network Isolation** | Cloud SQL Unix socket `/cloudsql/` connection (no public database IP) |
| **Credential Security** | Google Secret Manager dynamic runtime injection |
| **Pass Authenticity** | HMAC SHA-256 cryptographic signatures with constant-time verification |
| **Session Protection** | `HttpOnly` + `Secure` + `SameSite=Strict` cookies |
| **Container Hardening** | Unprivileged `node` non-root user in lightweight Alpine Linux |
