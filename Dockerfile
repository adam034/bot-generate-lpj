# ---------- BUILDER ----------
FROM node:18-alpine AS builder

WORKDIR /app

# install pnpm versi sama
RUN corepack enable
RUN corepack prepare pnpm@7.32.5 --activate

# copy deps dulu (biar cache kepake)
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# copy source
COPY . .

# build typescript
RUN pnpm build


# ---------- RUNNER ----------
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# install pnpm lagi (untuk install prod deps)
RUN corepack enable
RUN corepack prepare pnpm@7.32.5 --activate

COPY package.json pnpm-lock.yaml ./

# hanya install production deps
RUN pnpm install --prod --frozen-lockfile

# copy hasil build saja
COPY --from=builder /app/dist ./dist
COPY assets ./assets

CMD ["node", "dist/index.js"]