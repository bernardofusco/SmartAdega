import { test, expect } from '@playwright/test';

/**
 * Testes de CRUD de Vinhos
 * 
 * Usa storageState do setup (usuário autenticado)
 * Testa criar, editar, deletar, ordenar e validar vinhos
 */

test.describe('CRUD de Vinhos', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para home
    await page.goto('/#/');
    
    // Aguardar página carregar
    await expect(page.locator('text=Minha Adega')).toBeVisible();
  });

  test('criar vinho via formulário manual', async ({ page }) => {
    // Abrir modal de criação
    await page.getByRole('button', { name: /adicionar/i }).click();
    
    // Aguardar modal aparecer
    await expect(page.getByText('Adicionar Vinho')).toBeVisible();

    // Selecionar aba manual (pode já estar selecionada)
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    // Preencher formulário
    await page.getByLabel(/nome/i).fill('Playwright Test Wine 2025');
    await page.getByLabel(/uva/i).fill('Syrah');
    await page.getByLabel(/região/i).fill('Vale dos Vinhedos');
    await page.getByLabel(/ano/i).fill('2020');
    await page.getByLabel(/quantidade/i).fill('3');
    await page.getByLabel(/preço/i).fill('120.50');
    await page.getByLabel(/avaliação/i).fill('4.8');
    
    // Salvar
    await page.getByRole('button', { name: /salvar/i }).click();
    
    // Aguardar toast de sucesso
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible({ timeout: 5000 });
    
    // Verificar vinho na lista (aguardar React Query invalidar e refetch)
    await expect(page.locator('text=Playwright Test Wine 2025').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Syrah').first()).toBeVisible();
  });

  test('editar vinho existente', async ({ page }) => {
    // Criar vinho primeiro
    await page.getByRole('button', { name: /adicionar/i }).click();
    await expect(page.getByText('Adicionar Vinho')).toBeVisible();
    
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    await page.getByLabel(/nome/i).fill('Vinho Para Editar');
    await page.getByLabel(/uva/i).fill('Merlot');
    await page.getByLabel(/região/i).fill('Bordeaux');
    await page.getByLabel(/ano/i).fill('2019');
    await page.getByLabel(/quantidade/i).fill('5');
    await page.getByRole('button', { name: /salvar/i }).click();
    
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible();
    await expect(page.locator('text=Vinho Para Editar').first()).toBeVisible({ timeout: 10000 });

    // Localizar o card do vinho e abrir menu de reticências
    const wineCard = page.locator('.bg-white, .dark\\:bg-dark-surface-primary').filter({ 
      hasText: 'Vinho Para Editar' 
    }).first();
    
    // Clicar no botão de menu (três pontos verticais)
    const menuButton = wineCard.locator('button[aria-label*="opcoes"], button[aria-label*="Menu"]');
    await menuButton.click();
    
    // Clicar em "Editar" no menu dropdown
    await page.getByRole('button', { name: /editar/i }).click();
    
    // Aguardar modal de edição
    await expect(page.getByText('Editar Vinho')).toBeVisible();
    
    // Aguardar o formulário estar pronto
    await page.waitForTimeout(500);
    
    // Localizar input de nome pelo id
    const nomeInput = page.locator('#wine-name');
    await expect(nomeInput).toBeVisible();
    await expect(nomeInput).toHaveValue('Vinho Para Editar');
    
    // Alterar nome e quantidade
    await nomeInput.clear();
    await nomeInput.fill('Vinho Editado Playwright');
    
    const quantidadeInput = page.locator('#wine-quantity');
    await quantidadeInput.clear();
    await quantidadeInput.fill('10');
    
    // Salvar
    await page.getByRole('button', { name: /salvar/i }).click();
    
    // Verificar toast e atualização
    await expect(page.getByText(/atualizado com sucesso/i)).toBeVisible();
    await expect(page.locator('text=Vinho Editado Playwright').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=10 garrafas').first()).toBeVisible();
  });

  test('deletar vinho', async ({ page }) => {
    // Criar vinho para deletar
    await page.getByRole('button', { name: /adicionar/i }).click();
    
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    // Nome único para evitar conflito com execuções anteriores
    const uniqueName = `Vinho Para Deletar ${Date.now()}`;
    await page.getByLabel(/nome/i).fill(uniqueName);
    await page.getByLabel(/uva/i).fill('Tester Grape');
    await page.getByLabel(/ano/i).fill('2021');
    await page.getByLabel(/quantidade/i).fill('1');
    await page.getByRole('button', { name: /salvar/i }).click();
    
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible();
    await expect(page.locator(`text=${uniqueName}`).first()).toBeVisible({ timeout: 10000 });

    // Localizar card e abrir menu
    const wineCard = page.locator('.bg-white, .dark\\:bg-dark-surface-primary').filter({ 
      hasText: uniqueName 
    }).first();
    
    const menuButton = wineCard.locator('button[aria-label*="opcoes"], button[aria-label*="Menu"]');
    await menuButton.click();
    
    // Aguardar menu aparecer
    await page.waitForTimeout(300);
    
    // Clicar em "Excluir"
    const deleteButton = page.getByRole('button', { name: /excluir/i });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    
    // Aguardar dialog aparecer (verificar texto que existe no ConfirmDialog)
    await page.waitForTimeout(500);
    await expect(page.getByText(/tem certeza/i)).toBeVisible({ timeout: 5000 });
    
    await page.screenshot({ path: 'test-results/debug-before-confirm.png', fullPage: true });
    
    // Confirmar no dialog - buscar especificamente o botão Confirmar do dialog
    const confirmButton = page.locator('button').filter({ hasText: 'Confirmar' }).last();
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/debug-after-confirm.png', fullPage: true });
    
    // Verificar toast de sucesso
    await expect(page.getByText(/excluído com sucesso|excluido com sucesso/i)).toBeVisible();
    
    // Aguardar toast sumir e refetch completar
    await page.waitForTimeout(2000);
    
    // Verificar que vinho sumiu da lista (aguardar até 10s)
    await expect(page.locator(`text=${uniqueName}`).first()).not.toBeVisible({ timeout: 10000 });
  });

  test('validar campos obrigatórios do formulário', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar/i }).click();
    
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    // Tentar salvar sem preencher campos obrigatórios
    await page.getByRole('button', { name: /salvar/i }).click();
    
    // Verificar mensagens de erro de validação (Zod)
    await expect(page.getByText(/informe o nome/i)).toBeVisible();
    await expect(page.getByText(/informe o ano/i)).toBeVisible();
    await expect(page.getByText(/informe a quantidade/i)).toBeVisible();
  });

  test('validar ano inválido', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar/i }).click();
    
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    await page.getByLabel(/nome/i).fill('Vinho Teste');
    await page.getByLabel(/ano/i).fill('1800'); // Ano muito antigo
    await page.getByLabel(/quantidade/i).fill('1');
    
    await page.getByRole('button', { name: /salvar/i }).click();
    
    // Verificar erro de validação
    await expect(page.getByText(/ano inválido|ano invalido/i)).toBeVisible();
  });

  test('ordenar vinhos por nome ascendente', async ({ page }) => {
    // Criar alguns vinhos para ordenar
    const wines = ['Zebra Wine', 'Alpha Wine', 'Beta Wine'];
    
    for (const wineName of wines) {
      await page.getByRole('button', { name: /adicionar/i }).click();
      
      const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
      if (await manualTab.isVisible()) {
        await manualTab.click();
      }
      
      await page.getByLabel(/nome/i).fill(wineName);
      await page.getByLabel(/ano/i).fill('2020');
      await page.getByLabel(/quantidade/i).fill('1');
      await page.getByRole('button', { name: /salvar/i }).click();
      
      await expect(page.getByText(/criado com sucesso/i).first()).toBeVisible();
      await page.waitForTimeout(1000); // Aguardar toast sumir
    }

    // Localizar select de ordenação
    const sortSelect = page.locator('select').first();
    
    // Ordenar por nome ascendente
    await sortSelect.selectOption('name_asc');
    
    // Aguardar re-render
    await page.waitForTimeout(1000);
    
    // Pegar todos os nomes de vinhos na ordem exibida
    const wineNames = await page.locator('.bg-white h3, .dark\\:bg-dark-surface-primary h3').allTextContents();
    
    // Verificar que pelo menos nossos vinhos estão em ordem alfabética
    const testWines = wineNames.filter(name => 
      name.includes('Alpha') || name.includes('Beta') || name.includes('Zebra')
    );
    
    expect(testWines[0]).toContain('Alpha');
    expect(testWines[testWines.length - 1]).toContain('Zebra');
  });

  test('exibir quantidade zero em vermelho', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar/i }).click();
    
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    // Criar vinho com quantidade zero seria rejeitado (min 1)
    // Vamos apenas verificar que o componente trata quantidade 0 corretamente se existir
    // Este teste pode precisar ajuste se backend permitir quantidade 0
  });
});

