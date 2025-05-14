# Etapa de construção
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Etapa de produção
FROM node:22-alpine

WORKDIR /app

# Adiciona usuário não root para segurança
RUN addgroup app && adduser -S -G app app

COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
