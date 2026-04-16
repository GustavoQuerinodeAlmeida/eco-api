import express from 'express'
import {
  listarPosts,
  curtirPost,
  comentarPost
} from '../controllers/postController.js'

const router = express.Router()

router.get('/posts', listarPosts)
router.put('/posts/:id/like', curtirPost)
router.put('/posts/:id/comentarios', comentarPost)

export default router