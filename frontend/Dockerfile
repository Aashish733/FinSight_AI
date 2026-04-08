# --- Stage 1: Base ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- Stage 2: Development (Vite dev server) ---
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# --- Stage 3: Builder (Production build) ---
FROM base AS builder
RUN npm run build

# --- Stage 4: Production (Serve with Nginx) ---
FROM nginx:alpine AS production
# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]