'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingIcon,
  Scale as ScaleIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useEngorde } from '../../../src/hooks/useEngorde';

interface CardStatistic {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  subtitle?: string;
}

const CardsEngorde = () => {
  const { lotes } = useEngorde();

  // Calcular estadísticas
  const totalLotes = lotes.length;
  const totalCerdos = lotes.reduce((sum, lote) => sum + lote.numero_cerdos, 0);
  
  // Calcular ganancia de peso promedio
  const lotesConGanancia = lotes.filter(lote => lote.ganancia_peso_total && lote.ganancia_peso_total > 0);
  const gananciaPromedioTotal = lotesConGanancia.length > 0 
    ? (lotesConGanancia.reduce((sum, lote) => sum + (lote.ganancia_peso_total || 0), 0) / lotesConGanancia.length).toFixed(2)
    : 0;

  // Calcular peso actual promedio
  const lotesConPesoActual = lotes.filter(lote => lote.peso_actual_promedio && lote.peso_actual_promedio > 0);
  const pesoActualPromedio = lotesConPesoActual.length > 0 
    ? (lotesConPesoActual.reduce((sum, lote) => sum + (lote.peso_actual_promedio || 0), 0) / lotesConPesoActual.length).toFixed(2)
    : 0;

  // Lotes activos (últimos 90 días)
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - 90);
  const lotesActivos = lotes.filter(lote => {
    const fechaInicio = new Date(lote.fecha_inicio);
    return fechaInicio >= fechaLimite;
  }).length;

  const statistics: CardStatistic[] = [
    {
      title: 'Total de Lotes',
      value: totalLotes,
      icon: <AgricultureIcon />,
      color: 'primary',
      subtitle: 'Lotes de engorde'
    },
    {
      title: 'Total de Cerdos',
      value: totalCerdos,
      icon: <ScaleIcon />,
      color: 'success',
      subtitle: 'En engorde'
    },
    {
      title: 'Ganancia Promedio',
      value: `${gananciaPromedioTotal} kg`,
      icon: <TrendingIcon />,
      color: 'warning',
      subtitle: 'Por lote'
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
                {lotesActivos > 0 && index === 0 && (
                  <Chip
                    label={`${lotesActivos} activos`}
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
      
      {/* Card adicional para información de rendimiento */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TimelineIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Resumen de Rendimiento
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
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {lotesActivos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lotes últimos 90 días
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {pesoActualPromedio} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Peso actual promedio
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {lotesConGanancia.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Con seguimiento peso
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardsEngorde;