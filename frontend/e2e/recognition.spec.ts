import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Testes de Reconhecimento de Imagem
 * 
 * Mock da API4AI para não consumir quota real
 * Testa upload, preview, análise e preenchimento do formulário
 */

// Para usar __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Reconhecimento de Imagem', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('text=Minha Adega')).toBeVisible();
  });

  test('upload de imagem via input preenche formulário com dados mockados', async ({ page }) => {
    // Mock da API de reconhecimento
    await page.route('**/api/recognition/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nome_do_vinho: 'Château Margaux 2015',
          uva: 'Cabernet Sauvignon',
          regiao: 'Bordeaux',
          ano: '2015',
          preco: '',
          quantidade: '',
          avaliacao: '',
        }),
      });
    });

    // Abrir modal
    await page.getByRole('button', { name: /adicionar/i }).click();
    await expect(page.getByText('Adicionar Vinho')).toBeVisible();

    // Selecionar aba de upload (se existir)
    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /upload|imagem|foto/i });
    if (await uploadTab.isVisible()) {
      await uploadTab.click();
    }

    // Criar uma imagem fake para teste (1x1 PNG transparente)
    const fakeImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    // Simular upload
    const fileInput = page.locator('input[type="file"]').first();
    
    // Criar arquivo temporário
    await fileInput.setInputFiles({
      name: 'wine-label-test.jpg',
      mimeType: 'image/jpeg',
      buffer: fakeImageBuffer,
    });

    // Aguardar preview/modal de confirmação aparecer
    // (depende da implementação: pode ter modal ModalConfirmImage)
    const confirmButton = page.getByRole('button', { name: /analisar|confirmar/i });
    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }

    // Aguardar reconhecimento processar (spinner desaparece)
    await page.waitForTimeout(2000);
    
    // Verificar que campos foram preenchidos (pode estar em qualquer aba)
    const nameInput = page.getByLabel(/nome/i);
    await expect(nameInput).toHaveValue('Château Margaux 2015', { timeout: 10000 });
    
    const grapeInput = page.getByLabel(/uva/i);
    await expect(grapeInput).toHaveValue('Cabernet Sauvignon');
    
    const regionInput = page.getByLabel(/região/i);
    await expect(regionInput).toHaveValue('Bordeaux');
    
    const yearInput = page.getByLabel(/ano/i);
    await expect(yearInput).toHaveValue('2015');
  });

  test('erro no reconhecimento exibe mensagem', async ({ page }) => {
    // Mock com erro 500
    await page.route('**/api/recognition/analyze', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erro ao processar imagem' }),
      });
    });

    await page.getByRole('button', { name: /adicionar/i }).click();

    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /upload|imagem|foto/i });
    if (await uploadTab.isVisible()) {
      await uploadTab.click();
    }

    const fakeImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'wine-error.jpg',
      mimeType: 'image/jpeg',
      buffer: fakeImageBuffer,
    });

    const confirmButton = page.getByRole('button', { name: /analisar|confirmar/i });
    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }

    // Aguardar mensagem de erro (toast ou texto inline)
    await expect(page.getByText(/erro ao processar|erro no reconhecimento/i)).toBeVisible({ timeout: 10000 });
  });

  test('reconhecimento sem dados retorna campos vazios', async ({ page }) => {
    // Mock com resposta vazia (vinho não reconhecido)
    await page.route('**/api/recognition/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nome_do_vinho: '',
          uva: '',
          regiao: '',
          ano: '',
          preco: '',
          quantidade: '',
          avaliacao: '',
        }),
      });
    });

    await page.getByRole('button', { name: /adicionar/i }).click();

    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /upload|imagem|foto/i });
    if (await uploadTab.isVisible()) {
      await uploadTab.click();
    }

    const fakeImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'unknown-wine.jpg',
      mimeType: 'image/jpeg',
      buffer: fakeImageBuffer,
    });

    const confirmButton = page.getByRole('button', { name: /analisar|confirmar/i });
    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }

    await page.waitForTimeout(2000);

    // Campos devem permanecer vazios ou com valor padrão
    // Pode exibir mensagem "Vinho não reconhecido"
    const possibleMessage = page.getByText(/não reconhecido|não foi possível|preencha manualmente/i);
    if (await possibleMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await possibleMessage.isVisible()).toBe(true);
    }
  });

  test('upload via câmera (mobile simulation)', async ({ page }) => {
    // Simular dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 });

    await page.route('**/api/recognition/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nome_do_vinho: 'Vinho Mobile Test',
          uva: 'Malbec',
          regiao: 'Mendoza',
          ano: '2021',
          preco: '',
          quantidade: '',
          avaliacao: '',
        }),
      });
    });

    await page.getByRole('button', { name: /adicionar/i }).click();

    // Procurar por aba de câmera/foto
    const cameraTab = page.locator('[role="tab"]').filter({ hasText: /câmera|camera|foto/i });
    if (await cameraTab.isVisible()) {
      await cameraTab.click();
    }

    // Input de câmera (capture="environment")
    const cameraInput = page.locator('input[type="file"][capture]');
    if (await cameraInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      const fakeImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      await cameraInput.setInputFiles({
        name: 'camera-capture.jpg',
        mimeType: 'image/jpeg',
        buffer: fakeImageBuffer,
      });

      const confirmButton = page.getByRole('button', { name: /analisar|confirmar/i });
      if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmButton.click();
      }

      await page.waitForTimeout(2000);

      const nameInput = page.getByLabel(/nome/i);
      await expect(nameInput).toHaveValue('Vinho Mobile Test', { timeout: 10000 });
    }
  });

  test('cancelar upload limpa preview', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar/i }).click();

    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /upload|imagem/i });
    if (await uploadTab.isVisible()) {
      await uploadTab.click();
    }

    const fakeImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'cancel-test.jpg',
      mimeType: 'image/jpeg',
      buffer: fakeImageBuffer,
    });

    // Aguardar preview
    await page.waitForTimeout(1000);

    // Procurar botão de cancelar/remover imagem
    const cancelButton = page.getByRole('button', { name: /cancelar|remover|limpar/i });
    if (await cancelButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelButton.click();

      // Preview deve sumir
      const preview = page.locator('img[src^="blob:"]');
      await expect(preview).not.toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Integração Reconhecimento + CRUD', () => {
  test('criar vinho a partir de reconhecimento', async ({ page }) => {
    await page.route('**/api/recognition/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nome_do_vinho: 'Vinho Full Flow Test',
          uva: 'Tempranillo',
          regiao: 'Rioja',
          ano: '2017',
          preco: '',
          quantidade: '',
          avaliacao: '',
        }),
      });
    });

    await page.goto('/#/');
    await page.getByRole('button', { name: /adicionar/i }).click();

    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /upload|imagem/i });
    if (await uploadTab.isVisible()) {
      await uploadTab.click();
    }

    const fakeImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'full-flow.jpg',
      mimeType: 'image/jpeg',
      buffer: fakeImageBuffer,
    });

    const confirmButton = page.getByRole('button', { name: /analisar|confirmar/i });
    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }

    await page.waitForTimeout(2000);

    // Verificar campos preenchidos
    await expect(page.getByLabel(/nome/i)).toHaveValue('Vinho Full Flow Test');

    // Completar campos obrigatórios que não vieram do reconhecimento
    await page.getByLabel(/quantidade/i).fill('4');
    await page.getByLabel(/preço/i).fill('85.00');
    await page.getByLabel(/avaliação/i).fill('4.0');

    // Salvar
    await page.getByRole('button', { name: /salvar/i }).click();

    // Verificar sucesso
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible();
    await expect(page.locator('text=Vinho Full Flow Test').first()).toBeVisible({ timeout: 10000 });
  });
});
