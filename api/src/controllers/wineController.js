const wineService = require('../services/wineService');
const { createWineSchema, updateWineSchema } = require('../schemas/wineSchemas');

class WineController {
  async createWine(req, res, next) {
    try {
      // TEMPORÁRIO: pegar userId do header ou usar default
      const userId = req.headers['x-user-id'] || req.userId || '7d7b71de-593b-4e29-b121-8fa6d9b7050b';

      const validatedData = createWineSchema.parse(req.body);
      const wine = await wineService.createWine(validatedData, userId);

      res.status(201).json(wine);
    } catch (error) {
      next(error);
    }
  }

  async getWines(req, res, next) {
    try {
      // TEMPORÁRIO: pegar userId do header ou usar default
      const userId = req.headers['x-user-id'] || req.userId || '7d7b71de-593b-4e29-b121-8fa6d9b7050b';

      const wines = await wineService.getWinesByUser(userId);

      res.status(200).json(wines);
    } catch (error) {
      next(error);
    }
  }

  async getWineById(req, res, next) {
    try {
      // TEMPORÁRIO: pegar userId do header ou usar default
      const userId = req.headers['x-user-id'] || req.userId || '7d7b71de-593b-4e29-b121-8fa6d9b7050b';
      const { id } = req.params;

      const wine = await wineService.getWineById(id, userId);

      res.status(200).json(wine);
    } catch (error) {
      if (error.message === 'Vinho nao encontrado') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async updateWine(req, res, next) {
    try {
      // TEMPORÁRIO: pegar userId do header ou usar default
      const userId = req.headers['x-user-id'] || req.userId || '7d7b71de-593b-4e29-b121-8fa6d9b7050b';
      const { id } = req.params;

      const validatedData = updateWineSchema.parse(req.body);
      const wine = await wineService.updateWine(id, validatedData, userId);

      res.status(200).json(wine);
    } catch (error) {
      if (error.message === 'Vinho nao encontrado') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async deleteWine(req, res, next) {
    try {
      // TEMPORÁRIO: pegar userId do header ou usar default
      const userId = req.headers['x-user-id'] || req.userId || '7d7b71de-593b-4e29-b121-8fa6d9b7050b';
      const { id } = req.params;

      const result = await wineService.deleteWine(id, userId);

      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Vinho nao encontrado') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new WineController();
