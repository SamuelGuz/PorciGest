'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AddRounded,
  MaleRounded,
  RestartAltRounded,
  TrendingUpRounded,
  VerifiedRounded,
} from '@mui/icons-material';

import TableSementales from '../../ui/sementales/TableSementales';
import RegistroNuevoSemental from '../../ui/sementales/RegistroNuevoSemental';
import { useSementales } from '../../../src/hooks/useSementales';

export default function SementalesPage() {
  const {
    sementales,
    loading,
    error,
    obtenerSementales,
  } = useSementales();

  const [formularioOpen, setFormularioOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Estadísticas básicas
  const stats = {
    total: sementales.length,
    altaFertilidad: sementales.filter(s => s.tasa_fertilidad >= 80).length,
    fertilidadPromedio: sementales.length > 0 
      ? (sementales.reduce((acc, s) => acc + s.tasa_fertilidad, 0) / sementales.length).toFixed(1)
      : 0
  };

  const handleNuevoSemental = () => {
    setFormularioOpen(true);
  };

  const handleSementalCreated = () => {
    setRefreshKey(prev => prev + 1);
    obtenerSementales();
  };

  const handleCerrarFormulario = () => {
    setFormularioOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MaleRounded sx={{ fontSize: 36, color: '#99775C' }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
              Sementales
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestión de sementales reproductores del plantel
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RestartAltRounded />}
            onClick={obtenerSementales}
            disabled={loading}
            sx={{ borderColor: '#99775C', color: '#99775C' }}
          >
            Actualizar
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={handleNuevoSemental}
            sx={{
              bgcolor: '#99775C',
              '&:hover': { bgcolor: '#7a6049' }
            }}
          >
            Nuevo Semental
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ 
          minWidth: 200, 
          flex: 1,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MaleRounded sx={{ fontSize: 32, color: '#99775C' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#99775C' }}>
                {stats.total}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Total Sementales
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          minWidth: 200, 
          flex: 1,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUpRounded sx={{ fontSize: 32, color: '#4caf50' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#4caf50' }}>
                {stats.fertilidadPromedio}%
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Fertilidad Promedio
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          minWidth: 200, 
          flex: 1,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VerifiedRounded sx={{ fontSize: 32, color: '#2196f3' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#2196f3' }}>
                {stats.altaFertilidad}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Alta Fertilidad (≥80%)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Mensajes de error */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}

      {/* Formulario (cuando está abierto) */}
      {formularioOpen && (
        <Box sx={{ mb: 3 }}>
          <RegistroNuevoSemental 
            setShowForm={handleCerrarFormulario}
            onSementalCreated={handleSementalCreated}
          />
        </Box>
      )}

      {/* Tabla */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'hidden'
      }}>
        <TableSementales key={refreshKey} />
      </Box>
    </Box>
  );
}
