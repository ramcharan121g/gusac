# ==============================================================================
# GUSAC INNOVATION HUB — PRODUCTION DOCKERFILE FOR GOOGLE CLOUD RUN
# ==============================================================================
# Multi-stage build: compiles Vite frontend and prepares minimal, secure Node runner.

# --- STAGE 1: Build Frontend Assets ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached if package files don't change)
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source
COPY . .

# Compile client-side production bundle
RUN npm run build

# --- STAGE 2: Hardened Production Runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

# Cloud Run defaults and security attributes
ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies for the Express server
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend server code and compiled frontend bundle
COPY server/ ./server/
COPY --from=builder /app/dist ./dist

# Create logs directory and fix permissions for non-root user
RUN chown -R node:node /app

# Run under the unprivileged built-in 'node' user (Container Security Best Practice)
USER node

# Cloud Run ingress port
EXPOSE 8080

# Cloud Run health check probe
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))"

# Start the enterprise server
CMD ["node", "server/index.js"]
