# Use a multi-stage build for a professional and lean production image

# --- Stage 1: Base (Common dependencies) ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- Stage 2: Development (For hot-reloading) ---
FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# --- Stage 3: Builder (Compiles TS to JS) ---
FROM base AS builder
RUN npm run build

# --- Stage 4: Production (Minimal runtime image) ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Only copy production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./dist/package.json

# Create temp directory for uploads/etc.
RUN mkdir -p public/temp

EXPOSE 4000
CMD ["node", "dist/index.js"]