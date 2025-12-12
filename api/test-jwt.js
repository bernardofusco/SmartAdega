require('dotenv').config()
const jwt = require('jsonwebtoken')

console.log('\n=== TESTE DE JWT SECRET ===\n')

// Token de exemplo do Supabase (pegar do console do frontend após login)
const sampleToken = process.argv[2]

if (!sampleToken) {
  console.log('❌ Uso: node test-jwt.js <TOKEN_DO_FRONTEND>')
  console.log('\nPara pegar o token:')
  console.log('1. Faça login no frontend')
  console.log('2. Abra DevTools → Console')
  console.log('3. Digite: localStorage.getItem("auth-storage")')
  console.log('4. Copie o access_token')
  console.log('5. Execute: node test-jwt.js "seu-token-aqui"\n')
  process.exit(1)
}

const jwtSecret = process.env.SUPABASE_JWT_SECRET

console.log('JWT Secret configurado:', !!jwtSecret)
console.log('JWT Secret length:', jwtSecret?.length)
console.log('JWT Secret (primeiros 20 chars):', jwtSecret?.substring(0, 20) + '...\n')

console.log('Tentando decodificar token...\n')

try {
  const decoded = jwt.verify(sampleToken, jwtSecret, {
    algorithms: ['HS256']
  })
  
  console.log('✅ TOKEN VÁLIDO!')
  console.log('\nDados decodificados:')
  console.log('- User ID:', decoded.sub)
  console.log('- Email:', decoded.email)
  console.log('- Role:', decoded.role)
  console.log('- Expira em:', new Date(decoded.exp * 1000).toLocaleString())
  console.log('\n✅ JWT SECRET ESTÁ CORRETO!\n')
  
} catch (error) {
  console.log('❌ ERRO AO VALIDAR TOKEN!')
  console.log('Erro:', error.message)
  console.log('\n⚠️  JWT SECRET ESTÁ INCORRETO!')
  console.log('\nPara corrigir:')
  console.log('1. Acesse: https://app.supabase.com')
  console.log('2. Selecione seu projeto')
  console.log('3. Settings → API')
  console.log('4. Copie o "JWT Secret" (não confunda com anon ou service role key)')
  console.log('5. Cole no arquivo .env: SUPABASE_JWT_SECRET=<secret-copiado>')
  console.log('6. Reinicie o servidor\n')
}
