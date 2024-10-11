# Aplicación Multi-Entorno

## 1. Guía para hacer el setup del proyecto

### Requisitos previos

Antes de empezar, asegúrate de tener Node.js instalado para poder instalar las dependencias y ejecutar el proyecto.

Puedes descargar Node.js desde el sitio oficial: https://nodejs.org/es/

En caso de querer ver visualmente las bases de datos, puedes utilizar [MongoDB Compass](https://www.mongodb.com/try/download/compass) y conectarte poniendo `mongodb://0.0.0.0:27017` como URI. Una vez conectado, cuando levantes la aplicación, deberías ver la base de datos correspondiente al entorno que estés utilizando (`dev_database` o `prod_database`).

### Instalación

1. Descarga el proyecto comprimido o clona el repositorio. Puedes descargarlo o clonarlo desde GitHub (https://github.com/billybala/multi-env-app). Si prefieres clonar el repositorio, asegúrate de que estés en la carpeta donde quieres clonar el proyecto y ejecuta `git clone https://github.com/billybala/multi-env-app.git`.

2. Una vez descargado o clonado el proyecto, abre una terminal en la carpeta del proyecto, sitúate en la carpeta backend (`cd backend`) y ejecuta `npm install` para instalar las dependencias del backend. Haz lo mismo para la carpeta frontend (`cd frontend`) y ejecuta `npm install`.

3. Una vez instaladas las dependencias, dirígete a tu gestor de docker preferido, abre una terminal y ejecuta uno de los siguientes comandos para crear y arrancar el contenedor de la aplicación en función del entorno que desees utilizar:

- Para el entorno de desarrollo, ejecuta `docker-compose --env-file .env.dev up --build`.
- Para el entorno de producción, ejecuta `docker-compose --env-file .env.prod up --build`.

4. Cuando se haya levantado la aplicación, espera a que el frontend te indique que está listo. Sabrás que está listo cuando te muestre la url `http://localhost:3000`. Ábrela en tu navegador para ver la aplicación.

## 2. Partes del proyecto

### 2.1 Backend

El backend se encarga de manejar la conexión a la base de datos y la caché, así como de gestionar las operaciones de la aplicación. El backend está dividido en dos partes principales:

- **Server.js**: Este archivo es el punto de entrada principal del backend. Contiene la configuración de la aplicación, la conexión a la base de datos y la caché, y la configuración del servidor. También contiene las rutas de las diferentes APIs que se utilizarán en el frontend.

- **Database**: Esta carpeta contiene los archivos necesarios para conectarse a la base de datos. Contiene un archivo llamado `connect.js` que contiene la función para conectarse a la base de datos.

- **Cache**: Esta carpeta contiene los archivos necesarios para conectarse a la caché. Contiene un archivo llamado `cache.js` que contiene la función para conectarse a la caché.

- **Models**: Esta carpeta contiene los archivos necesarios para definir los modelos de la base de datos. Contiene un archivo llamado `Movie.js` que contiene la definición de los modelos de la base de datos.

- **Routes**: Esta carpeta contiene los archivos necesarios para definir las rutas de las diferentes APIs. Contiene un archivo llamado `movies.js` que contiene la definición de las rutas de las APIs.

- **Controllers**: Esta carpeta contiene los archivos necesarios para definir las funciones de las diferentes APIs. Contiene un archivo llamado `movies.js` que contiene la definición de las funciones de las APIs.

- **Dockerfile**: Este archivo es el archivo de configuración del contenedor de la aplicación. Contiene las instrucciones necesarias para construir el contenedor del backend.

### 2.2 Frontend

El frontend se encarga de mostrar la interfaz de usuario de la aplicación y de interactuar con el backend. El frontend está dividido en dos partes principales:

- **App.js**: Este archivo es el punto de entrada principal del frontend.

- **Components**: Esta carpeta contiene los archivos necesarios para definir los componentes de la aplicación.

- **Context**: Esta carpeta contiene el archivo necesario para definir las variables globales y las funciones de estado del frontend.

- **Helpers**: Esta carpeta contiene los archivos necesarios para definir las funciones de utilidad del frontend.

- **Dockerfile**: Este archivo es el archivo de configuración del contenedor de la aplicación. Contiene las instrucciones necesarias para construir el contenedor del frontend.

### 2.3 Archivos de entorno .env.dev y .env.prod

Estos archivos contienen las variables de entorno que se utilizarán en el backend y el frontend. Cada archivo contiene las variables de entorno correspondientes a un entorno diferente, y se utilizan para configurar la conexión a la base de datos y la caché según el entorno que se esté utilizando.

### 2.4 Archivo docker-compose.yml

Este archivo contiene la configuración de la aplicación para ejecutarse en diferentes entornos. Contiene las variables de entorno que se utilizarán en el backend y el frontend, así como las configuraciones de la base de datos y la caché según el entorno que se esté utilizando.

## 4. Tests utilizados y sus output

### 4.1 Entorno de desarrollo:

- **Test de conexión a la base de datos**: La aplicación se conecta a la base de datos automáticamente y muestra el estado de la conexión en la sección de conexión a la base de datos. Con los botones de conectar y desconectar, se visualiza como cambia el estado de la conexión a la base de datos.

- **Test de conexión a la caché**: La aplicación no se conecta a la caché en este entorno, por lo que siempre se muestra el estado de la conexión como desconectado.

- **Test de añadir una película a la base de datos**: Se muestra el modal de añadir una película después de pulsar el botón "Añadir película". Se muestra la película en la lista de películas de la base de datos después de añadirla.

- **Test de mostrar todas las películas de la base de datos**: Se muestra la lista de películas de la base de datos después de pulsar el botón "Mostrar películas".

- **Test de eliminar una película de la base de datos**: Al pulsar el botón "Borrar película" de una película en concreto, esta se elimina de la base de datos.

- **Test de guardar películas en caché**: La aplicación no se conecta a la caché en este entorno, por lo que no se puede guardar las películas en caché.

- **Test de mostrar películas en caché**: La aplicación no se conecta a la caché en este entorno, por lo que no se puede mostrar las películas en caché.

- **Test de vaciar caché**: La aplicación no se conecta a la caché en este entorno, por lo que no se puede vaciar la caché.

### 4.2 Entorno de producción:

- **Test de conexión a la base de datos**: La aplicación se conecta a la base de datos automáticamente y muestra el estado de la conexión en la sección de conexión a la base de datos. Con los botones de conectar y desconectar, se visualiza como cambia el estado de la conexión a la base de datos.

- **Test de conexión a la caché**: La aplicación se conecta a la caché automáticamente y muestra el estado de la conexión en la sección de conexión a la caché. Con los botones de conectar y desconectar, se visualiza como cambia el estado de la conexión a la caché.

- **Test de añadir una película a la base de datos**: Se muestra el modal de añadir una película después de pulsar el botón "Añadir película". Se muestra la película en la lista de películas de la base de datos después de añadirla.

- **Test de mostrar todas las películas de la base de datos**: Se muestra la lista de películas de la base de datos después de pulsar el botón "Mostrar películas de la BD".

- **Test de guardar películas en caché**: Al pulsar el botón "Guardar películas en caché", se guardan las películas de la base de datos en caché.

- **Test de mostrar películas en caché**: Al pulsar el botón "Mostrar películas en caché", se muestran las películas guardadas en caché.

- **Test de vaciar caché**: Al pulsar el botón "Vaciar caché", se vacían las películas guardadas en caché.
