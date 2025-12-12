import { test, expect } from '@playwright/test';

/**
 * Testes de Autenticação e Proteção de Rotas
 * 
 * Estes testes rodam SEM storageState (projeto chromium-no-auth)
 * para testar login/signup desde o início
 */

test.describe('Autenticação', () => {
  test('login com credenciais válidas redireciona para home', async ({ page }) => {
    await page.goto('/#/login');

    // Preencher formulário
    await page.getByPlaceholder('seu@email.com').fill('test-e2e@smartadega.com');
    await page.getByPlaceholder('••••••••').fill('Test123!@#');
    
    // Submeter
    await page.getByRole('button', { name: /entrar/i }).click();

    // Aguardar redirect para home
    await expect(page).toHaveURL(/\/#\/$/, { timeout: 10000 });
    
    // Verificar conteúdo da home
    await expect(page.locator('text=Minha Adega')).toBeVisible();
    
    // Verificar que botão "Adicionar" está presente (indica que está autenticado)
    await expect(page.getByRole('button', { name: /adicionar/i })).toBeVisible();
  });

  test('login com credenciais inválidas exibe erro', async ({ page }) => {
    await page.goto('/#/login');

    await page.getByPlaceholder('seu@email.com').fill('wrong@email.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Aguardar mensagem de erro
    await expect(page.getByText(/dados incorretos/i)).toBeVisible({ timeout: 5000 });
    
    // Não deve redirecionar
    await expect(page).toHaveURL(/\/#\/login/);
  });

  test('rota protegida redireciona para login se não autenticado', async ({ page, context }) => {
    // Limpar qualquer sessão existente
    await context.clearCookies();
    await page.goto('/#/login');
    await page.evaluate(() => localStorage.clear());

    // Tentar acessar rota protegida
    await page.goto('/#/');

    // Deve redirecionar para login
    await expect(page).toHaveURL(/\/#\/login/, { timeout: 5000 });
  });

  test('campos de login vazios exibem validação', async ({ page }) => {
    await page.goto('/#/login');

    // Tentar submeter sem preencher
    await page.getByRole('button', { name: /entrar/i }).click();

    // Navegador deve mostrar validação de campos required
    const emailInput = page.getByPlaceholder('seu@email.com');
    const passwordInput = page.getByPlaceholder('••••••••');
    
    // Verificar que inputs têm atributo required
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });
});

test.describe('Persistência de Sessão', () => {
  // Este teste USA auth do setup
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('sessão persiste após reload da página', async ({ page }) => {
    await page.goto('/#/');
    
    // Verificar que está autenticado
    await expect(page.locator('text=Minha Adega')).toBeVisible();

    // Recarregar página
    await page.reload();

    // Sessão deve persistir (sem redirect para login)
    await expect(page).toHaveURL(/\/#\/$/);
    await expect(page.locator('text=Minha Adega')).toBeVisible({ timeout: 5000 });
    
    // Verificar que localStorage ainda tem auth-storage
    const authStorage = await page.evaluate(() => {
      return localStorage.getItem('auth-storage');
    });
    
    expect(authStorage).toBeTruthy();
    expect(authStorage).toContain('access_token');
  });

  test('token inválido (401) limpa sessão e redireciona', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('text=Minha Adega')).toBeVisible();

    // Corromper token no localStorage
    await page.evaluate(() => {
      const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      auth.state.session.access_token = 'invalid-token-xyz-corrupted';
      localStorage.setItem('auth-storage', JSON.stringify(auth));
    });

    // Interceptar próxima requisição à API e retornar 401
    await page.route('**/api/wines*', (route) => {
      route.fulfill({ 
        status: 401, 
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Token inválido ou expirado' }) 
      });
    });

    // Forçar uma requisição (ex: recarregar lista de vinhos)
    await page.reload();
    
    // Aguardar um pouco para interceptor agir
    await page.waitForTimeout(2000);

    // Deve redirecionar para login
    await expect(page).toHaveURL(/\/#\/login/, { timeout: 10000 });
  });
});

test.describe('Signup', () => {
  test('formulário de cadastro está acessível', async ({ page, context }) => {
    // Limpar qualquer sessão residual
    await context.clearCookies();
    await page.goto('/#/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Clicar em link para signup
    await page.getByRole('link', { name: /criar conta/i }).click();
    
    // Deve navegar para signup
    await expect(page).toHaveURL(/\/#\/signup/);
    
    // Verificar campos do formulário (email, senha, confirmar senha)
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••').first()).toBeVisible();
    
    // Verificar título da página (usar heading para ser mais específico)
    await expect(page.getByRole('heading', { name: /criar conta/i })).toBeVisible();
  });

  test.skip('signup com dados válidos cria conta (skip: não implementar cadastro real)', async ({ page }) => {
    // Este teste está marcado como skip para não criar contas reais
    // Descomente e ajuste se quiser testar signup completo
    await page.goto('/#/signup');
    
    const randomEmail = `test-${Date.now()}@example.com`;
    
    await page.getByPlaceholder(/nome/i).fill('Teste User');
    await page.getByPlaceholder(/email/i).fill(randomEmail);
    await page.getByPlaceholder(/senha/i).first().fill('Password123!');
    await page.getByPlaceholder(/confirme/i).fill('Password123!');
    
    await page.getByRole('button', { name: /criar conta/i }).click();
    
    // Aguardar mensagem de sucesso ou redirect
    await expect(page.getByText(/cadastro realizado/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('OAuth Social Login', () => {
  test.skip('botões de login social estão presentes (skip: não testar OAuth real)', async ({ page }) => {
    await page.goto('/#/login');
    
    // Verificar que botões de OAuth estão visíveis
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /facebook/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /microsoft/i })).toBeVisible();
    
    // Não clicar (OAuth redireciona para fora do app)
  });
});
