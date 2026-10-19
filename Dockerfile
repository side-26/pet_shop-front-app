FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
ENV CYPRESS_INSTALL_BINARY=0

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

RUN corepack enable
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SESSION_COOKIE_NAME
ARG NEXT_PUBLIC_SESSION_SECRET_KEY
ARG NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY
ARG NEXT_PUBLIC_CART_STORAGE_KEY
ARG NEXT_PUBLIC_NESHAN_API_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SESSION_COOKIE_NAME=$NEXT_PUBLIC_SESSION_COOKIE_NAME
ENV NEXT_PUBLIC_SESSION_SECRET_KEY=$NEXT_PUBLIC_SESSION_SECRET_KEY
ENV NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY=$NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY
ENV NEXT_PUBLIC_CART_STORAGE_KEY=$NEXT_PUBLIC_CART_STORAGE_KEY
ENV NEXT_PUBLIC_NESHAN_API_KEY=$NEXT_PUBLIC_NESHAN_API_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
