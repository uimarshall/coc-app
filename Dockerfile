# =============================================================================
# Multi-stage Dockerfile for Next.js (standalone output)
#
# Stage 1 (deps)    — Install only production dependencies
# Stage 2 (builder) — Build the Next.js application
# Stage 3 (runner)  — Minimal production image
#
# Multi-stage builds keep the final image small by discarding everything
# used only during the build process (source code, dev tools, etc.).
#
# Build: docker build -t coc-app .
# Run:   docker run -p 3000:3000 --env-file .env coc-app
# =============================================================================

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps

# Security: run as non-root where possible
# Install libc6-compat for native Node.js module compatibility on Alpine Linux
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only the files needed to install dependencies
# This way Docker caches the npm install layer and only re-runs it when
# package.json or package-lock.json changes — not every code change.
COPY package.json package-lock.json ./

# Install only production dependencies (skips devDependencies)
RUN npm ci --omit=dev

# ── Stage 2: Build the application ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy production node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Build arguments — these must be provided at build time for NEXT_PUBLIC_ vars
# Example: docker build --build-arg NEXT_PUBLIC_APP_URL=https://yourchurch.com .
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Disable Next.js telemetry during builds (privacy + speed)
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app in standalone mode
# "standalone" creates a self-contained folder that can run without node_modules
RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: install only essential packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Set Node.js environment to production
# This disables developer tooling and enables performance optimisations
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security: create a non-root user to run the application
# Running as root inside a container is a security risk
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output — this is a minimal Node.js server
COPY --from=builder /app/.next/standalone ./

# Copy the static assets (CSS, JS chunks, images)
COPY --from=builder /app/.next/static ./.next/static

# Copy the public directory (favicon, robots.txt, etc.)
COPY --from=builder /app/public ./public

# Switch to the non-root user
USER nextjs

# Tell Docker which port the app listens on (documentation only — doesn't publish it)
EXPOSE 3000

# Set the hostname and port
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js standalone server
CMD ["node", "server.js"]
