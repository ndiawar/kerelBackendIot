import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws'; // Correct import
import cors from 'cors';
import arrosageRoutes from './routes/arrosageRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());
app.use(cors()); // Autoriser toutes les origines

// Serveur WebSocket
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Nouvelle connexion WebSocket');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Données reçues :', data);

      // Envoyer les données directement au client sans les sauvegarder
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('Erreur lors du traitement des données :', error);
    }
  });

  ws.on('close', () => {
    console.log('Connexion WebSocket fermée');
  });
});

// Endpoint pour contrôler l'arrosage
app.post('/api/water', (req, res) => {
  const { action } = req.body; // "on" ou "off"
  console.log(`Arrosage : ${action}`);

  // Envoyer la commande au Raspberry Pi via WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ command: 'water', action }));
    }
  });

  res.status(200).send(`Arrosage ${action}`);
});

// Routes pour les fonctionnalités d'arrosage
app.use("/api/arrosage", arrosageRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
