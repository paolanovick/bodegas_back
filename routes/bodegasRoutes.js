import express from "express";
import {
  crearBodega,
  obtenerBodegas,
  obtenerBodegaPorId,
  obtenerBodegaPorNombre,
  actualizarBodega,
  eliminarBodega,
  listarTodasLasBodegas,
  obtenerBodegasConPaginado,
  agregarVinoABodega,
  eliminarVinoDeBodega
} from "../Controllers/bodegasController.js"; 
import { bodegasValidacion } from "../validation/bodegasValidations.js";


const router = express.Router();




// Crear bodega
router.post('/', bodegasValidacion, crearBodega);


// Ruta para obtener todas las bodegas
router.get("/", obtenerBodegas);

router.get("/listar", listarTodasLasBodegas);

// Ruta para obtener bodegas con paginado
router.get('/pagina', obtenerBodegasConPaginado);

// Ruta para obtener una bodega por ID
router.get("/:id", obtenerBodegaPorId);

// Ruta para obtener una bodega por descripciones
router.get("/nombre/:nombre", obtenerBodegaPorNombre);

// Ruta para actualizar una bodega por ID
router.put("/:id", actualizarBodega);

// Ruta para eliminar una bodega por ID
router.delete("/:id", eliminarBodega);






router.put('/:id/agregar-vino', agregarVinoABodega);

// Ruta para eliminar un vino de una bodega
router.put('/:id/eliminar-vino', eliminarVinoDeBodega);

export default router;
