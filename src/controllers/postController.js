import db from '../config/db.js'

/* ================================
   LISTAR POSTS (FEED)
================================ */
export const listarPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT 
        p.id,
        p.conteudo,
        p.imagem_url,
        p.data_publicacao,

        u.id as userId,
        u.nome as autor,
        u.foto_perfil as foto,

        COUNT(DISTINCT l.id) as likes,
        COUNT(DISTINCT c.id) as comentarios

      FROM posts p
      JOIN users u ON p.usuario_id = u.id
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN comments c ON c.post_id = p.id

      GROUP BY p.id
      ORDER BY p.data_publicacao DESC
    `)

    res.json(posts)

  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao buscar posts' })
  }
}

/* ================================
   CURTIR POST
================================ */
export const curtirPost = async (req, res) => {
  try {
    const { userId } = req.body
    const postId = req.params.id

    const [existe] = await db.query(
      'SELECT * FROM likes WHERE post_id = ? AND usuario_id = ?',
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

    res.json({ message: 'Like atualizado' })

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

    if (!texto || !texto.trim()) {
      return res.status(400).json({ erro: 'Comentário vazio' })
    }

    await db.query(
      'INSERT INTO comments (post_id, usuario_id, texto) VALUES (?, ?, ?)',
      [postId, userId, texto]
    )

    res.json({ message: 'Comentado com sucesso' })

  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao comentar' })
  }
}