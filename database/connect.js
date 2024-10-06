const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usamos la variable de entorno MONGO_URI que viene del respectivo fichero .env
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Conectado a MongoDB...');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1); // Salimos si no se puede conectar
  }
};

module.exports = connectDB;