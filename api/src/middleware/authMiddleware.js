const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de autenticação não fornecido' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token JWT do Supabase
    const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
    
    if (!supabaseJwtSecret) {
      console.error('SUPABASE_JWT_SECRET não configurado');
      return res.status(500).json({ error: 'Configuração de autenticação inválida' });
    }

    // Decodificar o token JWT do Supabase
    const decoded = jwt.verify(token, supabaseJwtSecret, {
      algorithms: ['HS256'] // Supabase usa HS256
    });
    
    console.log('✅ Token válido para usuário:', decoded.sub);
    
    // Adicionar userId ao request
    req.userId = decoded.sub; // 'sub' é o user ID no JWT do Supabase
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('❌ Erro de autenticação:', error.message);
    
    // Se for erro de signature, dar mais detalhes
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Secret usado:', process.env.SUPABASE_JWT_SECRET ? 'Configurado' : 'NÃO CONFIGURADO');
    }
    
    return res.status(401).json({ 
      error: 'Token inválido ou expirado',
      detail: error.message
    });
  }
};

module.exports = authMiddleware;
