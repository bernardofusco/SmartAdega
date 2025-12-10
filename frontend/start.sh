#!/bin/bash

echo "============================================"
echo "SmartAdega Frontend - Inicializacao"
echo "============================================"
echo ""

echo "[1/3] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js nao encontrado!"
    echo "Instale Node.js 18+ de https://nodejs.org"
    exit 1
fi
node --version
echo ""

echo "[2/3] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependencias"
    exit 1
fi
echo ""

echo "[3/3] Iniciando servidor de desenvolvimento..."
echo ""
echo "============================================"
echo "Frontend rodando em: http://localhost:3000"
echo "============================================"
echo ""
npm run dev
