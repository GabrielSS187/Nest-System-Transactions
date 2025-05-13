#!/bin/bash

set -e  # para o script se qualquer comando falhar

echo ""
echo "🚀 Iniciando processo de deploy da Nest System Transactions"
echo ""

echo "🔍 Etapa 1: Rodando testes (unitários + e2e)..."
docker-compose --profile test up --build --abort-on-container-exit tests
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -ne 0 ]; then
  echo ""
  echo "❌ Testes falharam. Deploy abortado."
  exit 1
fi

echo ""
echo "✅ Testes passaram com sucesso."

echo ""
echo "📦 Etapa 2: Subindo aplicação em modo produção..."
docker-compose --profile prod up -d --build

echo ""
echo "✅ Deploy finalizado. API rodando em produção!"
echo "🌐 Acesse: http://localhost:3000/swagger"
