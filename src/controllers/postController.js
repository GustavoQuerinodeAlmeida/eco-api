const db = require("../config/db");

exports.getPosts = async (req, res) => {
  try {
    const [posts] = await db.query("SELECT * FROM posts");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { conteudo } = req.body;
    const imagem = req.file ? req.file.filename : null;
    const user_id = req.user.id;

    await db.query(
      "INSERT INTO posts (conteudo, imagem, user_id) VALUES (?, ?, ?)",
      [conteudo, imagem, user_id]
    );

    res.json({ message: "Post criado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM posts WHERE id = ?", [id]);

    res.json({ message: "Post deletado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};