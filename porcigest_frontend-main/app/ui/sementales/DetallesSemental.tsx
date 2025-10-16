'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  CloseRounded,
  MaleRounded,
  TrendingUpRounded,
  PersonRounded,
} from '@mui/icons-material';
import { Semental } from '../../../src/hooks/useSementales';

interface DetallesSementalProps {
  open: boolean;
  semental: Semental | null;
  onClose: () => void;
}

// Función para obtener el color del chip según la tasa de fertilidad
const getFertilityColor = (tasa: number): "success" | "warning" | "error" | "info" => {
  if (tasa >= 85) return 'success';
  if (tasa >= 70) return 'info';
  if (tasa >= 55) return 'warning';
  return 'error';
};

const getFertilityLabel = (tasa: number): string => {
  if (tasa >= 85) return 'Excelente';
  if (tasa >= 70) return 'Buena';
  if (tasa >= 55) return 'Regular';
  return 'Baja';
};

export default function DetallesSemental({ open, semental, onClose }: DetallesSementalProps) {
  if (!semental) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#99775C',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MaleRounded />
          <Typography variant="h6" component="div">
            Detalles del Semental
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Información Principal */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#99775C', fontWeight: 'bold' }}>
            Información Principal
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MaleRounded sx={{ color: '#99775C' }} />
            <Typography variant="body1">
              <strong>ID:</strong> {semental.id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body1">
              <strong>Nombre:</strong> {semental.nombre}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body1">
              <strong>Raza:</strong> {semental.raza}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información Reproductiva */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#99775C', fontWeight: 'bold' }}>
            Rendimiento Reproductivo
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUpRounded sx={{ color: '#99775C' }} />
            <Typography variant="body1">
              <strong>Tasa de Fertilidad:</strong>
            </Typography>
            <Chip
              label={`${semental.tasa_fertilidad}% - ${getFertilityLabel(semental.tasa_fertilidad)}`}
              color={getFertilityColor(semental.tasa_fertilidad)}
              size="small"
              variant="filled"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información del Propietario */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#99775C', fontWeight: 'bold' }}>
            Información del Propietario
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PersonRounded sx={{ color: '#99775C' }} />
            <Typography variant="body1">
              <strong>Propietario:</strong>{' '}
              {semental.propietario
                ? `${semental.propietario.nombre} ${semental.propietario.apellido}`
                : 'No especificado'
              }
            </Typography>
          </Box>

          {semental.propietario && (
            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Documento:</strong> {semental.propietario.tipo_documento} {semental.propietario.numero_documento}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#99775C',
            '&:hover': { bgcolor: '#7a6049' }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}