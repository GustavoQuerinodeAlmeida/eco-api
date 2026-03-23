const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger");
const db = require("./config/db");

// rotas
const userRoutes = require("./routes/useRoutes");
const projectRoutes = require("./routes/projectRoutes");
const postRoutes = require("./routes/postRoutes");
const eventRoutes = require("./routes/eventRoutes");
const newsRoutes = require("./routes/newsRoutes");

const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// rota principal
app.get("/", (req, res) => {
  res.send("API EcoHub funcionando 🚀");
});

// rotas da API
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/news", newsRoutes);

// teste banco
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

const cors = require('cors')
const app = express()

app.use(cors()) 