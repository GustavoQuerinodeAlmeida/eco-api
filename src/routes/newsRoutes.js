const express = require("express");
const router = express.Router();

const newsController = require("../controllers/newsController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         titulo:
 *           type: string
 *         conteudo:
 *           type: string
 *         data:
 *           type: string
 *       example:
 *         titulo: Nova feira de tecnologia no colégio
 *         conteudo: O colégio realizará uma feira tecnológica no próximo mês.
 */

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Lista todas as notícias
 *     tags: [News]
 */
router.get("/", newsController.getNews);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Criar nova notícia (APENAS ADMIN)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  newsController.createNews
);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Deletar notícia (APENAS ADMIN)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  newsController.deleteNews
);

module.exports = router;