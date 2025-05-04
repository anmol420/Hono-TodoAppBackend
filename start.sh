#!/bin/sh

echo "▶ Running Prisma generate..."
bunx prisma generate

echo "▶ Deploying migrations..."
bunx prisma migrate deploy

echo "▶ Starting server..."
bun run dev
