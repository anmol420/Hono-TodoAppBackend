FROM oven/bun:latest

WORKDIR /usr/app

COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install

COPY . .

ENTRYPOINT [ "bun run", "src/index.ts" ]