'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Chip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useVeterinaria, TratamientoVeterinario, TratamientoVeterinarioUpdate } from '../../../src/hooks/useVeterinaria';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { useSementales } from '../../../src/hooks/useSementales';
import { useLechones } from '../../../src/hooks/useLechones';
import { useEngorde } from '../../../src/hooks/useEngorde';

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

const TableVeterinaria: React.FC = () => {
  const { 
    tratamientos, 
    loading, 
    error, 
    actualizarTratamiento, 
    eliminarTratamiento, 
    obtenerTratamientos 
  } = useVeterinaria();
  
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();
  const { camadas } = useLechones();
  const { lotes } = useEngorde();
  
  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para el diálogo de edición
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingTratamiento, setEditingTratamiento] = useState<TratamientoVeterinario | null>(null);
  const [editFormData, setEditFormData] = useState<TratamientoVeterinarioUpdate>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [animalesDisponibles, setAnimalesDisponibles] = useState<AnimalOption[]>([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<AnimalOption | null>(null);

  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingTratamiento, setDeletingTratamiento] = useState<TratamientoVeterinario | null>(null);

  // Estados para el diálogo de detalles
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingTratamiento, setViewingTratamiento] = useState<TratamientoVeterinario | null>(null);

  // Cargar tratamientos al montar el componente
  useEffect(() => {
    obtenerTratamientos();
  }, [obtenerTratamientos]);

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

  // Función para obtener el color del chip según el tipo de tratamiento
  const getTratamientoColor = (tipo: string) => {
    const colorMap: Record<string, string> = {
      'Vacunación': '#4caf50',
      'Desparasitación': '#ff9800',
      'Antibiótico': '#f44336',
      'Vitaminas': '#2196f3',
      'Antiinflamatorio': '#9c27b0',
      'Tratamiento de heridas': '#795548',
      'Cirugía menor': '#607d8b',
      'Revisión general': '#99775C',
      'Tratamiento reproductivo': '#e91e63',
      'Otros': '#757575'
    };
    return colorMap[tipo] || '#757575';
  };

  // Función para obtener información del animal tratado
  const getAnimalInfo = (tratamiento: TratamientoVeterinario) => {
    if (tratamiento.reproductora) {
      return {
        codigo: tratamiento.reproductora.codigo_id || `Rep-${tratamiento.reproductora.id}`,
        tipo: 'Reproductora',
        raza: tratamiento.reproductora.raza
      };
    }
    if (tratamiento.semental) {
      return {
        codigo: tratamiento.semental.nombre || `Sem-${tratamiento.semental.id}`,
        tipo: 'Semental',
        raza: tratamiento.semental.raza
      };
    }
    if (tratamiento.lote_engorde) {
      return {
        codigo: tratamiento.lote_engorde.lote_id_str || `Lote-${tratamiento.lote_engorde.id}`,
        tipo: 'Lote Engorde',
        cantidad: tratamiento.lote_engorde.numero_cerdos
      };
    }
    return { codigo: 'N/A', tipo: 'Desconocido' };
  };

  // Manejar cambio de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Abrir diálogo de edición
  const handleEdit = (tratamiento: TratamientoVeterinario) => {
    setEditingTratamiento(tratamiento);
    setEditFormData({
      tipo_intervencion: tratamiento.tipo_intervencion,
      medicamento_producto: tratamiento.medicamento_producto || '',
      dosis: tratamiento.dosis || '',
      fecha: tratamiento.fecha,
      veterinario: tratamiento.veterinario || '',
      observaciones: tratamiento.observaciones || '',
    });
    
    // Encontrar el animal seleccionado
    let animalEncontrado: AnimalOption | null = null;
    if (tratamiento.reproductora_id) {
      animalEncontrado = animalesDisponibles.find(a => a.id === tratamiento.reproductora_id && a.tipo === 'reproductora') || null;
    } else if (tratamiento.semental_id) {
      animalEncontrado = animalesDisponibles.find(a => a.id === tratamiento.semental_id && a.tipo === 'semental') || null;
    } else if (tratamiento.lote_engorde_id) {
      animalEncontrado = animalesDisponibles.find(a => a.id === tratamiento.lote_engorde_id && a.tipo === 'lote_engorde') || null;
    }
    
    setAnimalSeleccionado(animalEncontrado);
    setEditError(null);
    setOpenEditDialog(true);
  };

  // Guardar cambios de edición
  const handleSaveEdit = async () => {
    if (!editingTratamiento || !animalSeleccionado) return;

    setEditLoading(true);
    setEditError(null);

    const datosActualizados: TratamientoVeterinarioUpdate = {
      ...editFormData,
      // Limpiar IDs anteriores
      reproductora_id: undefined,
      semental_id: undefined,
      lote_engorde_id: undefined,
      // Asignar el ID correcto según el tipo
      ...(animalSeleccionado.tipo === 'reproductora' && { reproductora_id: animalSeleccionado.id }),
      ...(animalSeleccionado.tipo === 'semental' && { semental_id: animalSeleccionado.id }),
      ...(animalSeleccionado.tipo === 'lote_engorde' && { lote_engorde_id: animalSeleccionado.id }),
    };

    try {
      await actualizarTratamiento(editingTratamiento.id, datosActualizados);
      setOpenEditDialog(false);
      setEditingTratamiento(null);
    } catch (error) {
      setEditError('Error al actualizar el tratamiento');
    } finally {
      setEditLoading(false);
    }
  };

  // Confirmar eliminación
  const handleDelete = (tratamiento: TratamientoVeterinario) => {
    setDeletingTratamiento(tratamiento);
    setOpenDeleteDialog(true);
  };

  // Ejecutar eliminación
  const handleConfirmDelete = async () => {
    if (!deletingTratamiento) return;

    try {
      await eliminarTratamiento(deletingTratamiento.id);
      setOpenDeleteDialog(false);
      setDeletingTratamiento(null);
    } catch (error) {
      console.error('Error al eliminar tratamiento:', error);
    }
  };

  // Ver detalles
  const handleView = (tratamiento: TratamientoVeterinario) => {
    setViewingTratamiento(tratamiento);
    setOpenViewDialog(true);
  };

  // Refrescar datos
  const handleRefresh = () => {
    obtenerTratamientos();
  };

  // Calcular tratamientos paginados
  const tratamientosPaginados = tratamientos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && tratamientos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando tratamientos...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con botón de actualizar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#99775C', fontWeight: 'bold' }}>
          Registros de Tratamientos Veterinarios
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            borderColor: '#99775C',
            color: '#99775C',
            '&:hover': {
              borderColor: '#7a6049',
              backgroundColor: 'rgba(153, 119, 92, 0.04)',
            },
          }}
        >
          Actualizar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Tipo de Intervención</strong></TableCell>
                <TableCell><strong>Animal</strong></TableCell>
                <TableCell><strong>Medicamento</strong></TableCell>
                <TableCell><strong>Veterinario</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tratamientosPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay tratamientos veterinarios registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tratamientosPaginados.map((tratamiento) => {
                  const animalInfo = getAnimalInfo(tratamiento);
                  return (
                    <TableRow 
                      key={tratamiento.id} 
                      hover
                      sx={{ '&:hover': { backgroundColor: 'rgba(153, 119, 92, 0.04)' } }}
                    >
                      <TableCell>
                        {new Date(tratamiento.fecha).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tratamiento.tipo_intervencion}
                          sx={{
                            backgroundColor: getTratamientoColor(tratamiento.tipo_intervencion),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {animalInfo.codigo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {animalInfo.tipo}
                            {animalInfo.raza && ` - ${animalInfo.raza}`}
                            {animalInfo.cantidad && ` - ${animalInfo.cantidad} cerdos`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {tratamiento.medicamento_producto || 'N/A'}
                        </Typography>
                        {tratamiento.dosis && (
                          <Typography variant="caption" color="text.secondary">
                            Dosis: {tratamiento.dosis}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {tratamiento.veterinario || 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(tratamiento)}
                          sx={{ color: '#99775C' }}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(tratamiento)}
                          sx={{ color: '#1976d2' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(tratamiento)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tratamientos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      {/* Diálogo de Ver Detalles */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#99775C', color: 'white' }}>
          Detalles del Tratamiento
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewingTratamiento && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Fecha:</Typography>
                <Typography>{new Date(viewingTratamiento.fecha).toLocaleDateString('es-ES')}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tipo de Intervención:</Typography>
                <Chip
                  label={viewingTratamiento.tipo_intervencion}
                  sx={{
                    backgroundColor: getTratamientoColor(viewingTratamiento.tipo_intervencion),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Animal:</Typography>
                <Typography>{getAnimalInfo(viewingTratamiento).codigo} - {getAnimalInfo(viewingTratamiento).tipo}</Typography>
              </Box>
              {viewingTratamiento.medicamento_producto && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Medicamento:</Typography>
                  <Typography>{viewingTratamiento.medicamento_producto}</Typography>
                </Box>
              )}
              {viewingTratamiento.dosis && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Dosis:</Typography>
                  <Typography>{viewingTratamiento.dosis}</Typography>
                </Box>
              )}
              {viewingTratamiento.veterinario && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Veterinario:</Typography>
                  <Typography>{viewingTratamiento.veterinario}</Typography>
                </Box>
              )}
              {viewingTratamiento.observaciones && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Observaciones:</Typography>
                  <Typography>{viewingTratamiento.observaciones}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar este tratamiento veterinario?
          </Typography>
          {deletingTratamiento && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Fecha:</strong> {new Date(deletingTratamiento.fecha).toLocaleDateString('es-ES')}<br/>
              <strong>Tipo:</strong> {deletingTratamiento.tipo_intervencion}<br/>
              <strong>Animal:</strong> {getAnimalInfo(deletingTratamiento).codigo}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Edición */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#99775C', color: 'white' }}>
          Editar Tratamiento Veterinario
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Primera fila: Fecha y Tipo */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha"
                type="date"
                value={editFormData.fecha || ''}
                onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Tipo de Intervención</InputLabel>
                <Select
                  value={editFormData.tipo_intervencion || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, tipo_intervencion: e.target.value })}
                  label="Tipo de Intervención"
                >
                  {TIPOS_TRATAMIENTO.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                  ))}
                </Select>
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
                  <TextField {...params} label="Animal" />
                )}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Veterinario"
                value={editFormData.veterinario || ''}
                onChange={(e) => setEditFormData({ ...editFormData, veterinario: e.target.value })}
                fullWidth
              />
            </Box>

            {/* Tercera fila: Medicamento y Dosis */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Medicamento/Producto"
                value={editFormData.medicamento_producto || ''}
                onChange={(e) => setEditFormData({ ...editFormData, medicamento_producto: e.target.value })}
                fullWidth
              />
              <TextField
                label="Dosis"
                value={editFormData.dosis || ''}
                onChange={(e) => setEditFormData({ ...editFormData, dosis: e.target.value })}
                fullWidth
              />
            </Box>

            {/* Observaciones */}
            <TextField
              label="Observaciones"
              value={editFormData.observaciones || ''}
              onChange={(e) => setEditFormData({ ...editFormData, observaciones: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            disabled={editLoading}
            sx={{
              backgroundColor: '#99775C',
              '&:hover': { backgroundColor: '#7a6049' }
            }}
          >
            {editLoading ? <CircularProgress size={20} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableVeterinaria;