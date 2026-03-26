const db = require("../config/db");

exports.getPosts = (req, res) => {
  const sql = "SELECT * FROM posts ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
};

exports.createPost = (req, res) => {
  const { conteudo } = req.body;
  const imagem = req.file ? req.file.filename : null;
  const user_id = req.user.id; // Pega o ID com segurança do token

  const sql = "INSERT INTO posts (conteudo, imagem, user_id) VALUES (?, ?, ?)";

  db.query(sql, [conteudo, imagem, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ 
      mensagem: "Post criado com sucesso",
      id: result.insertId 
    });
  });
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM posts WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json({ mensagem: "Post deletado com sucesso" });
  });
};