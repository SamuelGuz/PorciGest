'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
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
import { useLechones, CamadaCreate } from '../../../src/hooks/useLechones';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { useSementales } from '../../../src/hooks/useSementales';

interface RegistroNuevaCamadaProps {
  onCamadaCreated?: () => void;
}

const RegistroNuevaCamada: React.FC<RegistroNuevaCamadaProps> = ({ onCamadaCreated }) => {
  const { crearCamada, loading, error, clearError } = useLechones();
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();

  // Estados del formulario
  const [formData, setFormData] = useState<CamadaCreate>({
    fecha_nacimiento: '',
    numero_lechones: 1,
    peso_promedio_kg: 0,
    madre_id: 0,
    padre_id: 0,
  });

  // Estados de validación
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CamadaCreate, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: keyof CamadaCreate, value: any) => {
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
    const errors: Partial<Record<keyof CamadaCreate, string>> = {};

    if (!formData.fecha_nacimiento) {
      errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.numero_lechones || formData.numero_lechones < 1) {
      errors.numero_lechones = 'El número de lechones debe ser mayor a 0';
    }

    if (formData.peso_promedio_kg !== undefined && formData.peso_promedio_kg < 0) {
      errors.peso_promedio_kg = 'El peso promedio no puede ser negativo';
    }

    if (!formData.madre_id) {
      errors.madre_id = 'Debe seleccionar una madre';
    }

    if (!formData.padre_id) {
      errors.padre_id = 'Debe seleccionar un padre';
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
      const success = await crearCamada(formData);

      if (success) {
        // Limpiar formulario
        setFormData({
          fecha_nacimiento: '',
          numero_lechones: 1,
          peso_promedio_kg: 0,
          madre_id: 0,
          padre_id: 0,
        });
        
        setFormErrors({});
        setShowSuccess(true);

        // Llamar callback si existe
        if (onCamadaCreated) {
          onCamadaCreated();
        }

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error al crear camada:', err);
    }
  };

  // Función para resetear el formulario
  const handleReset = () => {
    setFormData({
      fecha_nacimiento: '',
      numero_lechones: 1,
      peso_promedio_kg: 0,
      madre_id: 0,
      padre_id: 0,
    });
    setFormErrors({});
    setShowSuccess(false);
    if (error) clearError();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader 
        title="Registrar Nueva Camada"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <CardContent>
        {/* Mensajes de estado */}
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Camada registrada exitosamente
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
            {/* Fecha de nacimiento */}
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.fecha_nacimiento}
              helperText={formErrors.fecha_nacimiento}
              disabled={loading}
              required
            />

            {/* Número de lechones */}
            <TextField
              fullWidth
              label="Número de Lechones"
              type="number"
              value={formData.numero_lechones}
              onChange={(e) => handleInputChange('numero_lechones', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 20 }}
              error={!!formErrors.numero_lechones}
              helperText={formErrors.numero_lechones || 'Número de lechones nacidos'}
              disabled={loading}
              required
            />

            {/* Peso promedio */}
            <TextField
              fullWidth
              label="Peso Promedio (kg)"
              type="number"
              value={formData.peso_promedio_kg}
              onChange={(e) => handleInputChange('peso_promedio_kg', parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              error={!!formErrors.peso_promedio_kg}
              helperText={formErrors.peso_promedio_kg || 'Opcional - Peso promedio al nacimiento'}
              disabled={loading}
            />

            {/* Madre */}
            <FormControl fullWidth error={!!formErrors.madre_id} disabled={loading}>
              <InputLabel required>Madre</InputLabel>
              <Select
                value={formData.madre_id}
                onChange={(e) => handleInputChange('madre_id', e.target.value as number)}
                label="Madre *"
              >
                <MenuItem value={0} disabled>
                  <em>Seleccionar madre</em>
                </MenuItem>
                {reproductoras.map((reproductora) => (
                  <MenuItem key={reproductora.id} value={reproductora.id}>
                    {reproductora.codigo_id} ({reproductora.raza})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.madre_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {formErrors.madre_id}
                </Typography>
              )}
            </FormControl>

            {/* Padre */}
            <FormControl fullWidth error={!!formErrors.padre_id} disabled={loading}>
              <InputLabel required>Padre</InputLabel>
              <Select
                value={formData.padre_id}
                onChange={(e) => handleInputChange('padre_id', e.target.value as number)}
                label="Padre *"
              >
                <MenuItem value={0} disabled>
                  <em>Seleccionar padre</em>
                </MenuItem>
                {sementales.map((semental) => (
                  <MenuItem key={semental.id} value={semental.id}>
                    {semental.nombre} ({semental.raza})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.padre_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {formErrors.padre_id}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Información adicional */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Información:</strong> Asegúrese de que la fecha de nacimiento sea correcta. 
              El peso promedio es opcional pero ayuda a llevar mejores estadísticas.
            </Typography>
          </Alert>

          {/* Botones */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
              sx={{
                color: "#99775C",
                borderColor: "#99775C",
                '&:hover': {
                  backgroundColor: '#99775C',
                  borderColor: "#99775C",
                  color: 'white',
                },
              }}
            >
              Limpiar
            </Button>
            
            <Button
              type="submit"
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
              {loading ? 'Registrando...' : 'Registrar Camada'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegistroNuevaCamada;