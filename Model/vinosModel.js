import mongoose from "mongoose";

const vinoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true }, // Ej: "tinto", "blanco", "rosado"
  bodega: { type: mongoose.Schema.Types.ObjectId, ref: "Bodegas" }, // Referencia a una bodega
});

export default mongoose.model("Vino", vinoSchema);
