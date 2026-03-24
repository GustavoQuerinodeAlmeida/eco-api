const express = require("express");
const cors = require('cors'); // Movido para cima para melhor organização
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger");
const db = require("./config/db");

const app = express();
const PORT = 3000;

// --- MIDDLEWARES (Devem vir antes das rotas!) ---
app.use(cors()); 
app.use(express.json()); // <--- ESTA LINHA ESTAVA FALTANDO!

// --- IMPORTAÇÃO DE ROTAS ---
// Verifique se o nome do arquivo é useRoutes ou userRoutes
const userRoutes = require("./routes/useRoutes");
const projectRoutes = require("./routes/projectRoutes");
const postRoutes = require("./routes/postRoutes");
const eventRoutes = require("./routes/eventRoutes");
const newsRoutes = require("./routes/newsRoutes");

// --- SWAGGER ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROTAS DA API ---
app.get("/", (req, res) => {
  res.send("API EcoHub funcionando 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/news", newsRoutes);

// Teste banco
app.get("/teste-banco", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({ erro: "Banco não conectou" });
    }
    res.json({ status: "Banco conectado" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});