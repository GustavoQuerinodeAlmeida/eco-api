const db = require("../config/db");

exports.getNews = (req, res) => {
  const sql = "SELECT * FROM news ORDER BY id DESC";
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
};

exports.createNews = (req, res) => {
  const { titulo, conteudo } = req.body;

  const sql = "INSERT INTO news (titulo, conteudo) VALUES (?, ?)";

  db.query(sql, [titulo, conteudo], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ 
      mensagem: "Notícia criada com sucesso",
      id: result.insertId 
    });
  });
};

exports.deleteNews = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM news WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao deletar notícia" });
    }
    res.json({ mensagem: "Notícia deletada com sucesso" });
  });
};