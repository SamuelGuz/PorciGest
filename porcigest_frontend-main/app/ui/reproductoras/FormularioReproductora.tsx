'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormLabel,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SaveRounded, CancelRounded } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import { CerdaReproductora, CerdaCreate, CerdaUpdate } from '../../../lib/definitions';

dayjs.locale('es');

interface FormularioReproductoraProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CerdaCreate | CerdaUpdate) => Promise<boolean>;
  reproductora?: CerdaReproductora | null; // null para crear, objeto para editar
  loading: boolean;
}

// Opciones de raza más comunes en producción porcina
const RAZAS_DISPONIBLES = [
  'Yorkshire',
  'Landrace',
  'Duroc',
  'Hampshire',
  'Pietrain',
  'Large White',
  'Cruce Comercial',
  'Otra'
];

// Estados reproductivos disponibles
const ESTADOS_REPRODUCTIVOS = [
  'Vacía',
  'Gestante',
  'Lactando',
  'Descarte',
  'Servicio'
];

export default function FormularioReproductora({
  open,
  onClose,
  onSubmit,
  reproductora,
  loading
}: FormularioReproductoraProps) {
  const [formData, setFormData] = useState({
    codigo_id: '',
    fecha_nacimiento: null as Dayjs | null,
    raza: '',
    estado_reproductivo: 'Vacía'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otherRaza, setOtherRaza] = useState('');

  const isEdit = !!reproductora;

  // Resetear formulario cuando se abre/cierra o cambia la reproductora
  useEffect(() => {
    if (open) {
      if (reproductora) {
        // Modo edición: cargar datos existentes
        setFormData({
          codigo_id: reproductora.codigo_id,
          fecha_nacimiento: dayjs(reproductora.fecha_nacimiento),
          raza: reproductora.raza,
          estado_reproductivo: reproductora.estado_reproductivo
        });
        
        // Si la raza no está en las opciones predefinidas, es "Otra"
        if (!RAZAS_DISPONIBLES.includes(reproductora.raza)) {
          setOtherRaza(reproductora.raza);
          setFormData(prev => ({ ...prev, raza: 'Otra' }));
        }
      } else {
        // Modo creación: valores por defecto
        setFormData({
          codigo_id: '',
          fecha_nacimiento: null,
          raza: '',
          estado_reproductivo: 'Vacía'
        });
        setOtherRaza('');
      }
      setErrors({});
    }
  }, [open, reproductora]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData(prev => ({ ...prev, fecha_nacimiento: date }));
    if (errors.fecha_nacimiento) {
      setErrors(prev => ({ ...prev, fecha_nacimiento: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar código ID
    if (!formData.codigo_id.trim()) {
      newErrors.codigo_id = 'El código ID es obligatorio';
    } else if (formData.codigo_id.trim().length < 2) {
      newErrors.codigo_id = 'El código ID debe tener al menos 2 caracteres';
    }

    // Validar fecha de nacimiento
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (formData.fecha_nacimiento.isAfter(dayjs())) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
    } else if (formData.fecha_nacimiento.isBefore(dayjs().subtract(20, 'years'))) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es muy antigua';
    }

    // Validar raza
    if (!formData.raza) {
      newErrors.raza = 'La raza es obligatoria';
    } else if (formData.raza === 'Otra' && !otherRaza.trim()) {
      newErrors.raza = 'Especifique la raza';
    }

    // Validar estado reproductivo
    if (!formData.estado_reproductivo) {
      newErrors.estado_reproductivo = 'El estado reproductivo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Preparar datos para enviar
    const submitData = {
      codigo_id: formData.codigo_id.trim(),
      fecha_nacimiento: formData.fecha_nacimiento!.format('YYYY-MM-DD'),
      raza: formData.raza === 'Otra' ? otherRaza.trim() : formData.raza,
      estado_reproductivo: formData.estado_reproductivo
    };

    const success = await onSubmit(submitData);
    
    if (success) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#99775C', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SaveRounded />
        {isEdit ? 'Editar Reproductora' : 'Nueva Reproductora'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Primera fila */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: '250px' }}>
                <FormLabel sx={{ fontWeight: 600, color: '#000', mb: 1, display: 'block' }}>
                  Código ID *
                </FormLabel>
                <TextField
                  fullWidth
                  value={formData.codigo_id}
                  onChange={handleInputChange('codigo_id')}
                  error={!!errors.codigo_id}
                  helperText={errors.codigo_id}
                  placeholder="Ej: R001, CRP-2024-001"
                  disabled={loading}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: '250px' }}>
                <FormLabel sx={{ fontWeight: 600, color: '#000', mb: 1, display: 'block' }}>
                  Fecha de Nacimiento *
                </FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    value={formData.fecha_nacimiento}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(20, 'years')}
                    disabled={loading}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fecha_nacimiento,
                        helperText: errors.fecha_nacimiento,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            {/* Segunda fila */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: '250px' }}>
                <FormLabel sx={{ fontWeight: 600, color: '#000', mb: 1, display: 'block' }}>
                  Raza *
                </FormLabel>
                <TextField
                  fullWidth
                  select
                  value={formData.raza}
                  onChange={handleInputChange('raza')}
                  error={!!errors.raza}
                  helperText={errors.raza}
                  disabled={loading}
                >
                  {RAZAS_DISPONIBLES.map((raza) => (
                    <MenuItem key={raza} value={raza}>
                      {raza}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ flex: 1, minWidth: '250px' }}>
                <FormLabel sx={{ fontWeight: 600, color: '#000', mb: 1, display: 'block' }}>
                  Estado Reproductivo *
                </FormLabel>
                <TextField
                  fullWidth
                  select
                  value={formData.estado_reproductivo}
                  onChange={handleInputChange('estado_reproductivo')}
                  error={!!errors.estado_reproductivo}
                  helperText={errors.estado_reproductivo}
                  disabled={loading}
                >
                  {ESTADOS_REPRODUCTIVOS.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Campo personalizado para "Otra" raza */}
            {formData.raza === 'Otra' && (
              <Box>
                <FormLabel sx={{ fontWeight: 600, color: '#000', mb: 1, display: 'block' }}>
                  Especificar Raza *
                </FormLabel>
                <TextField
                  fullWidth
                  value={otherRaza}
                  onChange={(e) => setOtherRaza(e.target.value)}
                  placeholder="Escriba el nombre de la raza"
                  disabled={loading}
                />
              </Box>
            )}

            {/* Información adicional para edición */}
            {isEdit && reproductora && (
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Información Adicional:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: {reproductora.id} | 
                  Propietario: {reproductora.propietario 
                    ? `${reproductora.propietario.nombre} ${reproductora.propietario.apellido}`
                    : 'N/A'
                  }
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCancel}
            disabled={loading}
            startIcon={<CancelRounded />}
            variant="outlined"
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveRounded />}
            variant="contained"
            sx={{
              bgcolor: '#99775C',
              '&:hover': { bgcolor: '#7a6049' }
            }}
          >
            {loading 
              ? (isEdit ? 'Actualizando...' : 'Creando...') 
              : (isEdit ? 'Actualizar' : 'Crear')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}