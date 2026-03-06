const db = require("../config/db");

exports.getNews = async (req, res) => {
  try {
    const [news] = await db.query("SELECT * FROM news ORDER BY id DESC");
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNews = async (req, res) => {
  const { titulo, conteudo } = req.body;

  try {
    await db.query(
      "INSERT INTO news (titulo, conteudo) VALUES (?, ?)",
      [titulo, conteudo]
    );

    res.json({ message: "Notícia criada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM news WHERE id = ?", [id]);
    res.json({ message: "Notícia deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar notícia" });
  }
};