const jwt = require("jsonwebtoken");
const SECRET = "segredo_super_secreto";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não fornecido"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded; // dados do usuário no token
    next();
  } catch (error) {
    return res.status(401).json({
      erro: "Token inválido"
    });
  }
};

module.exports = authMiddleware;

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // aqui salvamos os dados do usuario
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }

};