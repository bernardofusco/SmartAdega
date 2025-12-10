# SmartAdega - Frontend

Sistema de gerenciamento de colecao de vinhos desenvolvido com React + Vite.

## Stack Tecnologica

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estatica
- **TailwindCSS** - Estilizacao
- **React Router v6** - Roteamento
- **TanStack Query** - Cache e gerenciamento de estado servidor
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formularios
- **Zod** - Validacao de schemas

## Pre-requisitos

- Node.js 18+
- NPM ou Yarn
- API rodando em `http://localhost:3001`

## Instalacao

```bash
# Instalar dependencias
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

## Configuracao

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_USER_ID=seu-user-id-aqui
```

## Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## Build para Producao

```bash
npm run build
```

Os arquivos compilados estarao em `dist/`

## Preview da Build

```bash
npm run preview
```

## Estrutura de Pastas

```
src/
??? components/       # Componentes reutilizaveis
??? pages/           # Paginas da aplicacao
??? layouts/         # Layouts (Header, MainLayout)
??? routes/          # Configuracao de rotas
??? services/        # Servicos API (axios)
??? hooks/           # Hooks customizados
??? stores/          # Stores Zustand
??? styles/          # CSS global
??? utils/           # Funcoes utilitarias
```

## Funcionalidades

- ? Listagem de vinhos
- ? Detalhes do vinho
- ? Criar vinho
- ? Editar vinho
- ? Excluir vinho
- ? Validacao de formularios
- ? Feedback visual (toasts)
- ? Loading states (skeleton)
- ? Error handling
- ? Design responsivo
- ? PWA ready

## Scripts Disponiveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de producao
- `npm run preview` - Preview da build
- `npm run lint` - Executa ESLint

## API Endpoints

O frontend consome os seguintes endpoints:

- `GET /api/wines` - Listar vinhos
- `GET /api/wines/:id` - Detalhes do vinho
- `POST /api/wines` - Criar vinho
- `PUT /api/wines/:id` - Atualizar vinho
- `DELETE /api/wines/:id` - Excluir vinho

## Autenticacao

O sistema usa o header `x-user-id` para identificar o usuario. Configure o ID no arquivo `.env` ou na pagina de Configuracoes.

## Licenca

MIT
