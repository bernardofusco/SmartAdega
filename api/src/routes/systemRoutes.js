const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota raiz da API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SmartAdega API - Gestao de Vinhos
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar status da API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Status da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Tempo de atividade em segundos
 *                   example: 3600
 *                 environment:
 *                   type: string
 *                   example: production
 */

module.exports = router;
