'use client';

import React, { useState, useEffect } from 'react';
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
  Autocomplete,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useVeterinaria, TratamientoVeterinarioCreate } from '../../../src/hooks/useVeterinaria';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { useSementales } from '../../../src/hooks/useSementales';
import { useLechones } from '../../../src/hooks/useLechones';
import { useEngorde } from '../../../src/hooks/useEngorde';

interface RegistroNuevoTratamientoProps {
  open: boolean;
  onClose: () => void;
  onTratamientoCreated?: () => void;
}

// Tipos de tratamiento predefinidos
const TIPOS_TRATAMIENTO = [
  'Vacunación',
  'Desparasitación',
  'Antibiótico',
  'Vitaminas',
  'Antiinflamatorio',
  'Tratamiento de heridas',
  'Cirugía menor',
  'Revisión general',
  'Tratamiento reproductivo',
  'Otros'
];

interface AnimalOption {
  id: number;
  codigo_id: string;
  tipo: string;
  raza?: string;
  detalles?: string;
}

const RegistroNuevoTratamiento: React.FC<RegistroNuevoTratamientoProps> = ({ 
  open, 
  onClose, 
  onTratamientoCreated 
}) => {
  const { crearTratamiento, loading, error, clearError } = useVeterinaria();
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();
  const { camadas } = useLechones();
  const { lotes } = useEngorde();

  // Estados del formulario - usando campos que coinciden con el backend
  const [formData, setFormData] = useState<TratamientoVeterinarioCreate>({
    fecha: new Date().toISOString().split('T')[0],
    tipo_intervencion: '',
    medicamento_producto: '',
    dosis: '',
    veterinario: '',
    observaciones: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [animalesDisponibles, setAnimalesDisponibles] = useState<AnimalOption[]>([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<AnimalOption | null>(null);

  // Preparar lista de animales disponibles
  useEffect(() => {
    const animales: AnimalOption[] = [];

    // Reproductoras
    reproductoras.forEach(reproductora => {
      animales.push({
        id: reproductora.id,
        codigo_id: reproductora.codigo_id,
        tipo: 'reproductora',
        raza: reproductora.raza,
        detalles: `Reproductora - ${reproductora.raza}`
      });
    });

    // Sementales
    sementales.forEach(semental => {
      animales.push({
        id: semental.id,
        codigo_id: semental.nombre,
        tipo: 'semental',
        raza: semental.raza,
        detalles: `Semental - ${semental.raza}`
      });
    });

    // Lotes de engorde
    lotes.forEach(lote => {
      animales.push({
        id: lote.id,
        codigo_id: lote.lote_id_str,
        tipo: 'lote_engorde',
        detalles: `Lote de Engorde - ${lote.numero_cerdos} cerdos`
      });
    });

    setAnimalesDisponibles(animales);
  }, [reproductoras, sementales, lotes]);

  // Limpiar errores cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      clearError();
      setFormErrors({});
      setShowSuccess(false);
    }
  }, [open, clearError]);

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (field: keyof TratamientoVeterinarioCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo si existe
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fecha?.trim()) {
      errors.fecha = 'La fecha es requerida';
    }

    if (!formData.tipo_intervencion?.trim()) {
      errors.tipo_intervencion = 'El tipo de intervención es requerido';
    }

    if (!animalSeleccionado) {
      errors.animal = 'Debe seleccionar un animal';
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

    // Preparar datos con el animal seleccionado
    const datosCompletos: TratamientoVeterinarioCreate = {
      ...formData,
      // Asignar el ID según el tipo de animal
      ...(animalSeleccionado!.tipo === 'reproductora' && { reproductora_id: animalSeleccionado!.id }),
      ...(animalSeleccionado!.tipo === 'semental' && { semental_id: animalSeleccionado!.id }),
      ...(animalSeleccionado!.tipo === 'lote_engorde' && { lote_engorde_id: animalSeleccionado!.id }),
    };

    try {
      await crearTratamiento(datosCompletos);
      setShowSuccess(true);
      
      // Limpiar formulario
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        tipo_intervencion: '',
        medicamento_producto: '',
        dosis: '',
        veterinario: '',
        observaciones: '',
      });
      setAnimalSeleccionado(null);
      
      // Notificar al componente padre
      if (onTratamientoCreated) {
        onTratamientoCreated();
      }
      
      // Cerrar diálogo después de un breve delay
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error al crear tratamiento:', error);
    }
  };

  // Función para cancelar y cerrar el diálogo
  const handleCancel = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipo_intervencion: '',
      medicamento_producto: '',
      dosis: '',
      veterinario: '',
      observaciones: '',
    });
    setAnimalSeleccionado(null);
    setFormErrors({});
    setShowSuccess(false);
    clearError();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#99775C', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AddIcon />
        Registrar Nuevo Tratamiento Veterinario
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {/* Mensajes de estado */}
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ¡Tratamiento registrado exitosamente!
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Primera fila: Fecha y Tipo de Intervención */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha del Tratamiento"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                error={!!formErrors.fecha}
                helperText={formErrors.fecha}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth required error={!!formErrors.tipo_intervencion}>
                <InputLabel>Tipo de Intervención</InputLabel>
                <Select
                  value={formData.tipo_intervencion}
                  onChange={(e) => handleInputChange('tipo_intervencion', e.target.value)}
                  label="Tipo de Intervención"
                >
                  {TIPOS_TRATAMIENTO.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.tipo_intervencion && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {formErrors.tipo_intervencion}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Segunda fila: Animal y Veterinario */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Autocomplete
                options={animalesDisponibles}
                getOptionLabel={(option) => `${option.codigo_id} - ${option.detalles}`}
                value={animalSeleccionado}
                onChange={(_, newValue) => setAnimalSeleccionado(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Animal a Tratar"
                    required
                    error={!!formErrors.animal}
                    helperText={formErrors.animal}
                  />
                )}
                sx={{ flex: 1 }}
              />

              <TextField
                label="Veterinario"
                value={formData.veterinario}
                onChange={(e) => handleInputChange('veterinario', e.target.value)}
                fullWidth
              />
            </Box>

            {/* Tercera fila: Medicamento y Dosis */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Medicamento/Producto"
                value={formData.medicamento_producto}
                onChange={(e) => handleInputChange('medicamento_producto', e.target.value)}
                fullWidth
              />

              <TextField
                label="Dosis"
                value={formData.dosis}
                onChange={(e) => handleInputChange('dosis', e.target.value)}
                fullWidth
                placeholder="ej: 2ml, 5mg/kg, 1 tableta"
              />
            </Box>

            {/* Observaciones */}
            <TextField
              label="Observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Detalles adicionales sobre el tratamiento..."
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCancel}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#99775C',
              '&:hover': {
                backgroundColor: '#7a6049',
              },
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          >
            {loading ? 'Registrando...' : 'Registrar Tratamiento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegistroNuevoTratamiento;