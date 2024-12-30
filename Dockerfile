ARG BUN_VERSION=1.1.13
ARG NODE_VERSION=20.12.2
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim

ENV NODE_ENV="production"

WORKDIR /app

COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install

COPY . .

RUN bun prisma generate

CMD [ "bun", "run", "src/index.ts" ]