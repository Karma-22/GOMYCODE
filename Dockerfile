# ==========================================
# Multi-Stage Production Dockerfile
# GoMyCode Deployment Checkpoint - Karma-22
# ==========================================

# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies with caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Stage 2: Lightweight Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Security: Run as non-privileged user
USER node

# Copy dependencies and application from builder
COPY --chown=node:node --from=builder /app ./

# Container Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["node", "server/index.js"]
