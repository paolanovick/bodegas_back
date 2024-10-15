import express from "express";
import { getAllUsers, getUserById, createUser, loginUser, updateUser, deleteUser } from "../Controllers/usersController.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verificarToken } from "../validation/authValidation.js"; // 


dotenv.config();

const secretKey = process.env.SECRET;

const router = express.Router();


const auth = (req, res, next) => {
  const getToken = req.headers.authorization;

  if (getToken) {
    const token = getToken.split(" ")[1]; 

    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }
           req.user = { id: payload.id, email: payload.email }; 
      next();
    });
  } else {
    return res.status(401).json({ message: "No se proporcionó token" }); // Manejo de falta de token
  }
};

// Ruta para obtener todos los usuarios
router.get('/', auth, getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', getUserById); 

// Ruta para crear un nuevo usuario
router.post('/', createUser);

// Ruta para iniciar sesión de un usuario
router.post('/login', loginUser); 

// Ruta para actualizar un usuario
router.put('/:id', updateUser); 

// Ruta para eliminar un usuario
router.delete('/:id', deleteUser);
// Ruta para obtener todos los usuarios (requiere autenticación)
router.get('/', verificarToken, getAllUsers);

export default router;