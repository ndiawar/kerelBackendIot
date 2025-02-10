import mongoose from 'mongoose';  // Utiliser import au lieu de require

const arrosageSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  typePlante: { type: String, required: true },
  heureMatin: { type: String, required: true },
  heureSoir: { type: String, required: true },
  quantiteEau: { type: Number, required: true },
});

const Arrosage = mongoose.model('Arrosage', arrosageSchema);

// Export par défaut
export default Arrosage;
