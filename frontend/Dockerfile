# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Keep installs reproducible; skip postinstall scripts if any
RUN npm ci --ignore-scripts

# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure a public folder exists so the later COPY never fails (even if your repo has no /public)
RUN mkdir -p public

# Build-time args (provided by docker-compose -> build.args)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_MOCK_MODE

# Expose them to Next at build time
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_MOCK_MODE=$NEXT_PUBLIC_MOCK_MODE \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- run ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Next.js standalone output includes server.js and minimal node_modules
COPY --from=builder /app/.next/standalone ./
# Static assets + public files
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Drop privileges
USER node

EXPOSE 3000
CMD ["node", "server.js"]
