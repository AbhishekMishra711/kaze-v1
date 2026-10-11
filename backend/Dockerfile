# -------------------------------------------------------------
# Multi-stage Production Dockerfile for HLTH-02 Core Backend
# -------------------------------------------------------------

# Stage 1: Build TypeScript into JavaScript
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies (including devDependencies needed for tsc)
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source code and compile
COPY src ./src
RUN npm run build

# Stage 2: Minimal Production Image
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Render automatically assigns PORT
ENV PORT=4000
EXPOSE 4000

# Start compiled ES module server
CMD ["node", "dist/server.js"]
