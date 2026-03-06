module.exports = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para administradores" });
  }

  next();
};             

module.exports = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Usuário não autenticado"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acesso permitido apenas para administradores"
    });
  }

  next();

};