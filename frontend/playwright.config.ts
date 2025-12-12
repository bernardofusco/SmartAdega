import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env
dotenv.config();

/**
 * Configuração do Playwright para SmartAdega
 * 
 * - Hash Router: todas as rotas usam /#/
 * - Base URL: http://localhost:5173 (dev mode, sem /SmartAdega/)
 * - Auth: storageState salvo em e2e/.auth/user.json pelo setup
 * - Backend: http://localhost:3000
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : [])
  ],
  
  use: {
    baseURL: 'http://localhost:5173/SmartAdega',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },

  projects: [
    // Setup: executa antes de todos os testes para fazer login
    { 
      name: 'setup', 
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    
    // Testes E2E com autenticação (exclui auth.spec.ts)
    {
      name: 'chromium',
      testIgnore: /auth\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Reutiliza sessão criada pelo setup
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    
    // Opcional: testes sem autenticação (login/signup)
    {
      name: 'chromium-no-auth',
      testMatch: /auth\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Sem storageState = sem sessão
      },
    },
  ],

  // Inicia backend e frontend automaticamente antes dos testes
  webServer: [
    {
      command: 'cd ../api && npm start',
      url: 'http://localhost:3000/health',
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        // Variáveis explícitas necessárias para o backend
        SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || '',
        API4AI_KEY: process.env.API4AI_KEY || 'mock',
        API4AI_MOCK: 'true',
        PORT: '3000',
      },
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
