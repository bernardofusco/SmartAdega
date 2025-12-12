import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

/**
 * Credenciais de teste - CRIAR USUÁRIO MANUALMENTE NO SUPABASE
 * 
 * Criar usuário com email test-e2e@smartadega.com no Supabase Auth:
 * 1. Acessar Supabase Dashboard → Authentication → Users
 * 2. Clicar em "Add user" → "Create new user"
 * 3. Email: test-e2e@smartadega.com
 * 4. Password: Test123!@#
 * 5. Confirmar email automaticamente
 * 
 * Ou via SQL no Supabase SQL Editor (para confirmar email):
 * UPDATE auth.users 
 * SET email_confirmed_at = NOW() 
 * WHERE email = 'test-e2e@smartadega.com';
 */
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test-e2e@smartadega.com',
  password: process.env.TEST_USER_PASSWORD || 'Test123!@#',
};

setup('authenticate', async ({ page }) => {
  console.log('🔐 Realizando login para testes E2E...');
  console.log('📧 Email:', TEST_USER.email);
  
  // Usar baseURL configurado (http://localhost:5173/SmartAdega)
  await page.goto('/#/login');
  
  // Aguardar formulário carregar
  await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
  
  // Preencher credenciais
  await page.getByPlaceholder('seu@email.com').fill(TEST_USER.email);
  await page.getByPlaceholder('••••••••').fill(TEST_USER.password);
  
  // Clicar no botão de login (buscar por texto "Entrar")
  await page.getByRole('button', { name: /entrar/i }).click();
  
  // Aguardar redirect para home - URL completa com baseURL
  await page.waitForURL(/\/SmartAdega\/#\/$/, { timeout: 10000 });
  
  // Verificar que chegou na home autenticada
  await expect(page.locator('text=Minha Adega')).toBeVisible({ timeout: 10000 });
  
  console.log('✅ Login bem-sucedido!');
  
  // Salvar estado de autenticação (inclui localStorage com auth-storage)
  await page.context().storageState({ path: authFile });
  
  console.log('💾 Estado de autenticação salvo em', authFile);
  console.log('🎉 Setup completo! Testes podem reutilizar esta sessão.');
});
