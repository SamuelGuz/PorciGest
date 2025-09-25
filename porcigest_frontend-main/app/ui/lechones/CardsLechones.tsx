'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Scale as ScaleIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useLechones, Camada } from '../../../src/hooks/useLechones';

interface CardStatistic {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  subtitle?: string;
}

const CardsLechones = () => {
  const { camadas } = useLechones();

  // Calcular estadísticas
  const totalCamadas = camadas.length;
  const totalLechones = camadas.reduce((sum, camada) => sum + camada.numero_lechones, 0);
  const promedioLechonesPorCamada = totalCamadas > 0 ? (totalLechones / totalCamadas).toFixed(1) : 0;
  
  // Calcular peso promedio general
  const camadasConPeso = camadas.filter(camada => camada.peso_promedio_kg && camada.peso_promedio_kg > 0);
  const pesoPromedioGeneral = camadasConPeso.length > 0 
    ? (camadasConPeso.reduce((sum, camada) => sum + (camada.peso_promedio_kg || 0), 0) / camadasConPeso.length).toFixed(2)
    : 0;

  // Camadas recientes (últimos 30 días)
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - 30);
  const camadasRecientes = camadas.filter(camada => {
    const fechaNacimiento = new Date(camada.fecha_nacimiento);
    return fechaNacimiento >= fechaLimite;
  }).length;

  const statistics: CardStatistic[] = [
    {
      title: 'Total de Camadas',
      value: totalCamadas,
      icon: <PetsIcon />,
      color: 'primary',
      subtitle: 'Camadas registradas'
    },
    {
      title: 'Total de Lechones',
      value: totalLechones,
      icon: <PetsIcon />,
      color: 'success',
      subtitle: 'Lechones nacidos'
    },
    {
      title: 'Peso Promedio',
      value: `${pesoPromedioGeneral} kg`,
      icon: <ScaleIcon />,
      color: 'warning',
      subtitle: 'Peso al nacimiento'
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Estadísticas principales */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 3, 
          mb: 3 
        }}
      >
        {statistics.map((stat, index) => (
          <Card 
            key={index}
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
                <Box color={`${stat.color}.main`}>
                  {stat.icon}
                </Box>
                {camadasRecientes > 0 && index === 0 && (
                  <Chip
                    label={`${camadasRecientes} nuevas`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Typography variant="h4" component="div" fontWeight="bold" mb={0.5}>
                {stat.value}
              </Typography>
              
              <Typography variant="h6" color="text.primary" gutterBottom>
                {stat.title}
              </Typography>
              
              {stat.subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* Card adicional para información de camadas recientes */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <CalendarIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Resumen de Actividad Reciente
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: 2 
            }}
          >
            <Box textAlign="center">
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {camadasRecientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Camadas últimos 30 días
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h5" color="warning.main" fontWeight="bold">
                {camadasConPeso.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Con registro de peso
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {new Set(camadas.map(c => c.madre.id)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Madres diferentes
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardsLechones;