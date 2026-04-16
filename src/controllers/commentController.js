import db from '../config/db.js'

/* ================================
   LISTAR COMENTÁRIOS POR POST
================================ */
export const listarComentariosPorPost = async (req, res) => {
  try {
    const { postId } = req.params

    const [comentarios] = await db.query(`
      SELECT
        c.id,
        c.texto,
        c.data_criacao,
        u.id AS userId,
        u.nome AS autor,
        u.foto_perfil AS foto
      FROM comments c
      JOIN users u ON c.usuario_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.data_criacao ASC
    `, [postId])

    res.json(comentarios)
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: 'Erro ao buscar comentários' })
  }
}