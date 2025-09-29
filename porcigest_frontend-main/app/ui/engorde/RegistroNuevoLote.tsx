'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useEngorde, LoteEngordeCreate } from '../../../src/hooks/useEngorde';
import { useLechones } from '../../../src/hooks/useLechones';

interface RegistroNuevoLoteProps {
  open: boolean;
  onClose: () => void;
  onLoteCreated?: () => void;
}

const RegistroNuevoLote: React.FC<RegistroNuevoLoteProps> = ({ open, onClose, onLoteCreated }) => {
  const { crearLote, loading, error, clearError } = useEngorde();
  const { camadas } = useLechones();

  // Estados del formulario
  const [formData, setFormData] = useState<LoteEngordeCreate>({
    lote_id_str: '',
    fecha_inicio: '',
    numero_cerdos: 1,
    peso_inicial_promedio: 0,
    peso_actual_promedio: 0,
    camada_origen_id: 0,
  });

  // Estados de validación
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LoteEngordeCreate, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: keyof LoteEngordeCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario comience a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Limpiar mensaje de error general
    if (error) {
      clearError();
    }
  };

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof LoteEngordeCreate, string>> = {};

    if (!formData.lote_id_str.trim()) {
      errors.lote_id_str = 'El ID del lote es obligatorio';
    }

    if (!formData.fecha_inicio) {
      errors.fecha_inicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.numero_cerdos || formData.numero_cerdos < 1) {
      errors.numero_cerdos = 'El número de cerdos debe ser mayor a 0';
    }

    if (formData.peso_inicial_promedio !== undefined && formData.peso_inicial_promedio < 0) {
      errors.peso_inicial_promedio = 'El peso inicial no puede ser negativo';
    }

    if (formData.peso_actual_promedio !== undefined && formData.peso_actual_promedio < 0) {
      errors.peso_actual_promedio = 'El peso actual no puede ser negativo';
    }

    if (!formData.camada_origen_id) {
      errors.camada_origen_id = 'Debe seleccionar una camada de origen';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowSuccess(false);

    try {
      const success = await crearLote(formData);

      if (success) {
        setShowSuccess(true);

        // Llamar callback si existe
        if (onLoteCreated) {
          onLoteCreated();
        }

        // Resetear y cerrar después de un momento
        setTimeout(() => {
          handleReset();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error al crear lote:', err);
    }
  };

  // Función para resetear el formulario
  const handleReset = () => {
    setFormData({
      lote_id_str: '',
      fecha_inicio: '',
      numero_cerdos: 1,
      peso_inicial_promedio: 0,
      peso_actual_promedio: 0,
      camada_origen_id: 0,
    });
    setFormErrors({});
    setShowSuccess(false);
    if (error) clearError();
  };

  const handleClose = () => {
    if (!loading) {
      handleReset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Registrar Nuevo Lote de Engorde
      </DialogTitle>
      
      <DialogContent>
        {/* Mensajes de estado */}
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Lote registrado exitosamente
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 3
            }}
          >
            {/* ID del lote */}
            <TextField
              fullWidth
              label="ID del Lote"
              value={formData.lote_id_str}
              onChange={(e) => handleInputChange('lote_id_str', e.target.value)}
              error={!!formErrors.lote_id_str}
              helperText={formErrors.lote_id_str || 'Identificador único del lote'}
              disabled={loading}
              required
            />

            {/* Fecha de inicio */}
            <TextField
              fullWidth
              label="Fecha de Inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.fecha_inicio}
              helperText={formErrors.fecha_inicio}
              disabled={loading}
              required
            />

            {/* Número de cerdos */}
            <TextField
              fullWidth
              label="Número de Cerdos"
              type="number"
              value={formData.numero_cerdos}
              onChange={(e) => handleInputChange('numero_cerdos', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 100 }}
              error={!!formErrors.numero_cerdos}
              helperText={formErrors.numero_cerdos || 'Cantidad de cerdos en el lote'}
              disabled={loading}
              required
            />

            {/* Peso inicial promedio */}
            <TextField
              fullWidth
              label="Peso Inicial Promedio (kg)"
              type="number"
              value={formData.peso_inicial_promedio}
              onChange={(e) => handleInputChange('peso_inicial_promedio', parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 200, step: 0.1 }}
              error={!!formErrors.peso_inicial_promedio}
              helperText={formErrors.peso_inicial_promedio || 'Opcional - Peso inicial al ingreso'}
              disabled={loading}
            />

            {/* Peso actual promedio */}
            <TextField
              fullWidth
              label="Peso Actual Promedio (kg)"
              type="number"
              value={formData.peso_actual_promedio}
              onChange={(e) => handleInputChange('peso_actual_promedio', parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 200, step: 0.1 }}
              error={!!formErrors.peso_actual_promedio}
              helperText={formErrors.peso_actual_promedio || 'Opcional - Peso actual'}
              disabled={loading}
            />

            {/* Camada origen */}
            <FormControl fullWidth error={!!formErrors.camada_origen_id} disabled={loading}>
              <InputLabel required>Camada de Origen</InputLabel>
              <Select
                value={formData.camada_origen_id}
                onChange={(e) => handleInputChange('camada_origen_id', e.target.value as number)}
                label="Camada de Origen *"
              >
                <MenuItem value={0} disabled>
                  <em>Seleccionar camada</em>
                </MenuItem>
                {camadas.map((camada) => (
                  <MenuItem key={camada.id} value={camada.id}>
                    Camada #{camada.id} - {new Date(camada.fecha_nacimiento).toLocaleDateString()} 
                    ({camada.numero_lechones} lechones - Madre: {camada.madre.codigo_id})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.camada_origen_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {formErrors.camada_origen_id}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Información adicional */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Información:</strong> El lote se creará a partir de la camada seleccionada. 
              Los pesos son opcionales pero recomendados para un mejor seguimiento.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "#99775C",
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
          disabled={loading}
          sx={{
            backgroundColor: "#99775C",
            '&:hover': {
              backgroundColor: '#7a6049',
            },
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Lote'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistroNuevoLote;