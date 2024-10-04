# Usamos la imagen oficial de Node.js
FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install --only=production

# Copiar el resto de la aplicación
COPY . .

# Especifica el puerto en el que se ejecuta el backend
EXPOSE 8000

# Variable de entorno para el entorno de ejecución (producción o desarrollo)
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Comando para ejecutar el servidor Node.js
CMD ["npm", "run", "start"]
