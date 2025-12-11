const recognitionService = require('../services/recognitionService');

class RecognitionController {
  async analyzeWine(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Imagem e obrigatoria' });
      }

      const result = await recognitionService.analyzeWineImage(req.file);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecognitionController();
