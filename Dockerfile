# syntax=docker/dockerfile:1
#
# One image per landing page:
#   docker build --platform linux/amd64 --build-arg APP=agent -t iresharma/codeloom-agent:0.1.0 .
#
# APP is one of: agent | ide | tui | cli | engine

ARG NODE_VERSION=22-alpine
ARG APP=agent

FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.3 --activate

FROM base AS builder
WORKDIR /app
ARG APP
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @codeloom/${APP} build
# engine has no public/ directory; keep COPY in the runner stage unconditional.
RUN mkdir -p apps/${APP}/public

FROM base AS runner
WORKDIR /app
ARG APP
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# outputFileTracingRoot is the monorepo root, so standalone nests server.js at
# apps/<app>/server.js rather than /app/server.js.
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/public ./apps/${APP}/public

USER nextjs
WORKDIR /app/apps/${APP}
EXPOSE 3000
CMD ["node", "server.js"]
