const mongoose = require("mongoose");

const arrosageSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Valeur par défaut pour la date
  typePlante: { type: String, required: true },
  heureMatin: { type: String, required: true },
  heureSoir: { type: String, required: true },
  quantiteEau: { type: Number, required: true }
});

module.exports = mongoose.model("Arrosage", arrosageSchema);