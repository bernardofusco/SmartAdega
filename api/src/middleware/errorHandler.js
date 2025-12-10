const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ZodError') {
    return res.status(400).json({ 
      error: 'Dados invalidos', 
      details: err.errors.map(e => e.message).join(', ')
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
