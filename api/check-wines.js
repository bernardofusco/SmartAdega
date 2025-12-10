require('dotenv').config();
const supabase = require('./src/db/supabase');

async function checkWines() {
  try {
    console.log('Consultando vinhos no banco...\n');
    
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erro:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log(`Encontrados ${data.length} vinhos:\n`);
      data.forEach((wine, index) => {
        console.log(`--- Vinho ${index + 1} ---`);
        console.log(`ID: ${wine.id}`);
        console.log(`User ID: ${wine.user_id}`);
        console.log(`ID === User ID? ${wine.id === wine.user_id ? '?? SIM (PROBLEMA!)' : '? NÃO (OK)'}`);
        console.log(`Nome: ${wine.name}`);
        console.log(`Criado em: ${wine.created_at}\n`);
      });
    } else {
      console.log('Nenhum vinho encontrado no banco.');
    }
  } catch (err) {
    console.error('Erro ao consultar:', err);
  }
}

checkWines();
