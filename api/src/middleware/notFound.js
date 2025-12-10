const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
};

module.exports = notFound;
