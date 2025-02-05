const Arrosage = require("../models/Arrosage");

// Ajouter une nouvelle programmation d’arrosage
exports.ajouterArrosage = async (req, res) => {
  try {
    const { date, typePlante, heureMatin, heureSoir, quantiteEau } = req.body;
    const nouvelArrosage = new Arrosage({ date, typePlante, heureMatin, heureSoir, quantiteEau });
    await nouvelArrosage.save();
    res.status(201).json({ message: "Programmation d'arrosage ajoutée ", arrosage: nouvelArrosage });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout ", error });
  }
};

// Récupérer toutes les programmations
exports.getAllArrosages = async (req, res) => {
  try {
    const arrosages = await Arrosage.find();
    res.status(200).json(arrosages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération ", error });
  }
};

// Modifier une programmation
exports.updateArrosage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArrosage = await Arrosage.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Programmation mise à jour ✅", arrosage: updatedArrosage });
  } catch (error) {
    res.status(500).json({ message: "Erreur de mise à jour ", error });
  }
};

// Supprimer une programmation
exports.deleteArrosage = async (req, res) => {
  try {
    const { id } = req.params;
    await Arrosage.findByIdAndDelete(id);
    res.status(200).json({ message: "Programmation supprimée ✅" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de suppression ❌", error });
  }
};