const db = require("../config/db");

// LISTAR EVENTOS
exports.getEvents = (req, res) => {
  const sql = "SELECT * FROM events ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err });
    }
    res.json(results);
  });
};

// CRIAR EVENTO
exports.createEvent = (req, res) => {
  const { titulo, descricao, data, local } = req.body;
  const criador_id = req.user.id; // Pega o ID do token!

  if (!titulo || !descricao) {
    return res.status(400).json({ erro: "Título e descrição são obrigatórios." });
  }

  const sql = `
    INSERT INTO events (titulo, descricao, data_evento, local, imagem_url, criador_id)
    VALUES (?, ?, ?, ?, NULL, ?)
  `;

  db.query(
    sql,
    [titulo, descricao, data, local, criador_id],
    (err, result) => {
      if (err) {
        console.error("❌ Erro ao criar evento no banco:", err);
        return res.status(500).json({ erro: "Erro no banco de dados", detalhes: err.sqlMessage });
      }

      res.status(201).json({
        mensagem: "Evento criado com sucesso",
        id: result.insertId
      });
    }
  );
};

// DELETAR EVENTO
exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM events WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ erro: err });
    }
    res.json({ mensagem: "Evento deletado com sucesso" });
  });
};