# 💸 Nest Transactions API

API RESTful construída com **NestJS** para registrar transações financeiras e gerar estatísticas em tempo real. Desenvolvida com foco em **Clean Architecture**, segurança, performance e extensibilidade.

---

## 📋 Sumário

- [🚀 API na Nuvem ](#-api-na-nuvem)
- [📽️ Vídeo Explicando as Etapas de Instalação e Testes](https://github.com/GabrielSS187/Nest-System-Transactions?tab=readme-ov-file#%EF%B8%8F-v%C3%ADdeo-explicando-as-etapas-de-instala%C3%A7%C3%A3o-e-testes)
- [📹 Vídeo Construindo CI/CD](#%EF%B8%8F-v%C3%ADdeo-explicando-as-etapas-de-instala%C3%A7%C3%A3o-e-testes)
- [📦 Tecnologias](#-tecnologias)
- [🚀 Como executar](#-como-executar)
  - [🔧 Requisitos](#-requisitos)
  - [🧱 Modo local](#-modo-local)
  - [🐳 Com Docker](#-com-docker)
- [📡 Endpoints da API](#-endpoints-da-api)
- [📊 WebSocket - Estatísticas em tempo real](#-websocket---estatísticas-em-tempo-real)
- [🧪 Testes](#-testes)
- [🧱 Arquitetura](#-arquitetura)
- [🔐 Segurança](#-segurança)
- [📝 Documentação Swagger](#-documentação-swagger)
- [📦 CI/CD](#-cicd)
- [📁 Variáveis de ambiente](#-variáveis-de-ambiente)
- [🧑‍💻 Autor](#-Autor)

---

## 🚀 API na Nuvem
- URL: https://nest-system-transactions.onrender.com/api
- DOC: https://nest-system-transactions.onrender.com/docs
- O meu plano na nuvem é gratuito, então leve em consideração o tempo de latência da aplicação.

---

# 📽️ Vídeo Explicando as Etapas de Instalação e Testes
- Link do Vídeo: https://drive.google.com/file/d/1DPwbnns-gtY-nQvJgnpxEioEh-89hDzA/view?usp=sharing

# 📹 Vídeo Construindo CI/CD
- Vídeo: https://drive.google.com/file/d/1v0bEdVDQH-ytGTOJV8NNxKheED99IjL6/view?usp=sharing
- Descrição: CI/CD com Github Actions com deploy na cloud da Render.
- Vídeo e de outro projeto mas os procedimentos foram os mesmos

---

## 📦 Tecnologias

- [NestJS](https://nestjs.com/)
- TypeScript
- Swagger (`@nestjs/swagger`)
- WebSocket (Socket.IO)
- Helmet (segurança)
- Throttling (`@nestjs/throttler`)
- Logs com [Pino](https://getpino.io/)
- Testes com [Jest](https://jestjs.io/) e [Supertest](https://github.com/visionmedia/supertest)
- Docker + Docker Compose
- CI/CD com GitHub Actions

---

## 🚀 Como executar

### 🔧 Requisitos

- [Node.js](https://nodejs.org/) 18+
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (opcional)

### 🧱 Modo local

```bash
# Instale as dependências
yarn install

# Rode a aplicação em modo dev
yarn start:dev
```
- A API estará disponível em: http://localhost:3000/api
- Swagger: http://localhost:3000/swagger

---

### 🐳 Com Docker
- Obrigatório ter o docker instalado na sua máquina*.

```bash
# Subir ambiente de desenvolvimento
docker compose --profile dev up --build

# Subir ambiente de produção
docker compose --profile prod up --build
```
- A API estará disponível em: http://localhost:3000/api
- Swagger: http://localhost:3000/docs

---

## 📡 Endpoints da API

🔸 POST /transactions
- Cria uma nova transação.

Corpo da requisição:
```json
{
  "amount": 123.45,
  "timestamp": "2025-05-13T15:30:00Z", // opcional
  "receiverClientId": "ws-user"       // opcional
}
```

Respostas:
- 201 Created – Transação criada

- 400 Bad Request – JSON inválido

- 422 Unprocessable Entity – Timestamp no futuro


🔸 GET /transactions/statistics
- Retorna estatísticas das transações dos últimos 60 segundos.

Exemplo de resposta:
```json
{
  "count": 10,
  "sum": 1234.56,
  "avg": 123.45,
  "min": 12.34,
  "max": 456.78
}
```


🔸 DELETE /transactions
- Remove todas as transações da memória.

- 200 OK


🔸 GET /health
- Verifica se o sistema está online.

## 📊 WebSocket - Estatísticas em tempo real
- URL: http://localhost:3000/

- Evento emitido: statistics

- Auth esperada: clientId via auth ou query. O valor pode ser qualquer coisa.

- Link para testa na web: https://firecamp.dev/

Exemplo (usando Socket.IO):
```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: { clientId: "ws-user" }
});

socket.on("statistics", (data) => {
  console.log("Estatísticas recebidas:", data);
});
```

---

## 🧪 Testes

✅ Localmente
Execute todos os testes (unitários e de integração):
```bash
yarn test        # Testes unitários
yarn test:e2e    # Testes E2E
yarn test:cov    # Cobertura de testes
```

🐳 Com Docker
- Obrigatório ter o docker instalado na sua máquina*.

Execute os testes completos (unitários + e2e + coverage) com Docker:
```bash
docker compose --profile test run --rm nest-api-test
```
---

## 🧱 Arquitetura
Estruturado com base na Clean Architecture e DDD (Domain Driven Design):

- domain/ → Entidades de domínio

- app/use-cases/ → Lógica de negócios (casos de uso)

- infra/http/ → Controllers, DTOs, Guards, WebSocket

- infra/repositories/ → Repositórios em memória

- test/ → Testes automatizados (unitários e e2e)

---

## 🔐 Segurança
- ✅ Validação de entrada com class-validator + ValidationPipe

- ✅ Rate limiting com @nestjs/throttler

- ✅ Helmet para proteção HTTP

- ✅ Logs estruturados com nestjs-pino

---

## 📝 Documentação Swagger
Acesse em: http://localhost:3000/docs

Inclui:

- Exemplos de requisição/resposta

- Códigos HTTP esperados

- Regras de negócio descritas

---

## 📦 CI/CD
CI/CD configurado com GitHub Actions:

- ✅ Testes rodando a cada push na branch main

- ✅ Deploy automático na plataforma Render

Arquivo: .github/workflows/deploy.yml

---

## 📁 Variáveis de ambiente
```env
NODE_ENV=development
PORT=3000
LOG_OUTPUT=file
```

---

## 🧑‍💻 Autor
- Este projeto foi desenvolvido por **Gabriel Silva**.
- linkedin: https://www.linkedin.com/in/gabriel-silva-souza-developer/
