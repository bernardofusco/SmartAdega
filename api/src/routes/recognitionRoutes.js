const express = require('express');
const router = express.Router();
const multer = require('multer');
const recognitionController = require('../controllers/recognitionController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens sao permitidas'), false);
    }
  }
});

/**
 * @swagger
 * /api/recognition/analyze:
 *   post:
 *     summary: Reconhecer vinho a partir de uma imagem
 *     tags: [Recognition]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do rotulo do vinho
 *     responses:
 *       200:
 *         description: Reconhecimento realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome_do_vinho:
 *                   type: string
 *                 uva:
 *                   type: string
 *                 regiao:
 *                   type: string
 *                 ano:
 *                   type: string
 *                 preco:
 *                   type: string
 *                 quantidade:
 *                   type: string
 *                 avaliacao:
 *                   type: string
 *       400:
 *         description: Erro na requisicao ou imagem invalida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao processar reconhecimento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/recognition/analyze', upload.single('image'), (req, res, next) => 
  recognitionController.analyzeWine(req, res, next)
);

module.exports = router;
