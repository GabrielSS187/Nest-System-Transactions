FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

RUN rm -rf node_modules \
 && yarn install --production --frozen-lockfile

FROM node:22-alpine AS prod
WORKDIR /app

RUN addgroup -S app && adduser -S -G app app

COPY --from=builder /app/package.json   ./package.json
COPY --from=builder /app/yarn.lock       ./yarn.lock
COPY --from=builder /app/node_modules    ./node_modules

COPY --from=builder /app/dist            ./dist

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Entry point
CMD ["node", "dist/main"]
