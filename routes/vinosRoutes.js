import express from 'express';
import {
  crearVino,
  obtenerVinos,
  obtenerVinoPorId,
  actualizarVino,
  eliminarVino,
  obtenerVinosPorNombre,
  obtenerVinosPorTipo,       // Nueva función de filtrado por tipo
  obtenerVinosConOrdenamiento, // Nueva función para ordenamiento
  obtenerVinosConPaginado      // Nueva función para paginado
  
} from '../Controllers/vinosController.js';

const router = express.Router();

// Rutas para vinos

router.get("/", obtenerVinos); // Crear un nuevo vino
router.post("/", crearVino); // Crear un nuevo vino
router.get("/pagina", obtenerVinosConPaginado); // Obtener vinos con paginado (también puedes incluir paginado y orden aquí)
router.get("/nombre/:nombre", obtenerVinosPorNombre); // Obtener vinos por nombre
router.get("/tipo/:tipo", obtenerVinosPorTipo); // Obtener vinos por tipo
router.get("/orden", obtenerVinosConOrdenamiento); // Obtener vinos con ordenamiento
router.get("/id/:id", obtenerVinoPorId); // Obtener un vino por ID
router.put("/id/:id", actualizarVino); // Actualizar un vino por ID
router.delete("/id/:id", eliminarVino); // Eliminar un vino por ID

export default router;
