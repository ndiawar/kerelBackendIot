import Arrosage from "../models/Arrosage.js";

// Ajouter une nouvelle programmation d'arrosage
export const ajouterArrosage = async (req, res) => {
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
export const getAllArrosages = async (req, res) => {
  try {
    const arrosages = await Arrosage.find();
    res.status(200).json(arrosages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération ", error });
  }
};

// Modifier une programmation
export const updateArrosage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArrosage = await Arrosage.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Programmation mise à jour ✅", arrosage: updatedArrosage });
  } catch (error) {
    res.status(500).json({ message: "Erreur de mise à jour ", error });
  }
};

// Supprimer une programmation
export const deleteArrosage = async (req, res) => {
  try {
    const { id } = req.params;
    await Arrosage.findByIdAndDelete(id);
    res.status(200).json({ message: "Programmation supprimée ✅" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de suppression ❌", error });
  }
};


const controleHeureProgrammee = async (req, res) => {
  try {
    const now = new Date();  // Utilisation de la date locale (côté serveur)
    const nowHours = now.getHours();  // Heure locale, sans UTC
    const nowMinutes = now.getMinutes();

    console.log(`Heure actuelle locale : ${nowHours}:${nowMinutes}`);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);  // Début de la journée en heure locale
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);  // Fin de la journée en heure locale

    console.log(`Début de la journée : ${startOfDay}`);
    console.log(`Fin de la journée : ${endOfDay}`);

    // Recherche des arrosages programmés pour aujourd'hui
    const arrosagesAujourdhui = await Arrosage.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    let heureProgrammeeTrouvee = false;
    for (const arrosage of arrosagesAujourdhui) {
      const [heureMatinH, heureMatinM] = arrosage.heureMatin.split(':').map(Number);
      const [heureSoirH, heureSoirM] = arrosage.heureSoir.split(':').map(Number);

      console.log(`Heure programmée : Matin -> ${arrosage.heureMatin}, Soir -> ${arrosage.heureSoir}`);

      if (nowHours === heureMatinH && nowMinutes === heureMatinM) {
        console.log(`Arrosage matin pour ${arrosage.typePlante} à ${arrosage.heureMatin}`);
        await declencherArrosage(arrosage);
        heureProgrammeeTrouvee = true;
      }

      if (nowHours === heureSoirH && nowMinutes === heureSoirM) {
        console.log(`Arrosage soir pour ${arrosage.typePlante} à ${arrosage.heureSoir}`);
        await declencherArrosage(arrosage);
        heureProgrammeeTrouvee = true;
      }
    }

    if (!heureProgrammeeTrouvee) {
      return res.status(200).json({ message: "Aucune heure programmée aujourd'hui." });
    }

    res.status(200).json({ message: "Vérification de l'heure programmée effectuée." });
  } catch (error) {
    console.error("Erreur lors du contrôle de l'heure programmée", error);
    res.status(500).json({ message: "Erreur lors du contrôle de l'heure programmée", error });
  }
};



// Exemple de fonction à appeler pour déclencher l'arrosage
const declencherArrosage = (arrosage) => {
  console.log(`Déclenchement de l'arrosage pour ${arrosage.typePlante} avec ${arrosage.quantiteEau} litres d'eau.`);
  // Logique pour déclencher l'arrosage
};

// Exportation du contrôleur complet
export default {
  ajouterArrosage,
  getAllArrosages,
  updateArrosage,
  deleteArrosage,
  controleHeureProgrammee
};
