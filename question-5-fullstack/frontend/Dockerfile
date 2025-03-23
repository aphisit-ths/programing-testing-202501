# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Build the app
FROM base AS builder
# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy all project files including next.config.js
COPY . .
# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# Make sure to explicitly copy next.config.js
COPY --from=builder /app/next.config.ts ./next.config.ts

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]