import mongoose from "mongoose";

const bodegaSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Nombre de la bodega
  vinos: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Vino" }, // Referencia a los vinos
  ],
});

export default mongoose.model("Bodegas", bodegaSchema);
