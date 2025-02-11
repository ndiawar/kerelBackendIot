import express from "express";
import arrosageController from "../controllers/arrosageController.js";

const router = express.Router();

// Route pour ajouter une programmation d'arrosage
router.post("/", arrosageController.ajouterArrosage);

// Route pour récupérer toutes les programmations
router.get("/", arrosageController.getAllArrosages);

// Route pour modifier une programmation existante
router.put("/:id", arrosageController.updateArrosage);

// Route pour supprimer une programmation
router.delete("/:id", arrosageController.deleteArrosage);


export default router;
