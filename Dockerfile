# syntax=docker/dockerfile:1
#
# Dockerfile multistage para el frontend Next.js de Paco Merlos.
#
# Decisiones (ver CLAUDE.md y COOLIFY-MIGRATION.md en el VPS):
#  - Base Debian slim (glibc), NO alpine: el proyecto usa binarios nativos
#    (sharp, @tailwindcss/oxide, lightningcss) que dan menos guerra con glibc
#    que con musl.
#  - pnpm 10 pineado vía corepack (mismo major que el lockfile 9.0 y que el
#    entorno local), para evitar la clase de errores que tuvimos en matcha
#    (lockfile mismatch / build scripts).
#  - NEXT_PUBLIC_* se HORNEAN en `next build` → se pasan como ARG/ENV ANTES del
#    build. Coolify las inyecta como --build-arg desde las Build Variables del
#    entorno (dev: development / prod: production).

# ---- Base con pnpm ----
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.2 --activate
WORKDIR /app

# ---- Dependencias (incluye devDependencies para el build) ----
FROM base AS deps
# Forzamos development para que pnpm NO se salte devDependencies (tailwindcss,
# typescript, eslint) aunque el orquestador inyecte NODE_ENV=production.
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# ---- Build ----
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Variables públicas: se incrustan en el bundle. Defaults = producción; Coolify
# las sobrescribe por entorno con --build-arg.
ARG NEXT_PUBLIC_DIRECTUS_URL=https://cms.pacomerlos.com
ARG NEXT_PUBLIC_CONTENT_ENV=production
ENV NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL
ENV NEXT_PUBLIC_CONTENT_ENV=$NEXT_PUBLIC_CONTENT_ENV
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Runner: imagen mínima con la salida standalone ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Usuario sin privilegios
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
