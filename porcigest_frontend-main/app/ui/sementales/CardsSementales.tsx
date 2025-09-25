"use client"

import { Card, CardContent, CircularProgress, Box } from "@mui/material";
import theme from "@/theme/theme";
import { useSementales } from "../../../src/hooks/useSementales";

const { main, contrastText } = theme.palette.secondary;

const CardsSementales = () => {
  const { sementales, loading } = useSementales();

  // Calcular estadísticas
  const sementalesActivos = sementales.length;
  const tasaFertilidadPromedio = sementales.length > 0 
    ? (sementales.reduce((sum, s) => sum + (s.tasa_fertilidad || 0), 0) / sementales.length).toFixed(1)
    : 0;
  
  const sementalesConBuenaFertilidad = sementales.filter(s => (s.tasa_fertilidad || 0) >= 80).length;

  if (loading) {
    return (
      <section id="cards-sementales" className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
        {[1, 2, 3].map((index) => (
          <Card key={index} sx={{ minWidth: 200, backgroundColor: main, color: contrastText }}>
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="60px">
                <CircularProgress size={30} sx={{ color: contrastText }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section id="cards-sementales" className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
      <Card sx={{ 
        minWidth: 200, 
        backgroundColor: main, 
        color: contrastText,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent>
          <h3 className="text-xs uppercase font-bold">Sementales Registrados</h3>
          <span className="text-2xl font-semibold">{sementalesActivos}</span>
        </CardContent>
      </Card>
      
      <Card sx={{ 
        minWidth: 200, 
        backgroundColor: main, 
        color: contrastText,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent>
          <h3 className="text-xs uppercase font-bold">Tasa Fertilidad Promedio</h3>
          <span className="text-2xl font-semibold">{tasaFertilidadPromedio}%</span>
        </CardContent>
      </Card>   
      
      <Card sx={{ 
        minWidth: 200, 
        backgroundColor: main, 
        color: contrastText,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent>
          <h3 className="text-xs uppercase font-bold">Alta Fertilidad (≥80%)</h3>
          <span className="text-2xl font-semibold">{sementalesConBuenaFertilidad}</span>
        </CardContent>
      </Card>
    </section>
  );
};

export default CardsSementales;
