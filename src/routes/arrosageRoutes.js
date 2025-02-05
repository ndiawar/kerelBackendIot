const express = require("express");
const router = express.Router();
const arrosageController = require("../controllers/arrosageController");

// Route pour ajouter une programmation d'arrosage
router.post("/", arrosageController.ajouterArrosage);

// Route pour récupérer toutes les programmations
router.get("/", arrosageController.getAllArrosages);

// Route pour modifier une programmation existante
router.put("/:id", arrosageController.updateArrosage);

// Route pour supprimer une programmation
router.delete("/:id", arrosageController.deleteArrosage);

module.exports = router;
