import db from '../config/db.js'

/* ================================
   LISTAR POSTS
================================ */
export const listarPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT 
        p.id,
        p.conteudo,
        p.imagem_url,
        p.data_publicacao,
        u.id AS userId,
        u.nome AS autor,
        u.foto_perfil AS foto,
        COUNT(DISTINCT l.id) AS likes,
        COUNT(DISTINCT c.id) AS comentarios
      FROM posts p
      JOIN users u ON p.usuario_id = u.id
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN comments c ON c.post_id = p.id
      GROUP BY p.id, p.conteudo, p.imagem_url, p.data_publicacao, u.id, u.nome, u.foto_perfil
      ORDER BY p.data_publicacao DESC
    `)

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao buscar posts' })
  }
}

/* ================================
   CRIAR POST
================================ */
export const criarPost = async (req, res) => {
  try {
    const { conteudo, userId, imagem_url = null } = req.body

    if (!userId) {
      return res.status(400).json({ erro: 'userId obrigatório' })
    }

    if (!conteudo || !conteudo.trim()) {
      return res.status(400).json({ erro: 'Conteúdo obrigatório' })
    }

    const [resultado] = await db.query(
      `INSERT INTO posts (usuario_id, conteudo, imagem_url)
       VALUES (?, ?, ?)`,
      [userId, conteudo.trim(), imagem_url]
    )

    const [novoPost] = await db.query(`
      SELECT 
        p.id,
        p.conteudo,
        p.imagem_url,
        p.data_publicacao,
        u.id AS userId,
        u.nome AS autor,
        u.foto_perfil AS foto,
        0 AS likes,
        0 AS comentarios
      FROM posts p
      JOIN users u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [resultado.insertId])

    res.status(201).json(novoPost[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao criar post' })
  }
}

/* ================================
   CURTIR POST
================================ */
export const curtirPost = async (req, res) => {
  try {
    const { userId } = req.body
    const postId = req.params.id

    if (!userId) {
      return res.status(400).json({ erro: 'userId obrigatório' })
    }

    const [existe] = await db.query(
      'SELECT id FROM likes WHERE post_id = ? AND usuario_id = ?',
      [postId, userId]
    )

    if (existe.length > 0) {
      await db.query(
        'DELETE FROM likes WHERE post_id = ? AND usuario_id = ?',
        [postId, userId]
      )
    } else {
      await db.query(
        'INSERT INTO likes (post_id, usuario_id) VALUES (?, ?)',
        [postId, userId]
      )
    }

    const [resultado] = await db.query(`
      SELECT COUNT(*) AS likes
      FROM likes
      WHERE post_id = ?
    `, [postId])

    res.json({ likes: resultado[0].likes })
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao curtir' })
  }
}

/* ================================
   COMENTAR POST
================================ */
export const comentarPost = async (req, res) => {
  try {
    const { texto, userId } = req.body
    const postId = req.params.id

    if (!userId) {
      return res.status(400).json({ erro: 'userId obrigatório' })
    }

    if (!texto || !texto.trim()) {
      return res.status(400).json({ erro: 'Comentário vazio' })
    }

    await db.query(
      'INSERT INTO comments (post_id, usuario_id, texto) VALUES (?, ?, ?)',
      [postId, userId, texto.trim()]
    )

    res.json({ mensagem: 'Comentado com sucesso' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao comentar' })
  }
}

/* ================================
   EDITAR POST
================================ */
export const editarPost = async (req, res) => {
  try {
    const { conteudo, userId } = req.body
    const postId = req.params.id

    if (!userId) {
      return res.status(400).json({ erro: 'userId obrigatório' })
    }

    if (!conteudo || !conteudo.trim()) {
      return res.status(400).json({ erro: 'Conteúdo obrigatório' })
    }

    const [post] = await db.query(
      'SELECT * FROM posts WHERE id = ?',
      [postId]
    )

    if (post.length === 0) {
      return res.status(404).json({ erro: 'Post não encontrado' })
    }

    if (String(post[0].usuario_id) !== String(userId)) {
      return res.status(403).json({ erro: 'Sem permissão para editar este post' })
    }

    await db.query(
      'UPDATE posts SET conteudo = ? WHERE id = ?',
      [conteudo.trim(), postId]
    )

    const [postAtualizado] = await db.query(`
      SELECT 
        p.id,
        p.conteudo,
        p.imagem_url,
        p.data_publicacao,
        u.id AS userId,
        u.nome AS autor,
        u.foto_perfil AS foto
      FROM posts p
      JOIN users u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [postId])

    res.json(postAtualizado[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao editar post' })
  }
}

/* ================================
   DELETAR POST
================================ */
export const deletarPost = async (req, res) => {
  try {
    const { id, userId } = req.params

    const [post] = await db.query(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    )

    if (post.length === 0) {
      return res.status(404).json({ erro: 'Post não encontrado' })
    }

    if (String(post[0].usuario_id) !== String(userId)) {
      return res.status(403).json({ erro: 'Sem permissão' })
    }

    await db.query('DELETE FROM comments WHERE post_id = ?', [id])
    await db.query('DELETE FROM likes WHERE post_id = ?', [id])
    await db.query('DELETE FROM posts WHERE id = ?', [id])

    res.json({ mensagem: 'Post deletado' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao deletar' })
  }
}