# ---- Build stage ----
FROM oven/bun:1.1-alpine AS build
WORKDIR /app

# Install deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Copy source
COPY . .

# Build-time API URL (override at build: --build-arg VITE_PUBLIC_API_BASE_URL=...)
ARG VITE_PUBLIC_API_BASE_URL=http://localhost:5126/v1
ENV VITE_PUBLIC_API_BASE_URL=$VITE_PUBLIC_API_BASE_URL

RUN bun run build

# ---- Runtime stage (static preview server) ----
FROM oven/bun:1.1-alpine AS runtime
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["bun", "run", ".output/server/index.mjs"]
