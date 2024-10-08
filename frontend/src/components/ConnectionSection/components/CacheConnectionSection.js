import React, { useContext, useEffect } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Chip,
  Stack,
} from '@mui/material';
import { MoviesContext } from '../../../Context/ContextProvider';
import { Global } from '../../../helpers/Global';

const CacheConnectionSection = () => {
  const { cacheConnectionState, setCacheConnectionState, environment } = useContext(MoviesContext);

  // Función para manejar la conexión a la caché
  const connectToCache = () => {
    fetch(Global.url + 'connect-redis', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => setCacheConnectionState(data.redisStatus))
      .catch(() => setCacheConnectionState('Disconnected'));
  };

  // Función para manejar la desconexión de la caché
  const disconnectFromCache = () => {
    fetch(Global.url + 'disconnect-redis', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => setCacheConnectionState(data.redisStatus))
      .catch(() => setCacheConnectionState('Disconnected'));
  };

  // Obtener el estado inicial cuando el componente se monta
  useEffect(() => {
    fetch(Global.url + 'redis-status')
      .then(response => response.json())
      .then(data => setCacheConnectionState(data.redisStatus))
      .catch(() => setCacheConnectionState('Disconnected'));
  });

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', backgroundColor: '#333', color: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Cache Connection
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Connection Status:
            </Typography>
            <Chip 
              label={cacheConnectionState === 'connecting' ? 'Connecting...' : cacheConnectionState}
              color={cacheConnectionState === 'connected' ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>
          
          <Stack spacing={2} direction="column">
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                fullWidth
                onClick={connectToCache} 
                disabled={environment !== 'production' || cacheConnectionState !== 'Disconnected'}
              >
                Connect
              </Button>
              <Button 
                variant="contained" 
                fullWidth
                onClick={disconnectFromCache} 
                disabled={environment !== 'production' || cacheConnectionState !== 'Connected'}
              >
                Disconnect
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export default CacheConnectionSection;