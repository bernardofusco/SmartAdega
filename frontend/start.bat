@echo off
echo ============================================
echo SmartAdega Frontend - Inicializacao
echo ============================================
echo.

echo [1/3] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js 18+ de https://nodejs.org
    pause
    exit /b 1
)
echo.

echo [2/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo.

echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo ============================================
echo Frontend rodando em: http://localhost:3000
echo ============================================
echo.
call npm run dev
