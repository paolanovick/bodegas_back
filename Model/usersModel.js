import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener el nombre y el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir la ruta completa del archivo de usuarios
const usersFilePath = path.join(__dirname, "../data/users.json");


// Función para leer el archivo de usuarios
const readUsersFile = () => {
  const data = fs.readFileSync(usersFilePath, "utf8"); 
  return JSON.parse(data);
};

// Función para escribir en el archivo de usuarios
const writeUsersFile = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), "utf8"); 
};

export { readUsersFile, writeUsersFile };
