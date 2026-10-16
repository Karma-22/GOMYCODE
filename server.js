require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/users', userRoutes); // Support both /api/users and /users

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString()
  });
});

// Database Connection
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (uri && !uri.includes('<password>')) {
    try {
      await mongoose.connect(uri);
      console.log('✅ Connecté avec succès à MongoDB via Mongoose !');
    } catch (err) {
      console.warn('⚠️ Échec de connexion MongoDB distante :', err.message);
    }
  } else {
    console.log('ℹ️ Aucune variable MONGO_URI active configurée dans .env.');
  }
};

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur REST API démarré sur http://localhost:${PORT}`);
      console.log(`📊 Dashboard interactif disponible sur http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
