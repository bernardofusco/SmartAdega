const express = require('express');
const router = express.Router();
const wineController = require('../controllers/wineController');

/**
 * @swagger
 * /wines:
 *   post:
 *     summary: Criar um novo vinho
 *     tags: [Wines]
 *     security:
 *       - UserIdHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WineInput'
 *     responses:
 *       201:
 *         description: Vinho criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wine'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Header x-user-id e obrigatorio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/wines', (req, res, next) => wineController.createWine(req, res, next));

/**
 * @swagger
 * /wines:
 *   get:
 *     summary: Listar todos os vinhos do usuario
 *     tags: [Wines]
 *     security:
 *       - UserIdHeader: []
 *     responses:
 *       200:
 *         description: Lista de vinhos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wine'
 *       401:
 *         description: Header x-user-id e obrigatorio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/wines', (req, res, next) => wineController.getWines(req, res, next));

/**
 * @swagger
 * /wines/{id}:
 *   get:
 *     summary: Obter um vinho especifico
 *     tags: [Wines]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do vinho
 *     responses:
 *       200:
 *         description: Vinho encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wine'
 *       401:
 *         description: Header x-user-id e obrigatorio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vinho nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/wines/:id', (req, res, next) => wineController.getWineById(req, res, next));

/**
 * @swagger
 * /wines/{id}:
 *   put:
 *     summary: Atualizar um vinho
 *     tags: [Wines]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do vinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WineUpdate'
 *     responses:
 *       200:
 *         description: Vinho atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wine'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Header x-user-id e obrigatorio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vinho nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/wines/:id', (req, res, next) => wineController.updateWine(req, res, next));

/**
 * @swagger
 * /wines/{id}:
 *   delete:
 *     summary: Deletar um vinho
 *     tags: [Wines]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do vinho
 *     responses:
 *       200:
 *         description: Vinho deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vinho deletado com sucesso
 *       401:
 *         description: Header x-user-id e obrigatorio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vinho nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/wines/:id', (req, res, next) => wineController.deleteWine(req, res, next));

module.exports = router;
