import { readUsersFile, writeUsersFile } from "../model/usersModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.SECRET;

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
  const users = readUsersFile();
  res.status(200).json(users);
};

// Obtener un usuario por ID
const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readUsersFile();
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { name, lastname, username, password, email } = req.body;

  // Verificar que la contraseña no esté vacía
  if (!password) {
    return res.status(400).json({ message: "La contraseña es obligatoria" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const users = readUsersFile();
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    lastname,
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  writeUsersFile(users);
  res.status(201).json(newUser);
};

// Iniciar sesión de un usuario
const loginUser = async (req, res) => {
  const { password, email } = req.body;

  const users = readUsersFile();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  console.log(validPassword); // Asegúrate de que este valor sea `true` cuando la contraseña es correcta.
  if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: "1h",
  });
  console.log("Generated Token:", token);
  res.status(200).json({ token });
};

// Actualizar un usuario
const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readUsersFile();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    // Actualizar el usuario con la nueva información
    users[userIndex] = { id: userId, ...req.body };
    writeUsersFile(users);
    res.status(200).json(users[userIndex]);
  } else {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
};

// Eliminar un usuario
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readUsersFile();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    writeUsersFile(users);
    res.status(204).send(); // 204 No Content
  } else {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
