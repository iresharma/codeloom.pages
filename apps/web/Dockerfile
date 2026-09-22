# syntax=docker/dockerfile:1
#
# Build context is the pages/ workspace root (not apps/web/), since this is a
# pnpm monorepo: `docker build -f apps/web/Dockerfile .` from workspace/pages.

FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

# Install with only the manifest files first so this layer stays cached
# across source-only changes.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @codeloom/web build

# next.config.ts sets outputFileTracingRoot to this workspace root, so the
# standalone output's internal paths mirror it: apps/web/server.js,
# node_modules/, package.json all land at the root of .next/standalone.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
