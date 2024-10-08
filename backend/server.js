// require('dotenv').config({ path: './.env.dev' });  // VER COMO OBTENER EL PATH CORRECTO DEL .env EN FUNCIÓN DEL ENTORNO LEVANTADO
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Crear servidor node
const app = express();
const PORT = process.env.PORT || 8000;

// Conectar a la base de datos antes de arrancar el servidor
const connectDB = require('./database/connect.js');
connectDB();
let dbConnection = true;

// Configurar cors
app.use(cors());

// Conexión a Redis (solo en producción)
let redisConnection = false;
const redisClient = require('./cache/cache.js');
if (process.env.NODE_ENV === 'production') {
  redisClient.connect().catch(console.error);
  redisConnection = true;
}

// Convertir los datos del body a objetos json
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Endpoint para verificar el estado de la conexión a la base de datos
app.get('/api/dbstatus', (req, res) => {
  const mongoStatus = dbConnection ? 'Connected' : 'Disconnected';
  res.json({ mongoStatus });
});

// Endpoint para conectar a la base de datos
app.post('/api/dbconnect', async (req, res) => {
  if (!dbConnection) {
    try {
      connectDB();
      dbConnection = true;
      res.json({ mongoStatus: 'Connected' });
    } catch (error) {
      res.status(500).json({ mongoStatus: 'Error', error: error.message });
    }
  } else {
    res.json({ mongoStatus: 'Yet Connected' });
  }
});

// Endpoint para desconectar de la base de datos
app.post('/api/dbdisconnect', async (req, res) => {
  if (dbConnection) {
    try {
      await mongoose.disconnect();
      dbConnection = false;
      res.json({ mongoStatus: 'Disconnected' });
    } catch (error) {
      res.status(500).json({ mongoStatus: 'Error', error: error.message });
    }
  } else {
    res.json({ mongoStatus: 'Yet disconnected' });
  }
});

// Endpoint para obtener el estado de la caché
app.get('/redis-status', (req, res) => {
  if (redisClient && redisConnection) {
    res.json({ redisStatus: 'Connected' });
  } else {
    res.json({ redisStatus: 'Disconnected' });
  }
});

// Endpoint para conectar Redis
app.post('/api/connect-redis', (req, res) => {
  if (!redisClient || !redisConnection) {
    redisClient.connect();
    redisConnection = true;
    res.json({redisStatus: 'Connected' })
  } else {
    res.json({ redisStatus: 'Yet connected' });
  }
});

// Endpoint para desconectar Redis
app.post('/api/disconnect-redis', (req, res) => {
  if (redisClient && redisConnection) {
    redisClient.quit((err) => {
      if (err) {
        console.error('Error');
        return res.status(500).json({ error: 'Error' });
      }
      redisConnection = false;
      res.json({ redisStatus: 'Disconnected' });
    });
  } else {
    res.json({ redisStatus: 'Yet disconnected' });
  }
});

// Endpoint para obtener el entorno
app.get('/api/environment', (req, res) => {
  const environment = process.env.NODE_ENV;
  res.json({ environment });
});

// RUTAS ADICIONALES
const routes = require("./routes/movies.js");

// Cargar las rutas
app.use("/api", routes);

// Crear servidor y escuchar peticiones http
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
