import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

/* =========================================
   CONFIG
========================================= */
app.use(cors())
app.use(express.json())

/* =========================================
   CONEXÃO MONGODB
========================================= */
mongoose.connect('mongodb://127.0.0.1:27017/ecohub')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.log('❌ Erro MongoDB:', err))

/* =========================================
   MODEL USUÁRIO
========================================= */
const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  curso: String,
  semestre: String
})

const Usuario = mongoose.model('Usuario', UsuarioSchema)

/* =========================================
   MODEL POST (🔥 ATUALIZADO)
========================================= */
const PostSchema = new mongoose.Schema({
  autor: String,
  username: String,
  conteudo: String,
  imagem: String,

  userId: String, // 🔥 dono do post

  likes: {
    type: Number,
    default: 0
  },

  curtidas: [String], // 🔥 controla quem curtiu

  criadoEm: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model('Post', PostSchema)

/* =========================================
   CADASTRO
========================================= */
app.post('/usuarios', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body)
    res.status(201).json(usuario)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar' })
  }
})

/* =========================================
   LOGIN
========================================= */
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: 'Senha incorreta' })
    }

    res.json({
      mensagem: 'Login realizado com sucesso',
      usuario
    })

  } catch (err) {
    res.status(500).json({ erro: 'Erro no login' })
  }
})

/* =========================================
   CRIAR POST
========================================= */
app.post('/posts', async (req, res) => {
  try {
    const post = await Post.create(req.body)
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar post' })
  }
})

/* =========================================
   LISTAR POSTS
========================================= */
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ criadoEm: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar posts' })
  }
})

/* =========================================
   ❤️ CURTIR (1 POR USUÁRIO)
========================================= */
app.put('/posts/:id/like', async (req, res) => {
  try {
    const { userId } = req.body

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' })
    }

    // 🔥 BLOQUEIA CURTIDA DUPLA
    if (post.curtidas.includes(userId)) {
      return res.status(400).json({ erro: 'Você já curtiu' })
    }

    post.likes += 1
    post.curtidas.push(userId)

    await post.save()

    res.json(post)

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao curtir' })
  }
})

/* =========================================
   🗑️ DELETAR (SÓ DONO)
========================================= */
app.delete('/posts/:id', async (req, res) => {
  try {
    const { userId } = req.body

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' })
    }

    // 🔥 VERIFICA DONO
    if (post.userId !== userId) {
      return res.status(403).json({ erro: 'Sem permissão' })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({ mensagem: 'Post deletado' })

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar' })
  }
})

/* =========================================
   TESTE
========================================= */
app.get('/', (req, res) => {
  res.send('API funcionando 🚀')
})

/* =========================================
   SERVER
========================================= */
app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000')
})