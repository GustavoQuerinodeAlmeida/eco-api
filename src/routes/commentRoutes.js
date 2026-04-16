import express from 'express'
import { listarComentariosPorPost } from '../controllers/commentController.js'

const router = express.Router()

router.get('/comments/:postId', listarComentariosPorPost)

export default router