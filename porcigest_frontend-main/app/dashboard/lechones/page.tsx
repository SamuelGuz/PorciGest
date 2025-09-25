'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import {
  AddRounded,
  PetsRounded,
  RestartAltRounded,
} from '@mui/icons-material';
import CardsLechones from '../../ui/lechones/CardsLechones';
import TableLechones from '../../ui/lechones/TableLechones';
import RegistroNuevaCamada from '../../ui/lechones/RegistroNuevaCamada';
import { useLechones } from '../../../src/hooks/useLechones';

const LechonesPage = () => {
  const { loading, error, obtenerCamadas } = useLechones();
  const [refreshKey, setRefreshKey] = useState(0);
  const [formularioOpen, setFormularioOpen] = useState(false);

  // Función para refrescar los datos cuando se crea una nueva camada
  const handleCamadaCreated = () => {
    setRefreshKey(prev => prev + 1);
    obtenerCamadas();
  };

  const handleNuevaCamada = () => {
    setFormularioOpen(true);
  };

  const handleCerrarFormulario = () => {
    setFormularioOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PetsRounded sx={{ fontSize: 36, color: '#99775C' }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
              Lechones
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Registro y seguimiento de camadas de lechones
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RestartAltRounded />}
            onClick={obtenerCamadas}
            disabled={loading}
            sx={{ borderColor: '#99775C', color: '#99775C' }}
          >
            Actualizar
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={handleNuevaCamada}
            sx={{
              bgcolor: '#99775C',
              '&:hover': { bgcolor: '#7a6049' }
            }}
          >
            Nueva Camada
          </Button>
        </Box>
      </Box>

      {/* Mensajes de error */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Tarjetas de estadísticas */}
      <CardsLechones />

      {/* Formulario de registro (solo cuando está abierto) */}
      {formularioOpen && (
        <Box sx={{ mb: 3 }}>
          <RegistroNuevaCamada 
            onCamadaCreated={() => {
              handleCamadaCreated();
              handleCerrarFormulario(); // Cerrar formulario después de crear
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCerrarFormulario}
              sx={{
                borderColor: '#99775C',
                color: '#99775C',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#99775C',
                },
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}

      {/* Tabla de camadas */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'hidden'
      }}>
        <TableLechones refreshKey={refreshKey} />
      </Box>
    </Box>
  );
};

export default LechonesPage;
