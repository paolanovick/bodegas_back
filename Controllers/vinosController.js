import Vinos from "../Model/vinosModel.js";

import Bodega from "../Model/bodegasModel.js";

// Crear un nuevo vino
// export const crearVino = async (req, res) => {
//   try {
//     const vino = new Vinos({ ...req.body });
//     const savedVino = await vino.save();
//     res.json(savedVino);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Obtener todos los vinos
export const obtenerVinos = async (req, res) => {
  try {
    const vinos = await Vinos.find();
    res.json(vinos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener un vino por ID
export const obtenerVinoPorId = async (req, res) => {
  try {
    const vino = await Vinos.findById(req.params.id);
    if (!vino) {
      return res.status(404).json({ error: "Vino no encontrado" });
    }
    res.json(vino);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener un vino por ID
// export const obtenerVinosPorNombre = async (req, res) => {
//   try {
//     const vino = await Vinos.findById(req.params.id);
//     if (!vino) {
//       return res.status(404).json({ error: "Vino no encontrado" });
//     }
//     res.json(vino);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Actualizar un vino por ID
export const actualizarVino = async (req, res) => {
  try {
    const vino = await Vinos.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!vino) {
      return res.status(404).json({ error: "Vino no encontrado" });
    }
    res.json(vino);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar un vino por ID
// export const eliminarVino = async (req, res) => {
//   try {
//     const vino = await Vinos.findByIdAndDelete(req.params.id);
//     if (!vino) {
//       return res.status(404).json({ error: "Vino no encontrado" });
//     }
//     res.json({ message: "Vino eliminado correctamente" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };



export const crearVino = async (req, res) => {
  try {
    const { nombre, tipo, bodegaId } = req.body;

    // Crear el nuevo vino
    const nuevoVino = new Vinos({
      nombre,
      tipo,
      bodega: bodegaId,  // Asociar el ID de la bodega
    });

    // Guardar el vino
    const vinoGuardado = await nuevoVino.save();

    // Asociar el vino a la bodega
    await Bodega.findByIdAndUpdate(bodegaId, { $push: { vinos: vinoGuardado._id } });

    res.status(201).json(vinoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un vino y actualizar la bodega correspondiente
export const eliminarVino = async (req, res) => {
  try {
    const { id } = req.params; // ID del vino a eliminar
    const vino = await Vinos.findById(id);

    if (!vino) {
      return res.status(404).json({ error: "Vino no encontrado" });
    }

    // Eliminar el vino de la colección de vinos
    await Vinos.findByIdAndDelete(id);

    // Eliminar la referencia del vino en la bodega correspondiente
    await Bodega.findByIdAndUpdate(vino.bodega, { $pull: { vinos: id } });

    res.status(200).json({ mensaje: "Vino eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Buscar vinos por nombre
export const obtenerVinosPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    
    // Usamos una expresión regular para hacer la búsqueda flexible (case insensitive)
    const vinos = await Vinos.find({ nombre: new RegExp(nombre, 'i') });
    
    if (!vinos || vinos.length === 0) {
      return res.status(404).json({ error: "No se encontraron vinos con ese nombre" });
    }

    res.status(200).json(vinos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};











//////////////////////////////////////



export const obtenerVinosPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;

    // Filtrar vinos por tipo (tinto, blanco, rosado, etc.)
    const vinos = await Vinos.find({ tipo: new RegExp(tipo, 'i') });

    if (!vinos || vinos.length === 0) {
      return res.status(404).json({ error: "No se encontraron vinos de ese tipo" });
    }

    res.status(200).json(vinos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Obtener todos los vinos con soporte de ordenamiento
export const obtenerVinosConOrdenamiento = async (req, res) => {
  try {
    const { campo, orden } = req.query; // 'campo' puede ser 'nombre' o 'tipo' y 'orden' puede ser 'asc' o 'desc'

    // Default: orden por nombre ascendente si no se especifica nada
    const sortBy = campo || 'nombre';
    const sortOrder = orden === 'desc' ? -1 : 1; // -1 para descendente, 1 para ascendente

    const vinos = await Vinos.find().sort({ [sortBy]: sortOrder });

    res.status(200).json(vinos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




/// Obtener vinos con paginado
export const obtenerVinosConPaginado = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  try {
    const vinos = await Vinos.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    const totalVinos = await Vinos.countDocuments();

    res.status(200).json({
      vinos,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalVinos / limitNumber),
      totalVinos,
    });
  } catch (error) {
    res.status(400).json({ error: "Error al obtener los vinos" });
  }
};