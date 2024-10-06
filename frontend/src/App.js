import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState({ mongoStatus: '', redisStatus: '' });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/status`)
      .then(response => response.json())
      .then(data => setStatus(data))
      .catch(error => console.error('Error al obtener el estado:', error));
  }, []);

  return (
    <div>
      <h1>Estado de las conexiones</h1>
      <p><strong>MongoDB:</strong> {status.mongoStatus}</p>
      <p><strong>Redis:</strong> {status.redisStatus}</p>
    </div>
  );
}

export default App;