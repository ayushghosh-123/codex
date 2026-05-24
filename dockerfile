# Frontend Builder
FROM oven/bun:1 AS frontend-builder

WORKDIR /app

COPY ./frontend/ .

RUN bun install

RUN bun run build


# Backend Builder
FROM oven/bun:1

WORKDIR /app

COPY ./backend/ .

# Install dependencies for native modules (like node-pty)
RUN apt-get update && \
    apt-get install -y python3 make g++ nodejs npm && \
    rm -rf /var/lib/apt/lists/*

RUN bun install && npm rebuild node-pty

# Copy frontend build files
COPY --from=frontend-builder /app/dist /app/public

ENV NODE_ENV=production
ENV MONGO_URI=mongodb://mongodb:27017/learning

# Install netcat
RUN apt-get update && \
    apt-get install -y netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

CMD ["bun", "server.ts"]