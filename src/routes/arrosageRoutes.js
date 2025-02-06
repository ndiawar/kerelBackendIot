import express from 'express';
import { ajouterArrosage, getAllArrosages, updateArrosage, deleteArrosage } from '../controllers/arrosageController.js';  // Modification du chemin

const router = express.Router();

router.post("/", ajouterArrosage);
router.get("/", getAllArrosages);
router.put("/:id", updateArrosage);
router.delete("/:id", deleteArrosage);

export default router;  // Utilisation de 'export default'
