import Arrosage from "../models/Arrosage.js";
import axios from 'axios';
import cron from 'node-cron';

let pumpTimeout;

// Fonction pour activer la pompe
const activatePump = async (action) => {
  const url = action === 'on' ? 'http://192.168.1.20:5002/pump/start' : 'http://192.168.1.20:5002/pump/stop';
  try {
    const response = await axios.post(url);
    console.log(response.data.message);

    if (action === 'on') {
      // Planifier l'arrêt de la pompe après 30 secondes
      pumpTimeout = setTimeout(async () => {
        await activatePump('off');
      }, 30000);
    } else {
      // Annuler le timeout si la pompe est arrêtée manuellement
      if (pumpTimeout) {
        clearTimeout(pumpTimeout);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'activation de la pompe :", error.message || error);
  }
};

// Fonction de vérification des horaires et déclenchement de la pompe
const checkWateringSchedules = async () => {
  try {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    console.log(`Vérification des horaires à ${now.toLocaleTimeString()}`);

    const arrosages = await Arrosage.find();
    console.log(`${arrosages.length} programmations trouvées`);

    arrosages.forEach(arrosage => {
      console.log(`Vérification de l'arrosage ${arrosage._id}`);
      if (!arrosage.heureMatin && !arrosage.heureSoir) {
        console.warn("Aucun horaire défini pour l'arrosage :", arrosage._id);
        return;
      }

      const times = [arrosage.heureMatin, arrosage.heureSoir].filter(Boolean);

      times.forEach(time => {
        const [hours, minutes] = time.split(':');
        const scheduledTimeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
        console.log(`Horaire planifié : ${time} (${scheduledTimeInMinutes} minutes)`);

        if (currentTime === scheduledTimeInMinutes) {
          console.log(`Activation de la pompe pour l'arrosage ${arrosage._id}`);
          activatePump('on');
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des programmations :", error.message || error);
  }
};

// Planifier la vérification des horaires toutes les minutes
cron.schedule('* * * * *', checkWateringSchedules);


// Ajouter une nouvelle programmation d'arrosage
export const ajouterArrosage = async (req, res) => {
  try {
    const { date, typePlante, heureMatin, heureSoir, quantiteEau } = req.body;

    if (!date || !typePlante || !quantiteEau || (!heureMatin && !heureSoir)) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const nouvelArrosage = new Arrosage({ date, typePlante, heureMatin, heureSoir, quantiteEau });
    await nouvelArrosage.save();
    res.status(201).json({ message: "Programmation d'arrosage ajoutée", arrosage: nouvelArrosage });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la programmation :", error.message || error);
    res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
  }
};

// Récupérer toutes les programmations
export const getAllArrosages = async (req, res) => {
  try {
    const arrosages = await Arrosage.find();
    res.status(200).json(arrosages);
  } catch (error) {
    console.error("Erreur lors de la récupération des programmations :", error.message || error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// Modifier une programmation
export const updateArrosage = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, typePlante, heureMatin, heureSoir, quantiteEau } = req.body;

    if (!date || !typePlante || !quantiteEau || (!heureMatin && !heureSoir)) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const updatedArrosage = await Arrosage.findByIdAndUpdate(id, { date, typePlante, heureMatin, heureSoir, quantiteEau }, { new: true });
    if (!updatedArrosage) {
      return res.status(404).json({ message: "Programmation non trouvée" });
    }
    res.status(200).json({ message: "Programmation mise à jour", arrosage: updatedArrosage });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la programmation :", error.message || error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer une programmation
export const deleteArrosage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArrosage = await Arrosage.findByIdAndDelete(id);
    if (!deletedArrosage) {
      return res.status(404).json({ message: "Programmation non trouvée" });
    }
    res.status(200).json({ message: "Programmation supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la programmation :", error.message || error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Lancer la vérification des horaires planifiés
checkWateringSchedules();

// Exportation du contrôleur complet
export default {
  ajouterArrosage,
  getAllArrosages,
  updateArrosage,
  deleteArrosage,
};
