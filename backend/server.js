require('dotenv').config({ path: './.env.dev' });  // VER COMO OBTENER EL PATH CORRECTO DEL .env EN FUNCIÓN DEL ENTORNO LEVANTADO
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Crear servidor node
const app = express();
const PORT = process.env.PORT || 8000;

// Conectar a la base de datos antes de arrancar el servidor
const connectDB = require('../database/connect.js');
connectDB();

// Configurar cors
app.use(cors());

// Conexión a Redis (solo en producción)
const redisClient = require('../cache/cache.js');
if (process.env.NODE_ENV === 'production') {
  redisClient.connect().catch(console.error);
}

// Convertir los datos del body a objetos json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Ruta para verificar el estado de la conexión a la base de datos y caché
app.get('/status', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
  let redisStatus = 'No se está usando Redis en este entorno';

  if (redisClient) {
    redisClient.ping((err, result) => {
      redisStatus = err ? 'Desconectado' : 'Conectado';
      res.json({ mongoStatus, redisStatus });
    });
  } else {
    res.json({ mongoStatus, redisStatus });
  }
});

// RUTAS
const routes = require("./routes/movies.js");

// Cargar las rutas
app.use("/api", routes);

// Crear servidor y escuchar peticiones http
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
