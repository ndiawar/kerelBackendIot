import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}?authSource=${process.env.DB_AUTH_SOURCE}`;
    
    await mongoose.connect(uri);  
    console.log('Connexion réussie à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
    process.exit(1); // Arrête le processus si la connexion échoue
  }
};

export default connectDB;  // Utilisation de export default