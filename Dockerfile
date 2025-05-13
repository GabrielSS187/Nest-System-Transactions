# Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Adiciona ferramentas úteis para dev
RUN yarn add -D ts-node typescript @nestjs/cli

# Compila para produção apenas no perfil prod (ignore em dev)
RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"]
