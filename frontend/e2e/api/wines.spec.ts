import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Testes de API REST usando request context
 * 
 * Testa endpoints /api/wines diretamente sem UI
 * Requer token JWT válido do Supabase
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let authToken: string;
let testUserId: string;

test.beforeAll(async ({ playwright }) => {
  // Obter token de autenticação do storageState
  try {
    const storageStatePath = join(__dirname, '../.auth/user.json');
    const storageStateContent = readFileSync(storageStatePath, 'utf-8');
    const storageState = JSON.parse(storageStateContent);
  
    if (storageState?.origins && storageState.origins.length > 0) {
      const origin = storageState.origins.find((o: any) => 
        o.localStorage?.some((item: any) => item.name === 'auth-storage')
      );
      
      if (origin) {
        const authItem = origin.localStorage.find((item: any) => item.name === 'auth-storage');
        if (authItem) {
          const authData = JSON.parse(authItem.value);
          authToken = authData.state?.session?.access_token;
          testUserId = authData.state?.user?.id;
          
          console.log('✅ Token obtido do storageState');
          console.log('👤 User ID:', testUserId);
        }
      }
    }
  } catch (error) {
    console.warn('⚠️  Erro ao ler storageState:', error);
  }
  
  if (!authToken) {
    console.warn('⚠️  Token não encontrado no storageState. Testes de API podem falhar.');
    console.warn('Execute o setup primeiro: npx playwright test --project setup');
  }
});

test.describe('API /api/wines - CRUD', () => {
  test('GET /api/wines retorna lista de vinhos autenticado', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/wines', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(200);
    
    const wines = await response.json();
    expect(Array.isArray(wines)).toBe(true);
    
    console.log(`📋 Vinhos retornados: ${wines.length}`);
  });

  test('POST /api/wines cria novo vinho', async ({ request }) => {
    const newWine = {
      name: 'API Test Wine',
      grape: 'Pinot Noir',
      region: 'Burgundy',
      year: 2019,
      quantity: 2,
      price: 150.50,
      rating: 4.5,
    };

    const response = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: newWine,
    });

    expect(response.status()).toBe(201);
    
    const wine = await response.json();
    expect(wine.name).toBe(newWine.name);
    expect(wine.grape).toBe(newWine.grape);
    expect(wine.year).toBe(newWine.year);
    expect(wine.id).toBeDefined();
    expect(wine.user_id).toBe(testUserId);

    console.log('✅ Vinho criado via API:', wine.id);

    // Cleanup: deletar vinho criado
    await request.delete(`http://localhost:3000/api/wines/${wine.id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });

  test('PUT /api/wines/:id atualiza vinho', async ({ request }) => {
    // Criar vinho temporário
    const createResponse = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { 
        name: 'Wine to Update', 
        grape: 'Merlot',
        year: 2020, 
        quantity: 1 
      },
    });
    
    expect(createResponse.status()).toBe(201);
    const { id } = await createResponse.json();

    // Atualizar
    const updateData = {
      name: 'Wine Updated',
      grape: 'Cabernet Sauvignon',
      year: 2021,
      quantity: 5,
      price: 200,
      rating: 5,
    };

    const updateResponse = await request.put(`http://localhost:3000/api/wines/${id}`, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: updateData,
    });

    expect(updateResponse.status()).toBe(200);
    
    const updatedWine = await updateResponse.json();
    expect(updatedWine.name).toBe('Wine Updated');
    expect(updatedWine.quantity).toBe(5);
    expect(updatedWine.price).toBe(200);

    // Cleanup
    await request.delete(`http://localhost:3000/api/wines/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });

  test('DELETE /api/wines/:id remove vinho', async ({ request }) => {
    // Criar vinho temporário
    const createResponse = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { 
        name: 'Wine to Delete', 
        grape: 'Shiraz',
        year: 2020, 
        quantity: 1 
      },
    });
    
    const { id } = await createResponse.json();

    // Deletar
    const deleteResponse = await request.delete(`http://localhost:3000/api/wines/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(deleteResponse.status()).toBe(200);

    // Verificar que não existe mais (deve retornar 404)
    const getResponse = await request.get(`http://localhost:3000/api/wines/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    expect(getResponse.status()).toBe(404);
  });

  test('GET /api/wines/:id retorna vinho específico', async ({ request }) => {
    // Criar vinho temporário
    const createResponse = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { 
        name: 'Specific Wine', 
        grape: 'Syrah',
        region: 'Rhône',
        year: 2018, 
        quantity: 3,
        price: 90,
        rating: 4.2,
      },
    });
    
    const { id } = await createResponse.json();

    // Buscar vinho específico
    const getResponse = await request.get(`http://localhost:3000/api/wines/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(getResponse.status()).toBe(200);
    
    const wine = await getResponse.json();
    expect(wine.id).toBe(id);
    expect(wine.name).toBe('Specific Wine');
    expect(wine.grape).toBe('Syrah');
    expect(wine.region).toBe('Rhône');

    // Cleanup
    await request.delete(`http://localhost:3000/api/wines/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });
});

test.describe('API /api/wines - Autenticação', () => {
  test('401 sem token de autenticação', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/wines');
    
    expect(response.status()).toBe(401);
    
    const error = await response.json();
    expect(error.error).toBeTruthy();
  });

  test('401 com token inválido', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/wines', {
      headers: { Authorization: 'Bearer invalid-token-xyz' },
    });
    
    expect(response.status()).toBe(401);
  });

  test('401 com Bearer faltando', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/wines', {
      headers: { Authorization: authToken }, // Sem 'Bearer '
    });
    
    expect(response.status()).toBe(401);
  });
});

test.describe('API /api/wines - Validação', () => {
  test('400 ao criar vinho sem campos obrigatórios', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {}, // Sem campos obrigatórios
    });

    expect(response.status()).toBe(400);
    
    const error = await response.json();
    expect(error.error).toBeTruthy();
  });

  test('400 ao criar vinho com ano inválido', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'Invalid Year Wine',
        year: 1800, // Ano inválido
        quantity: 1,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('400 ao criar vinho com quantidade negativa', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/wines', {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'Negative Quantity Wine',
        year: 2020,
        quantity: -5, // Negativo
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('API /health', () => {
  test('GET /health retorna status ok', async ({ request }) => {
    const response = await request.get('http://localhost:3000/health');
    
    expect(response.status()).toBe(200);
    
    const health = await response.json();
    expect(health.status).toBe('ok');
    expect(health.timestamp).toBeDefined();
    expect(health.uptime).toBeGreaterThan(0);
    
    console.log('💚 Health check:', health);
  });
});

test.describe('API /api/recognition/analyze', () => {
  test.skip('POST /recognition/analyze com imagem válida (skip: usa quota)', async ({ request }) => {
    // Skip por padrão para não consumir quota da API4AI
    // Descomente para testar integração real
    
    const fakeImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request.post('http://localhost:3000/api/recognition/analyze', {
      headers: { 
        // Não precisa auth para reconhecimento
      },
      multipart: {
        image: {
          name: 'test.jpg',
          mimeType: 'image/jpeg',
          buffer: fakeImageBuffer,
        },
      },
    });

    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result).toHaveProperty('nome_do_vinho');
    expect(result).toHaveProperty('uva');
    expect(result).toHaveProperty('regiao');
    expect(result).toHaveProperty('ano');
  });

  test('POST /recognition/analyze sem imagem retorna erro', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/recognition/analyze');
    
    // Sem multipart/form-data
    expect(response.status()).toBe(400);
  });
});
