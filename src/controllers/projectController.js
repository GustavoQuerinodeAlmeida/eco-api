const db = require("../config/db");

// LISTAR PROJETOS
exports.getProjects = (req, res) => {
  // Verifique se a coluna de data se chama 'data_publicacao' mesmo no seu banco.
  // Se for 'data_criacao', mude o ORDER BY abaixo.
  const sql = `
    SELECT projects.*, users.nome
    FROM projects
    JOIN users ON projects.user_id = users.id
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err });
    }
    res.json(results);
  });
};

// CRIAR PROJETO
exports.createProject = (req, res) => {
  const { titulo, descricao, link_projeto, imagem } = req.body;
  const user_id = req.user.id; // Segurança: ID puxado do token!

  const sql = `
    INSERT INTO projects (titulo, descricao, link_projeto, imagem, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [titulo, descricao, link_projeto, imagem, user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err });
      }

      res.status(201).json({
        mensagem: "Projeto criado com sucesso",
        id: result.insertId
      });
    }
  );
};

// DELETAR PROJETO
exports.deleteProject = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM projects WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ erro: err });
    }
    res.json({ mensagem: "Projeto removido com sucesso" });
  });
};