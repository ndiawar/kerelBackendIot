import mongoose from 'mongoose';

const arrosageSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  typePlante: { type: String, required: true },
  heureMatin: { type: String, required: true },
  heureSoir: { type: String, required: true },
  quantiteEau: { type: Number, required: true }
});

export default mongoose.model("Arrosage", arrosageSchema); // export default ici
