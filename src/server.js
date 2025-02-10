import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import arrosageRoutes from './routes/arrosageRoutes.js';
import { Client } from 'ssh2';
import cron from 'node-cron'; // Importez node-cron
import SensorData from './models/SensorData.js'; // Importez le modèle
import connectDB from './config/db.js'; // Corrected import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Middleware pour parser le JSON
app.use(express.json());
app.use(cors());


// Endpoint pour contrôler l'arrosage
app.post('/api/water', (req, res) => {
  const { action } = req.body;
  console.log(`Arrosage : ${action}`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ command: 'water', action }));
    }
  });

  res.status(200).send(`Arrosage ${action}`);
});

// Routes pour les fonctionnalités d'arrosage
app.use("/api/arrosage", arrosageRoutes);


// Tâche cron pour récupérer les données toutes les heures
cron.schedule('0 * * * *', () => {
  console.log('Récupération des données du capteur...');

  // Exécutez le script Python pour obtenir les données
  conn.exec(`/home/simplon/Desktop/dht_test/myenv/bin/python3 ${scriptPath}`, (err, stream) => {
    if (err) throw err;

    stream.on('data', (data) => {
      console.log('Données récupérées : ' + data.toString());

      // Tentez de parser les données et de les enregistrer dans MongoDB
      try {
        const parsedData = JSON.parse(data.toString());
        const newSensorData = new SensorData({
          temperature: parsedData.temperature,
          soilHumidity: parsedData.soil_humidity
        });

        newSensorData.save()
          .then(() => console.log('Données enregistrées dans MongoDB'))
          .catch(err => console.error('Erreur lors de l\'enregistrement des données :', err));
      } catch (error) {
        console.error('Erreur lors de la conversion des données :', error);
      }
    }).stderr.on('data', (data) => {
      console.log('Erreur : ' + data.toString());
    });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
