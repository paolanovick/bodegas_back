import express from "express";

import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import bodegasRoutes from "./routes/bodegasRoutes.js";
import vinosRoutes from "./routes/vinosRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';  // Importa el paquete cors
dotenv.config();

const app = express();
const port = 3000;
// Middleware para parsear JSON
app.use(express.json());





app.use(cors());  // Usa CORS en tu servidor


// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión exitosa"))
  .catch(err => console.error("Error de conexión:", err));
    

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Definir la ruta para la página de inicio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Definir las rutas
app.use("/usuarios", usersRoutes); // Rutas de usuarios
app.use("/bodegas", bodegasRoutes); // Rutas de bodegas
app.use("/vinos", vinosRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
