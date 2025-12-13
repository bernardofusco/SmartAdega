<p align="center">
  <img src="frontend/Logo.jpg" alt="SmartAdega Logo" width="200" style="border-radius: 20px;">
</p>

# SmartAdega
Gerenciamento de adegas pessoais com reconhecimento por imagem (PT-BR + EN).

## Visao Geral (PT-BR + EN)
- PT-BR: Aplicacao full-stack para catalogar vinhos, com autenticacao via Supabase, CRUD completo, reconhecimento por imagem usando API externa e interface React otimizada para mobile/PWA.
- EN: Full-stack app to manage a personal wine cellar, leveraging Supabase auth, full CRUD, image-based wine recognition through an external API, and a React UI tuned for mobile/PWA.

## Tecnologias Utilizadas
- Backend: Node.js 18, Express, Supabase (Postgres + Auth), Multer, JWT, Zod, Swagger, Axios.
- Frontend: React 18, Vite, React Router (hash), TanStack Query, Zustand, React Hook Form + Zod, TailwindCSS, Vite PWA plugin (SW desabilitado por padrao), Axios.
- Qualidade/Automacao: Playwright para E2E, GitHub Actions (deploy do frontend para GitHub Pages).

## Arquitetura
- `api/`: Express com rotas REST (`/api/wines`, `/api/recognition`), controllers finos, services para Supabase e API4AI, middleware de auth (JWT Supabase), erros/notFound, schemas Zod, swagger em `/api-docs`.
- `frontend/`: Vite + React com HashRouter, layouts, componentes reutilizaveis (listas, modais, toasts, banners PWA), hooks customizados (auth, PWA, wines), stores Zustand, services HTTP centralizados.
- Dados: Supabase como banco e provedor de autenticacao; service role usado na API; RLS configurado em `database/schema.sql`.
- Tests/CI: Playwright orquestra backend+frontend para E2E; pipeline GitHub Actions gera build e publica no GitHub Pages.

## Funcionalidades Principais
- Autenticacao Supabase com email/senha e OAuth (Google, Facebook, Microsoft); rotas protegidas.
- CRUD de vinhos com validacao (Zod), ordenacao client-side e visualizacao detalhada.
- Reconhecimento de vinhos por imagem (upload/camera/drag-drop) integrado ao endpoint `/api/recognition/analyze` com fallback manual.
- UI responsiva com estados de carregamento/erro, toasts, skeletons e modais de confirmacao de imagem.
- PWA pronto: manifest com icones maskable, banner de instalacao para mobile, debug panel em desenvolvimento; service worker neutro para evitar cache indevido.
- Settings basico exibindo dados da conta.

## Como Rodar Localmente
1. Backend  
   - `cd api`  
   - Criar `.env` com variaveis abaixo.  
   - `npm install`  
   - `npm start` (porta padrao 3000, health em `/health`, docs em `/api-docs`).  
2. Frontend  
   - `cd frontend`  
   - `cp .env.example .env` e ajustar variaveis.  
   - `npm install`  
   - `npm run dev` e acessar `http://localhost:5173/SmartAdega/#/` (HashRouter alinhado ao deploy em GitHub Pages).  

## Variaveis de Ambiente
- Backend (`api/.env`): `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `API4AI_KEY`, `API4AI_MOCK` (opcional para mock), `BASE_URL`, `NODE_ENV`.  
- Frontend (`frontend/.env`): `VITE_API_URL` (ex: http://localhost:3000/api), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.  

## Estrutura de Pastas do Projeto
- `api/src/` controllers, services, routes, middleware, schemas, config (swagger), db client.
- `api/database/` scripts SQL e politicas RLS.
- `frontend/src/` componentes, pages, layouts, routes, hooks, stores, services, utils, styles.
- `frontend/public/` manifest, service worker neutro, icones maskable, paginas de teste PWA.
- `.github/workflows/` pipeline de build e deploy do frontend para Pages.
- Documentacao adicional em `.md` na raiz e em `frontend/` (excluindo `instrucoes/`).

## Endpoints Principais (listagem)
- `GET /` (ping), `GET /health` (status).  
- `GET /api-docs` (Swagger UI).  
- `GET /api/wines`, `POST /api/wines`, `GET /api/wines/:id`, `PUT /api/wines/:id`, `DELETE /api/wines/:id` (JWT Supabase).  
- `POST /api/recognition/analyze` (multipart imagem).  

## Roadmap
- Adicionar service worker funcional com cache offline seguro e stratified assets.  
- Cobrir fluxos criticos com Playwright em CI e reports versionados.  
- Implementar filtros/ordenacao server-side e paginacao na API.  
- Harden de seguranca: rate limiting, helmet e logs estruturados.  
- Automatizar deploy da API e provisionamento de Secrets (Supabase + API4AI).