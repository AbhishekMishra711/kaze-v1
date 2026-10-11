# -------------------------------------------------------------
# Root Dockerfile for Backend deployed from repository root
# -------------------------------------------------------------

FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
COPY backend/package*.json backend/tsconfig.json ./
RUN npm install

# Copy backend source and compile
COPY backend/src ./src
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/server.js"]
