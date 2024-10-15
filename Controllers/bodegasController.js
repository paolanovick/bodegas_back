import Bodegas from "../Model/bodegasModel.js";
import { bodegasValidacion } from "../validation/bodegasValidations.js";
//import Vino from "../Model/vinosModel.js"; // Asegúrate de que este import sea necesario

// Crear una nueva bodega
export const crearBodega = async (req, res) => {
  try {
    const nuevaBodega = new Bodegas({
      nombre: req.body.nombre,
      vinos: req.body.vinos,
    });

    const bodegaGuardada = await nuevaBodega.save();
    res.status(201).json(bodegaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la bodega' });
  }
};

export const obtenerBodegas = async (req, res) => {
  try {
    // Obtener los parámetros de consulta de la URL
    const { tipoVino, nombreBodega } = req.query;

    // Crear una consulta dinámica basada en los filtros proporcionados
    let query = {};

    // Filtrar por el nombre de la bodega (Bianchi, Norton, Rutini, etc.)
    if (nombreBodega) {
      query.nombre = new RegExp(nombreBodega, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    }

    // Filtrar por el tipo de vino (tinto, blanco, rosado)
    if (tipoVino) {
      query["vinos.tipo"] = new RegExp(tipoVino, "i"); // 'vinos.tipo' es el campo donde guardas el tipo de vino
    }

    // Buscar las bodegas en la base de datos que coincidan con los filtros
    const bodegas = await Bodegas.find(query).populate("vinos");

    // Devolver las bodegas en formato JSON
    res.json(bodegas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener bodegas" });
  }
};


// Obtener una bodega por ID
export const obtenerBodegaPorId = async (req, res) => {
  try {
    const bodega = await Bodegas.findById(req.params.id);
    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }
    res.json(bodega);
  } catch (err) {
    console.error(err); // Añadido para depuración
    res.status(500).json({ error: "Error al obtener la bodega" }); // Cambié a 500
  }
};



export const obtenerBodegaPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    // Busca por el nombre de la bodega
    const bodega = await Bodegas.findOne({ nombre: nombre }).populate('vinos');

    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }

    res.json(bodega);
  } catch (err) {
    console.error("Error al obtener la bodega:", err);
    res.status(500).json({ error: "Error al obtener la bodega" });
  }
};









// Actualizar una bodega por ID
export const actualizarBodega = async (req, res) => {
  // Validación
  const { error } = bodegasValidacion(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const bodega = await Bodegas.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }
    res.json(bodega);
  } catch (err) {
    console.error(err); // Añadido para depuración
    res.status(500).json({ error: "Error al actualizar la bodega" }); // Cambié a 500
  }
};

// Eliminar una bodega por ID
export const eliminarBodega = async (req, res) => {
  try {
    const bodega = await Bodegas.findByIdAndDelete(req.params.id);
    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }
    res.json({ message: "Bodega eliminada correctamente" });
  } catch (err) {
    console.error(err); // Añadido para depuración
    res.status(500).json({ error: "Error al eliminar la bodega" }); // Cambié a 500
  }
};




// Ruta para agregar un vino a la bodega
export const agregarVinoABodega = async (req, res) => {
  try {
    const { vinoId } = req.body;
    const bodegaId = req.params.id;

    // Actualiza la bodega para agregar el vino
    await Bodegas.findByIdAndUpdate(bodegaId, { $push: { vinos: vinoId } });
    res.status(200).json({ mensaje: "Vino agregado a la bodega exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ruta para eliminar un vino de la bodega
export const eliminarVinoDeBodega = async (req, res) => {
  try {
    const { vinoId } = req.body;
    const bodegaId = req.params.id;

    // Actualiza la bodega para eliminar el vino
    await Bodegas.findByIdAndUpdate(bodegaId, { $pull: { vinos: vinoId } });
    res.status(200).json({ mensaje: "Vino eliminado de la bodega exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};










export const obtenerBodegasConPaginado = async (req, res) => {
  try {
    const { page = 1, limit = 10, vinosLimit = 5 } = req.query;

    // Convertir page y limit a números
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const vinosLimitNumber = Number(vinosLimit);

    if (isNaN(pageNumber) || isNaN(limitNumber) || isNaN(vinosLimitNumber)) {
      return res.status(400).json({ error: "Page, limit y vinosLimit deben ser números válidos" });
    }

    // Obtener bodegas con paginado y limitar el número de vinos por bodega
    const bodegas = await Bodegas.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .populate({
        path: 'vinos',
        select: 'nombre tipo',  // Solo devolver el nombre y tipo del vino
        options: {
          limit: vinosLimitNumber,  // Limitar el número de vinos por bodega
        },
      });

    // Contar el total de bodegas
    const totalBodegas = await Bodegas.countDocuments();

    // Verificar si se encontraron bodegas
    if (!bodegas || bodegas.length === 0) {
      return res.status(404).json({ message: "No se encontraron bodegas en esta página" });
    }

    // Devolver las bodegas y la información de paginación
    res.status(200).json({
      bodegas,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBodegas / limitNumber),
      totalBodegas,
    });
  } catch (error) {
    console.error('Error al obtener bodegas con paginado:', error);
    res.status(400).json({ error: "Error al obtener las bodegas" });
  }
};






export const listarTodasLasBodegas = async (req, res) => {
  try {
    const bodegas = await Bodegas.find(); // Obtener todas las bodegas sin paginado
    res.status(200).json(bodegas);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener bodegas" });
  }
};



