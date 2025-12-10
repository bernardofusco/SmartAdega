const { createWineSchema } = require('./src/schemas/wineSchemas');

console.log('Testando validação do campo quantity com valores decimais...\n');

// Teste 1: Valor inteiro (deve funcionar)
try {
  const result1 = createWineSchema.parse({
    name: 'Teste 1',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: 5
  });
  console.log('? Teste 1 (inteiro): quantity = 5 -> OK');
} catch (err) {
  console.log('? Teste 1 falhou:', err.errors);
}

// Teste 2: Valor decimal (deve funcionar)
try {
  const result2 = createWineSchema.parse({
    name: 'Teste 2',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: 2.5
  });
  console.log('? Teste 2 (decimal): quantity = 2.5 -> OK');
} catch (err) {
  console.log('? Teste 2 falhou:', err.errors);
}

// Teste 3: Valor zero (deve funcionar)
try {
  const result3 = createWineSchema.parse({
    name: 'Teste 3',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: 0
  });
  console.log('? Teste 3 (zero): quantity = 0 -> OK');
} catch (err) {
  console.log('? Teste 3 falhou:', err.errors);
}

// Teste 4: Valor negativo (deve falhar)
try {
  const result4 = createWineSchema.parse({
    name: 'Teste 4',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: -1
  });
  console.log('? Teste 4 (negativo): quantity = -1 -> Deveria ter falhado!');
} catch (err) {
  console.log('? Teste 4 (negativo): quantity = -1 -> Rejeitado corretamente');
}

// Teste 5: Valor muito pequeno (deve funcionar)
try {
  const result5 = createWineSchema.parse({
    name: 'Teste 5',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: 0.25
  });
  console.log('? Teste 5 (pequeno decimal): quantity = 0.25 -> OK');
} catch (err) {
  console.log('? Teste 5 falhou:', err.errors);
}

console.log('\n? Testes concluídos! Campo quantity agora aceita valores decimais.');
