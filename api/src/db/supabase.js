const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useMock = process.env.USE_MOCK_SUPABASE === 'true';

// Permite modo mock em PRs de fork (sem acesso a secrets reais)
if (!supabaseUrl || !supabaseKey) {
  if (useMock || process.env.NODE_ENV === 'test') {
    console.warn('⚠️ Supabase em modo MOCK (sem credenciais reais). Alguns testes podem falhar.');
    // Cria cliente mock que não falhará na inicialização
    module.exports = createClient(
      'https://mock.supabase.co',
      'mock-service-role-key-for-testing-only'
    );
  } else {
    throw new Error('Variaveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sao obrigatorias');
  }
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
}
