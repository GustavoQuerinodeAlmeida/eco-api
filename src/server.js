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
  semestre: String,
  foto: {
    type: String,
    default: ''
  },
  seguindo: {
    type: [String],
    default: []
  },
  seguidores: {
    type: [String],
    default: []
  }
})

const Usuario = mongoose.model('Usuario', UsuarioSchema)

/* =========================================
   MODEL POST
========================================= */
const PostSchema = new mongoose.Schema({
  autor: String,
  username: String,
  conteudo: String,
  imagem: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  foto: String,

  likes: {
    type: Number,
    default: 0
  },

  curtidas: {
    type: [String],
    default: []
  },

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
   BUSCAR USUÁRIOS
========================================= */
app.get('/usuarios', async (req, res) => {
  try {
    const { nome } = req.query

    const usuarios = await Usuario.find({
      nome: { $regex: nome || '', $options: 'i' }
    }).select('-senha')

    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' })
  }
})

/* =========================================
   BUSCAR USUÁRIO POR ID
========================================= */
app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha')

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    res.json(usuario)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário' })
  }
})

/* =========================================
   SEGUIR / DEIXAR DE SEGUIR
========================================= */
app.put('/usuarios/seguir/:id', async (req, res) => {
  try {
    const { userId } = req.body
    const alvoId = req.params.id

    if (userId === alvoId) {
      return res.status(400).json({ erro: 'Não pode seguir você mesmo' })
    }

    const usuario = await Usuario.findById(userId)
    const alvo = await Usuario.findById(alvoId)

    if (!usuario || !alvo) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    const jaSegue = usuario.seguindo.includes(alvoId)

    if (jaSegue) {
      usuario.seguindo = usuario.seguindo.filter(id => id !== alvoId)
      alvo.seguidores = alvo.seguidores.filter(id => id !== userId)
    } else {
      usuario.seguindo.push(alvoId)
      alvo.seguidores.push(userId)
    }

    await usuario.save()
    await alvo.save()

    res.json({ seguindo: usuario.seguindo })

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao seguir' })
  }
})

/* =========================================
   ATUALIZAR FOTO
========================================= */
app.put('/usuarios/:id/foto', async (req, res) => {
  try {
    const { foto } = req.body

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { foto },
      { new: true }
    )

    res.json(usuario)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar foto' })
  }
})

/* =========================================
   CRIAR POST
========================================= */
app.post('/posts', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ erro: 'userId obrigatório' })
    }

    const usuario = await Usuario.findById(userId)

    const post = await Post.create({
      ...req.body,
      userId,
      foto: usuario?.foto || ''
    })

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
   EDITAR POST
========================================= */
app.put('/posts/:id', async (req, res) => {
  try {
    const { conteudo, userId } = req.body

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' })
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ erro: 'Sem permissão para editar este post' })
    }

    post.conteudo = conteudo
    await post.save()

    res.json(post)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao editar post' })
  }
})

/* =========================================
   CURTIR / DESCURTIR
========================================= */
app.put('/posts/:id/like', async (req, res) => {
  try {
    const { userId } = req.body

    const post = await Post.findById(req.params.id)

    const jaCurtiu = post.curtidas.includes(userId)

    if (jaCurtiu) {
      post.likes -= 1
      post.curtidas = post.curtidas.filter(id => id !== userId)
    } else {
      post.likes += 1
      post.curtidas.push(userId)
    }

    await post.save()

    res.json(post)

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao curtir' })
  }
})

/* =========================================
   DELETAR POST
========================================= */
app.delete('/posts/:id/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params

    const post = await Post.findById(id)

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ erro: 'Sem permissão' })
    }

    await Post.findByIdAndDelete(id)

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