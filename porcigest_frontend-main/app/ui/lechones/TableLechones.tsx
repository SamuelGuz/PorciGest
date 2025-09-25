'use client';

import React, { useState } from 'react';
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
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useLechones, Camada, CamadaUpdate } from '../../../src/hooks/useLechones';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { useSementales } from '../../../src/hooks/useSementales';

interface TableLechonesProps {
  refreshKey?: number;
}

const TableLechones: React.FC<TableLechonesProps> = ({ refreshKey }) => {
  const { camadas, loading, error, actualizarCamada, eliminarCamada } = useLechones();
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();
  
  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para el diálogo de edición
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingCamada, setEditingCamada] = useState<Camada | null>(null);
  const [editFormData, setEditFormData] = useState<CamadaUpdate>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingCamada, setDeletingCamada] = useState<Camada | null>(null);

  // Estados para el diálogo de detalles
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingCamada, setViewingCamada] = useState<Camada | null>(null);

  // Manejar cambios de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para abrir el diálogo de edición
  const handleEdit = (camada: Camada) => {
    setEditingCamada(camada);
    setEditFormData({
      fecha_nacimiento: camada.fecha_nacimiento.split('T')[0], // Solo la fecha
      numero_lechones: camada.numero_lechones,
      peso_promedio_kg: camada.peso_promedio_kg || 0,
      madre_id: camada.madre.id,
      padre_id: camada.padre.id,
    });
    setEditError(null);
    setOpenEditDialog(true);
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (field: keyof CamadaUpdate, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para guardar cambios
  const handleSaveEdit = async () => {
    if (!editingCamada) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const success = await actualizarCamada(editingCamada.id, editFormData);
      
      if (success) {
        setOpenEditDialog(false);
        setEditingCamada(null);
        setEditFormData({});
      }
    } catch (error) {
      console.error('Error al actualizar camada:', error);
    } finally {
      setEditLoading(false);
    }
  };

  // Función para cerrar el diálogo de edición
  const handleCloseEdit = () => {
    if (!editLoading) {
      setOpenEditDialog(false);
      setEditingCamada(null);
      setEditFormData({});
      setEditError(null);
    }
  };

  // Función para abrir el diálogo de confirmación de eliminación
  const handleDeleteClick = (camada: Camada) => {
    setDeletingCamada(camada);
    setOpenDeleteDialog(true);
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!deletingCamada) return;

    try {
      const success = await eliminarCamada(deletingCamada.id);
      
      if (success) {
        setOpenDeleteDialog(false);
        setDeletingCamada(null);
      }
    } catch (error) {
      console.error('Error al eliminar camada:', error);
    }
  };

  // Función para cancelar eliminación
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setDeletingCamada(null);
  };

  // Función para ver detalles
  const handleView = (camada: Camada) => {
    setViewingCamada(camada);
    setOpenViewDialog(true);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Función para calcular la edad en días
  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para obtener color del chip según la edad
  const getAgeChipColor = (days: number) => {
    if (days <= 7) return 'error'; // Recién nacidos
    if (days <= 21) return 'warning'; // Lactancia
    if (days <= 56) return 'info'; // Destete
    return 'success'; // Más grandes
  };

  // Datos paginados
  const paginatedCamadas = camadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Fecha Nacimiento</strong></TableCell>
              <TableCell><strong>Número de Lechones</strong></TableCell>
              <TableCell><strong>Peso Promedio</strong></TableCell>
              <TableCell><strong>Madre</strong></TableCell>
              <TableCell><strong>Padre</strong></TableCell>
              <TableCell><strong>Edad (días)</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCamadas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay camadas registradas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCamadas.map((camada) => {
                const edad = calculateAge(camada.fecha_nacimiento);
                return (
                  <TableRow key={camada.id} hover>
                    <TableCell>{formatDate(camada.fecha_nacimiento)}</TableCell>
                    <TableCell>{camada.numero_lechones}</TableCell>
                    <TableCell>
                      {camada.peso_promedio_kg ? `${camada.peso_promedio_kg} kg` : 'No registrado'}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {camada.madre.codigo_id}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {camada.madre.nombre && `${camada.madre.nombre} - `}{camada.madre.raza}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {camada.padre.nombre}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {camada.padre.raza}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${edad} días`}
                        color={getAgeChipColor(edad)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => handleView(camada)}
                        title="Ver detalles"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(camada)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(camada)}
                        title="Eliminar"
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

        <TablePagination
          component="div"
          count={camadas.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>

      {/* Diálogo de edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Camada</DialogTitle>
        <DialogContent>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          
          <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              value={editFormData.fecha_nacimiento || ''}
              onChange={(e) => handleEditFormChange('fecha_nacimiento', e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={editLoading}
            />

            <TextField
              fullWidth
              label="Número de Lechones"
              type="number"
              value={editFormData.numero_lechones || ''}
              onChange={(e) => handleEditFormChange('numero_lechones', parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              disabled={editLoading}
            />

            <TextField
              fullWidth
              label="Peso Promedio (kg)"
              type="number"
              value={editFormData.peso_promedio_kg || ''}
              onChange={(e) => handleEditFormChange('peso_promedio_kg', parseFloat(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              disabled={editLoading}
            />

            <FormControl fullWidth disabled={editLoading}>
              <InputLabel>Madre</InputLabel>
              <Select
                value={editFormData.madre_id || ''}
                onChange={(e) => handleEditFormChange('madre_id', e.target.value)}
                label="Madre"
              >
                {reproductoras.map((reproductora) => (
                  <MenuItem key={reproductora.id} value={reproductora.id}>
                    {reproductora.codigo_id} ({reproductora.raza})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={editLoading}>
              <InputLabel>Padre</InputLabel>
              <Select
                value={editFormData.padre_id || ''}
                onChange={(e) => handleEditFormChange('padre_id', e.target.value)}
                label="Padre"
              >
                {sementales.map((semental) => (
                  <MenuItem key={semental.id} value={semental.id}>
                    {semental.nombre} ({semental.raza})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseEdit} 
            disabled={editLoading}
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
            onClick={handleSaveEdit}
            variant="contained"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={16} /> : null}
            sx={{
              backgroundColor: "#99775C",
              '&:hover': {
                backgroundColor: '#7a6049',
              },
            }}
          >
            {editLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar esta camada?
          </Typography>
          {deletingCamada && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Fecha:</strong> {formatDate(deletingCamada.fecha_nacimiento)}<br />
                <strong>Lechones:</strong> {deletingCamada.numero_lechones}<br />
                <strong>Madre:</strong> {deletingCamada.madre.codigo_id}<br />
                <strong>Padre:</strong> {deletingCamada.padre.nombre}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete}
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
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de detalles */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de la Camada</DialogTitle>
        <DialogContent>
          {viewingCamada && (
            <Box sx={{ '& > :not(style)': { mb: 2 } }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Fecha de Nacimiento</Typography>
                <Typography variant="body1">{formatDate(viewingCamada.fecha_nacimiento)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Edad</Typography>
                <Chip
                  label={`${calculateAge(viewingCamada.fecha_nacimiento)} días`}
                  color={getAgeChipColor(calculateAge(viewingCamada.fecha_nacimiento))}
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Número de Lechones</Typography>
                <Typography variant="body1">{viewingCamada.numero_lechones}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Peso Promedio</Typography>
                <Typography variant="body1">
                  {viewingCamada.peso_promedio_kg ? `${viewingCamada.peso_promedio_kg} kg` : 'No registrado'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Madre</Typography>
                <Typography variant="body1">
                  {viewingCamada.madre.codigo_id} - {viewingCamada.madre.nombre} ({viewingCamada.madre.raza})
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Padre</Typography>
                <Typography variant="body1">
                  {viewingCamada.padre.nombre} ({viewingCamada.padre.raza})
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Propietario</Typography>
                <Typography variant="body1">
                  {viewingCamada.propietario.nombre} {viewingCamada.propietario.apellido}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {viewingCamada.propietario.tipo_documento}: {viewingCamada.propietario.numero_documento}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenViewDialog(false)}
            sx={{
              backgroundColor: "#99775C",
              color: 'white',
              '&:hover': {
                backgroundColor: '#7a6049',
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableLechones;