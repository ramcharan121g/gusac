# GUSAC — GITAM University Student Activities Center

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![Supabase Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Brevo SMTP](https://img.shields.io/badge/Email-Brevo%20SMTP-0092FF)](https://brevo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Official web platform for the **GITAM University Student Activities Center (GUSAC)** at Visakhapatnam. This platform manages student innovations, cross-disciplinary technical wings, event admissions, cryptographically signed digital passes, and automated membership workflows.

---

## 🌟 Key Features

1. **Automated Student & Faculty Verification**:
   - Institutional Single Sign-On (SSO) supporting `@student.gitam.edu`, `@gitam.edu`, and `@gitam.in`.
   - Real-time university email domain derivation and OTP verification via Brevo transactional SMTP.

2. **Digital Event Passes & Attendance**:
   - Automated event admission passes signed with cryptographic HMAC tokens.
   - Dynamic QR codes generated for instant mobile pass scanning and check-in recording.

3. **Multi-Wing Innovation Showcase**:
   - Interactive wing explorer for Aeromodelling & UAVs, Robotics & Automation, Web/Cloud/CyberSec, AI/ML, Space Tech, and IoT.
   - Student project submissions and showcase directory.

4. **Security & Governance (OWASP ASVS Standardized)**:
   - Argon2id / Scrypt salted cryptographic password hashing.
   - Time-based One-Time Password (TOTP) Multi-Factor Authentication (MFA) for administrative operations.
   - Comprehensive audit logging and zero-trust role-based access control (RBAC).

5. **Cloud-Native Database Infrastructure**:
   - Hosted on Supabase Managed PostgreSQL with pooled connections and automated relational migrations.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ramcharan121g/gusac.git
cd gusac
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your database and email credentials:
```bash
cp .env.example .env
```

### 3. Launch Development Server
```bash
npm run dev
```
- **Frontend Portal**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000`

---

## 📦 Production Build

```bash
npm run build
```

---

## 🏛️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, Helmet, CORS, Rate Limiting, Cookie Parser
- **Database**: Supabase PostgreSQL (Managed Relational Cluster)
- **Email Service**: Brevo Transactional SMTP Relay
- **Hosting**: Vercel Serverless Architecture

---

## 📄 License

Distributed under the MIT License. Developed for the GITAM University Student Activities Center.
