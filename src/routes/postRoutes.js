import express from 'express'
import {
  listarPosts,
  criarPost,
  curtirPost,
  comentarPost,
  editarPost,
  deletarPost
} from '../controllers/postController.js'

const router = express.Router()

router.get('/posts', listarPosts)
router.post('/posts', criarPost)
router.put('/posts/:id/like', curtirPost)
router.put('/posts/:id/comentarios', comentarPost)
router.put('/posts/:id', editarPost)
router.delete('/posts/:id/:userId', deletarPost)

export default router