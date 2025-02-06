const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const cors = require('cors');
const arrosageRoutes = require('./routes/arrosageRoutes');
const { Client } = require('ssh2');
const cron = require('node-cron'); // Importez node-cron
const SensorData = require('./models/SensorData'); // Importez le modèle

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/arrosage-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware pour parser le JSON
app.use(express.json());
app.use(cors());

// Serveur WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Nouvelle connexion WebSocket');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Données reçues :', data);

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

// Configuration de la connexion SSH
const conn = new Client();
const scriptPath = '/home/simplon/testarduino/testarduino.py';

conn.on('ready', () => {
  console.log('Connexion SSH établie');

  // Exécutez le script Python sur le Raspberry Pi
  conn.exec(`/home/simplon/Desktop/dht_test/myenv/bin/python3 ${scriptPath}`, (err, stream) => {
    if (err) throw err;

    stream.on('data', (data) => {
      console.log('Données : ' + data.toString());

      // Envoyer les données au client WebSocket si nécessaire
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    }).stderr.on('data', (data) => {
      console.log('Erreur : ' + data.toString());
    }).on('close', (code, signal) => {
      console.log('Stream terminé avec le code: ' + code);
      conn.end();
    });
  });
}).connect({
  host: '192.168.1.35',
  port: 22,
  username: 'simplon',
  password: 'simplon'
});

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