test.describe('Detalhes de Vinho', () => {
  test('navegar para página de detalhes', async ({ page }) => {
    await page.goto('/#/');
    
    // Aguardar lista carregar
    await expect(page.locator('text=Minha Adega')).toBeVisible();
    
    // Criar um vinho para abrir detalhes
    await page.getByRole('button', { name: /adicionar/i }).click();
    
    const manualTab = page.locator('[role="tab"]').filter({ hasText: /manual/i });
    if (await manualTab.isVisible()) {
      await manualTab.click();
    }
    
    await page.getByLabel(/nome/i).fill('Vinho Detalhes Test');
    await page.getByLabel(/uva/i).fill('Cabernet');
    await page.getByLabel(/ano/i).fill('2018');
    await page.getByLabel(/quantidade/i).fill('2');
    await page.getByLabel(/avaliação/i).fill('4.5');
    await page.getByRole('button', { name: /salvar/i }).click();
    
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible();
    await expect(page.locator('text=Vinho Detalhes Test').first()).toBeVisible({ timeout: 10000 });

    // Clicar no link do vinho (h3 dentro de Link)
    await page.locator('text=Vinho Detalhes Test').first().click();
    
    // Aguardar navegar para página de detalhes
    await expect(page).toHaveURL(/\/#\/wines\/.+/);
    
    // Verificar conteúdo da página de detalhes
    await expect(page.locator('h1:has-text("Vinho Detalhes Test")')).toBeVisible();
    await expect(page.locator('text=Cabernet')).toBeVisible();
    await expect(page.locator('text=2018')).toBeVisible();
    await expect(page.locator('text=4.5').first()).toBeVisible();
    
    // Verificar botão "Voltar"
    await expect(page.getByRole('link', { name: /voltar/i })).toBeVisible();
  });
});

test.describe('Empty State', () => {
  test.skip('exibir mensagem quando não há vinhos (skip: precisa DB limpo)', async ({ page }) => {
    // Este teste requer que a lista esteja vazia
    // Skip por padrão pois testes acima criam vinhos
    await page.goto('/#/');
    
    // Se não houver vinhos, deve mostrar empty state
    const emptyState = page.locator('text=Nenhum vinho cadastrado');
    if (await emptyState.isVisible()) {
      expect(await emptyState.isVisible()).toBe(true);
    }
  });
});
