const { z } = require('zod');

const createWineSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  grape: z.string().min(1, 'Uva e obrigatoria'),
  region: z.string().min(1, 'Regiao e obrigatoria'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1, 'Ano invalido'),
  price: z.number().positive('Preco deve ser positivo'),
  rating: z.number().min(0).max(5, 'Rating deve estar entre 0 e 5'),
  quantity: z.number().int().min(0, 'Quantidade deve ser maior ou igual a 0')
});

const updateWineSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio').optional(),
  grape: z.string().min(1, 'Uva e obrigatoria').optional(),
  region: z.string().min(1, 'Regiao e obrigatoria').optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1, 'Ano invalido').optional(),
  price: z.number().positive('Preco deve ser positivo').optional(),
  rating: z.number().min(0).max(5, 'Rating deve estar entre 0 e 5').optional(),
  quantity: z.number().int().min(0, 'Quantidade deve ser maior ou igual a 0').optional()
});

module.exports = {
  createWineSchema,
  updateWineSchema
};
