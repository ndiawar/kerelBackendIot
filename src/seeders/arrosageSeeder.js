import mongoose from "mongoose";
import dotenv from "dotenv";
import Arrosage from "../models/Arrosage.js"; // Assurez-vous que le chemin du modèle est correct
import connectDB from "../config/db.js";

dotenv.config(); // Charger les variables d'environnement

// Connexion à la base de données
connectDB();


// Fonction de seeding des données
const seedArrosages = async () => {
  const arrosages = [];
  const typesPlantes = ["tropicales", "maraicheres", "legumineuses", "cereales"];

  for (let i = 0; i < 25; i++) {
    // Générer une date aléatoire pour l'arrosage
    const randomDate = new Date(
      Date.now() - Math.floor(Math.random() * 10000000000) // Générer une date aléatoire dans le passé
    );
    
    // Sélectionner un type de plante au hasard parmi les 4
    const randomTypePlante = typesPlantes[Math.floor(Math.random() * typesPlantes.length)];
    
    // Générer une heure d'arrosage aléatoire pour le matin et le soir
    const randomHeureMatin = `${Math.floor(Math.random() * 12) + 5}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')}`; // Exemple : 06:15
    const randomHeureSoir = `${Math.floor(Math.random() * 12) + 17}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')}`; // Exemple : 18:45
    
    // Générer une quantité d'eau aléatoire
    const randomQuantiteEau = Math.floor(Math.random() * 5) + 1; // Entre 1 et 5 litres

    arrosages.push({
      date: randomDate,
      typePlante: randomTypePlante,
      heureMatin: randomHeureMatin,
      heureSoir: randomHeureSoir,
      quantiteEau: randomQuantiteEau,
    });
  }

  try {
    // Insertion des données dans la base de données
    await Arrosage.insertMany(arrosages);
    console.log("Seeder exécuté avec succès !");
    mongoose.connection.close(); // Ferme la connexion à la base de données après le seeding
  } catch (error) {
    console.error("Erreur lors du seeding : ", error);
    mongoose.connection.close();
  }
};

// Exécution du seeding
const runSeeder = async () => {
  await connectDB();
  await seedArrosages();
};

runSeeder();
