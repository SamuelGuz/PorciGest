'use client';

import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useVeterinaria } from '../../../src/hooks/useVeterinaria';

const CardsVeterinaria: React.FC = () => {
  const { obtenerEstadisticas, obtenerTratamientos } = useVeterinaria();
  
  // Cargar tratamientos al montar el componente
  useEffect(() => {
    obtenerTratamientos();
  }, [obtenerTratamientos]);
  
  const estadisticas = obtenerEstadisticas();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 3,
        mb: 3 
      }}>
        {/* Total de Tratamientos */}
        <Card 
          sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box color="primary.main">
                <LocalHospitalIcon />
              </Box>
            </Box>
            
            <Typography variant="h4" component="div" fontWeight="bold" mb={0.5}>
              {estadisticas.totalTratamientos}
            </Typography>
            
            <Typography variant="h6" color="text.primary" gutterBottom>
              Total Tratamientos
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Registros veterinarios
            </Typography>
          </CardContent>
        </Card>

        {/* Tratamientos Recientes */}
        <Card 
          sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box color="info.main">
                <TimelineIcon />
              </Box>
            </Box>
            
            <Typography variant="h4" component="div" fontWeight="bold" mb={0.5}>
              {estadisticas.tratamientosRecientes}
            </Typography>
            
            <Typography variant="h6" color="text.primary" gutterBottom>
              Últimos 30 días
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Tratamientos recientes
            </Typography>
          </CardContent>
        </Card>

        {/* Tipos más Comunes */}
        <Card 
          sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box color="warning.main">
                <CategoryIcon />
              </Box>
            </Box>
            
            <Typography variant="h6" component="div" fontWeight="bold" mb={0.5}>
              Más Frecuente
            </Typography>
            
            <Typography variant="h6" color="text.primary" gutterBottom>
              {estadisticas.tiposMasComunes[0]?.tipo || 'N/A'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {estadisticas.tiposMasComunes[0]?.count || 0} tratamientos
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Distribución de Tipos de Tratamiento */}
      {estadisticas.tiposMasComunes.length > 0 && (
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#99775C', fontWeight: 'bold' }}>
            Distribución de Tipos de Intervención
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {estadisticas.tiposMasComunes.map((item, index) => (
              <Chip
                key={item.tipo}
                label={`${item.tipo}: ${item.count}`}
                sx={{
                  backgroundColor: index === 0 ? '#99775C' : 'rgba(153, 119, 92, 0.1)',
                  color: index === 0 ? 'white' : '#99775C',
                  fontWeight: index === 0 ? 'bold' : 'normal'
                }}
              />
            ))}
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default CardsVeterinaria;