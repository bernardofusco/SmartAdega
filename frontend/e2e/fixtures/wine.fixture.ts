import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Fixture customizada para criar e limpar vinhos de teste
 * 
 * Uso:
 * test('meu teste', async ({ page, testWine }) => {
 *   // testWine é um objeto com os dados do vinho criado
 *   await page.goto(`/#/wines/${testWine.id}`);
 *   // Ao final do teste, o vinho é deletado automaticamente
 * });
 */

interface Wine {
  id: string;
  name: string;
  grape: string;
  region: string;
  year: number;
  quantity: number;
  price?: number;
  rating?: number;
  user_id: string;
}

interface TestWineOptions {
  name?: string;
  grape?: string;
  region?: string;
  year?: number;
  quantity?: number;
  price?: number;
  rating?: number;
}

// Helper para pegar token do localStorage via page
async function getAuthToken(page: Page): Promise<string | null> {
  try {
    const authStorage = await page.evaluate(() => {
      const auth = localStorage.getItem('auth-storage');
      if (!auth) return null;
      const parsed = JSON.parse(auth);
      return parsed.state?.session?.access_token || null;
    });
    return authStorage;
  } catch {
    return null;
  }
}

// Fixture que cria um vinho de teste e limpa após uso
export const test = base.extend<{ testWine: Wine }>({
  testWine: async ({ page }, use) => {
    // Garantir que página está carregada e autenticada
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');
    
    const token = await getAuthToken(page);
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Execute o setup primeiro.');
    }

    // Criar vinho via API
    const wineData = {
      name: 'Test Wine Fixture',
      grape: 'Test Grape',
      region: 'Test Region',
      year: 2020,
      quantity: 1,
      price: 50,
      rating: 3.5,
    };

    const response = await page.request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: wineData,
    });

    if (!response.ok()) {
      throw new Error(`Falha ao criar vinho de teste: ${response.status()}`);
    }

    const wine: Wine = await response.json();
    console.log('🍷 Vinho de teste criado:', wine.id);

    // Fornecer vinho ao teste
    await use(wine);

    // Cleanup: deletar vinho após teste
    await page.request.delete(`http://localhost:3000/api/wines/${wine.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('🧹 Vinho de teste deletado:', wine.id);
  },
});

// Fixture que cria múltiplos vinhos de teste
export const testWithWines = base.extend<{ testWines: Wine[] }>({
  testWines: async ({ page }, use) => {
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');
    
    const token = await getAuthToken(page);
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado.');
    }

    // Criar 5 vinhos de teste
    const winesData = [
      { name: 'Alpha Test Wine', grape: 'Merlot', region: 'Bordeaux', year: 2020, quantity: 2 },
      { name: 'Beta Test Wine', grape: 'Syrah', region: 'Rhône', year: 2019, quantity: 3 },
      { name: 'Gamma Test Wine', grape: 'Malbec', region: 'Mendoza', year: 2021, quantity: 1 },
      { name: 'Delta Test Wine', grape: 'Cabernet', region: 'Napa', year: 2018, quantity: 5 },
      { name: 'Omega Test Wine', grape: 'Pinot Noir', region: 'Burgundy', year: 2022, quantity: 4 },
    ];

    const wines: Wine[] = [];

    for (const wineData of winesData) {
      const response = await page.request.post('http://localhost:3000/api/wines', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: wineData,
      });

      if (response.ok()) {
        const wine = await response.json();
        wines.push(wine);
      }
    }

    console.log(`🍷 ${wines.length} vinhos de teste criados`);

    await use(wines);

    // Cleanup: deletar todos os vinhos
    for (const wine of wines) {
      await page.request.delete(`http://localhost:3000/api/wines/${wine.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    
    console.log(`🧹 ${wines.length} vinhos de teste deletados`);
  },
});

// Helper function para criar vinho customizado
export async function createTestWine(
  page: Page, 
  options: TestWineOptions = {}
): Promise<Wine> {
  const token = await getAuthToken(page);
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado.');
  }

  const wineData = {
    name: options.name || 'Custom Test Wine',
    grape: options.grape || 'Custom Grape',
    region: options.region || 'Custom Region',
    year: options.year || 2020,
    quantity: options.quantity || 1,
    price: options.price,
    rating: options.rating,
  };

  const response = await page.request.post('http://localhost:3000/api/wines', {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: wineData,
  });

  if (!response.ok()) {
    throw new Error(`Falha ao criar vinho: ${response.status()}`);
  }

  return await response.json();
}

// Helper function para deletar vinho
export async function deleteTestWine(page: Page, wineId: string): Promise<void> {
  const token = await getAuthToken(page);
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado.');
  }

  await page.request.delete(`http://localhost:3000/api/wines/${wineId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export { expect } from '@playwright/test';
