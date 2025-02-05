const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const arrosageRoutes = require("./routes/arrosageRoutes");
const cors = require('cors');

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

// Utiliser CORS
app.use(cors()); // Autoriser toutes les origines

// Routes
app.use("/api/arrosage", arrosageRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});