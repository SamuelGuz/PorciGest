'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AddRounded,
  PetsRounded,
  FemaleRounded,
  PregnantWomanRounded,
  RestartAltRounded,
} from '@mui/icons-material';

import TableReproductoras from '../../ui/reproductoras/TableReproductoras';
import FormularioReproductora from '../../ui/reproductoras/FormularioReproductora';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { CerdaReproductora, CerdaCreate, CerdaUpdate } from '../../../lib/definitions';

export default function ReproductorasPage() {
  const {
    reproductoras,
    loading,
    error,
    fetchReproductoras,
    crearReproductora,
    actualizarReproductora,
    eliminarReproductora
  } = useReproductoras();

  const [formularioOpen, setFormularioOpen] = useState(false);
  const [reproductoraSeleccionada, setReproductoraSeleccionada] = useState<CerdaReproductora | null>(null);
  const [formularioLoading, setFormularioLoading] = useState(false);

  // Estadísticas básicas
  const stats = {
    total: reproductoras.length,
    gestantes: reproductoras.filter(r => r.estado_reproductivo === 'Gestante').length,
    lactando: reproductoras.filter(r => r.estado_reproductivo === 'Lactando').length,
    vacias: reproductoras.filter(r => r.estado_reproductivo === 'Vacía').length
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchReproductoras();
  }, []); // Sin dependencias para evitar bucle infinito

  const handleNuevaReproductora = () => {
    setReproductoraSeleccionada(null);
    setFormularioOpen(true);
  };

  const handleVerReproductora = (reproductora: CerdaReproductora) => {
    // Por ahora, mostrar información en el formulario de edición como vista
    // En futuras versiones se puede implementar un modal específico para ver
    setReproductoraSeleccionada(reproductora);
    setFormularioOpen(true);
  };

  const handleEditarReproductora = (reproductora: CerdaReproductora) => {
    setReproductoraSeleccionada(reproductora);
    setFormularioOpen(true);
  };

  const handleEliminarReproductora = async (id: number) => {
    const success = await eliminarReproductora(id);
    if (success) {
      // Actualizar la lista
      fetchReproductoras();
    }
  };

  const handleFormularioSubmit = async (data: CerdaCreate | CerdaUpdate): Promise<boolean> => {
    setFormularioLoading(true);
    let success = false;

    try {
      if (reproductoraSeleccionada) {
        // Editar reproductora existente
        success = await actualizarReproductora(reproductoraSeleccionada.id, data as CerdaUpdate);
      } else {
        // Crear nueva reproductora
        success = await crearReproductora(data as CerdaCreate);
      }

      if (success) {
        // Actualizar la lista
        fetchReproductoras();
      }
    } catch (error) {
      console.error('Error en formulario:', error);
      success = false;
    } finally {
      setFormularioLoading(false);
    }

    return success;
  };

  const handleCerrarFormulario = () => {
    setFormularioOpen(false);
    setReproductoraSeleccionada(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FemaleRounded sx={{ fontSize: 36, color: '#99775C' }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
              Reproductoras
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestión de cerdas reproductoras del plantel
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RestartAltRounded />}
            onClick={fetchReproductoras}
            disabled={loading}
            sx={{ borderColor: '#99775C', color: '#99775C' }}
          >
            Actualizar
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={handleNuevaReproductora}
            sx={{
              bgcolor: '#99775C',
              '&:hover': { bgcolor: '#7a6049' }
            }}
          >
            Nueva Reproductora
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
            <PetsRounded sx={{ fontSize: 32, color: '#99775C' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#99775C' }}>
                {stats.total}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Total Reproductoras
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
            <PregnantWomanRounded sx={{ fontSize: 32, color: '#e91e63' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#e91e63' }}>
                {stats.gestantes}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Gestantes
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
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={`${stats.lactando} Lactando`} color="info" size="small" />
              <Chip label={`${stats.vacias} Vacías`} color="default" size="small" />
            </Box>
            <Typography color="textSecondary" variant="body2" textAlign="center">
              Estados Adicionales
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Mensajes de error */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchReproductoras}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Estado de carga inicial */}
      {loading && reproductoras.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: '#99775C', mb: 2 }} />
            <Typography color="textSecondary">
              Cargando reproductoras...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Tabla de reproductoras */}
      {!loading || reproductoras.length > 0 ? (
        <TableReproductoras
          reproductoras={reproductoras}
          onView={handleVerReproductora}
          onEdit={handleEditarReproductora}
          onDelete={handleEliminarReproductora}
          loading={loading}
        />
      ) : null}

      {/* Formulario de reproductora */}
      <FormularioReproductora
        open={formularioOpen}
        onClose={handleCerrarFormulario}
        onSubmit={handleFormularioSubmit}
        reproductora={reproductoraSeleccionada}
        loading={formularioLoading}
      />
    </Box>
  );
}
