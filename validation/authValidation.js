// middlewares/authValidation.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET;

// Middleware para verificar el token
export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const bearerToken = token.split(" ")[1]; // Extraer el token del formato "Bearer TOKEN"

    jwt.verify(bearerToken, secretKey, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }
      req.user = { id: payload.id, email: payload.email }; // Almacenar la información del usuario en la solicitud
      next();
    });
  } else {
    return res.status(401).json({ message: "No se proporcionó token" }); // Manejo de falta de token
  }
};
