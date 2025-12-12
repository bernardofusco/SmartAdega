const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erros de validação Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({ 
      error: 'Dados invalidos', 
      details: err.errors.map(e => e.message).join(', ')
    });
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token inválido ou expirado'
    });
  }

  // Erros do Multer (upload de arquivos)
  if (err.message === 'Apenas imagens sao permitidas' || 
      err.code === 'LIMIT_FILE_SIZE' || 
      err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      error: err.message || 'Erro no upload de arquivo'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
