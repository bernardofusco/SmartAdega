require('dotenv').config();
const supabase = require('./src/db/supabase');

async function testConnection() {
  console.log('Testando conexao com Supabase...');
  console.log('URL:', process.env.SUPABASE_URL);
  console.log('Key presente:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    const { data, error } = await supabase
      .from('wines')
      .select('count');
    
    if (error) {
      console.error('Erro ao conectar:', error);
      return;
    }
    
    console.log('Conexao bem-sucedida!');
    console.log('Resultado:', data);
  } catch (err) {
    console.error('Erro:', err);
  }
}

testConnection();
