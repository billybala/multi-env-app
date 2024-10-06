const redis = require('redis');

// Configuramos el cliente Redis
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});

redisClient.on('error', (err) => {
  console.error('Error al conectar a Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conectado a Redis...');
});

module.exports = redisClient;