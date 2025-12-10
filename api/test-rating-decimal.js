const { createWineSchema } = require('./src/schemas/wineSchemas');

console.log('Testando validação do campo rating com valores decimais...\n');

// Teste 1: Rating inteiro (deve funcionar)
try {
  const result1 = createWineSchema.parse({
    name: 'Teste 1',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 5,
    quantity: 3
  });
  console.log('? Teste 1 (inteiro): rating = 5 -> OK');
} catch (err) {
  console.log('? Teste 1 falhou:', err.errors[0].message);
}

// Teste 2: Rating decimal (deve funcionar)
try {
  const result2 = createWineSchema.parse({
    name: 'Teste 2',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4.5,
    quantity: 3
  });
  console.log('? Teste 2 (decimal): rating = 4.5 -> OK');
} catch (err) {
  console.log('? Teste 2 falhou:', err.errors[0].message);
}

// Teste 3: Rating com decimal fino (deve funcionar)
try {
  const result3 = createWineSchema.parse({
    name: 'Teste 3',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 3.75,
    quantity: 3
  });
  console.log('? Teste 3 (decimal fino): rating = 3.75 -> OK');
} catch (err) {
  console.log('? Teste 3 falhou:', err.errors[0].message);
}

// Teste 4: Rating zero (deve funcionar)
try {
  const result4 = createWineSchema.parse({
    name: 'Teste 4',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 0,
    quantity: 3
  });
  console.log('? Teste 4 (zero): rating = 0 -> OK');
} catch (err) {
  console.log('? Teste 4 falhou:', err.errors[0].message);
}

// Teste 5: Rating negativo (deve falhar)
try {
  const result5 = createWineSchema.parse({
    name: 'Teste 5',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: -1,
    quantity: 3
  });
  console.log('? Teste 5 (negativo): rating = -1 -> Deveria ter falhado!');
} catch (err) {
  console.log('? Teste 5 (negativo): rating = -1 -> Rejeitado corretamente');
}

// Teste 6: Rating maior que 5 (deve falhar)
try {
  const result6 = createWineSchema.parse({
    name: 'Teste 6',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 5.5,
    quantity: 3
  });
  console.log('? Teste 6 (> 5): rating = 5.5 -> Deveria ter falhado!');
} catch (err) {
  console.log('? Teste 6 (> 5): rating = 5.5 -> Rejeitado corretamente');
}

// Teste 7: Quantity decimal (deve falhar agora)
try {
  const result7 = createWineSchema.parse({
    name: 'Teste 7',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: 2.5
  });
  console.log('? Teste 7 (quantity decimal): quantity = 2.5 -> Deveria ter falhado!');
} catch (err) {
  console.log('? Teste 7 (quantity decimal): quantity = 2.5 -> Rejeitado corretamente');
}

// Teste 8: Quantity inteiro (deve funcionar)
try {
  const result8 = createWineSchema.parse({
    name: 'Teste 8',
    grape: 'Merlot',
    region: 'Italia',
    year: 2020,
    price: 100.00,
    rating: 4,
    quantity: 5
  });
  console.log('? Teste 8 (quantity inteiro): quantity = 5 -> OK');
} catch (err) {
  console.log('? Teste 8 falhou:', err.errors[0].message);
}

console.log('\n? Testes concluídos! Rating agora aceita decimais, quantity permanece inteiro.');
