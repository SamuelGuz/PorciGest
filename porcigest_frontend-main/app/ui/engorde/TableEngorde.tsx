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
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useEngorde, LoteEngorde, LoteEngordeUpdate } from '../../../src/hooks/useEngorde';
import { useLechones } from '../../../src/hooks/useLechones';

const TableEngorde: React.FC = () => {
  const { lotes, loading, error, actualizarLote, eliminarLote } = useEngorde();
  const { camadas } = useLechones();
  
  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para el diálogo de edición
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingLote, setEditingLote] = useState<LoteEngorde | null>(null);
  const [editFormData, setEditFormData] = useState<LoteEngordeUpdate>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingLote, setDeletingLote] = useState<LoteEngorde | null>(null);

  // Estados para el diálogo de detalles
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingLote, setViewingLote] = useState<LoteEngorde | null>(null);

  // Manejar cambios de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para abrir el diálogo de edición
  const handleEdit = (lote: LoteEngorde) => {
    setEditingLote(lote);
    setEditFormData({
      lote_id_str: lote.lote_id_str,
      fecha_inicio: lote.fecha_inicio.split('T')[0], // Solo la fecha
      numero_cerdos: lote.numero_cerdos,
      peso_inicial_promedio: lote.peso_inicial_promedio || 0,
      peso_actual_promedio: lote.peso_actual_promedio || 0,
      camada_origen_id: lote.camada_origen.id,
    });
    setEditError(null);
    setOpenEditDialog(true);
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (field: keyof LoteEngordeUpdate, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para guardar cambios
  const handleSaveEdit = async () => {
    if (!editingLote) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const success = await actualizarLote(editingLote.id, editFormData);
      
      if (success) {
        setOpenEditDialog(false);
        setEditingLote(null);
        setEditFormData({});
      }
    } catch (error) {
      console.error('Error al actualizar lote:', error);
    } finally {
      setEditLoading(false);
    }
  };

  // Función para cerrar el diálogo de edición
  const handleCloseEdit = () => {
    if (!editLoading) {
      setOpenEditDialog(false);
      setEditingLote(null);
      setEditFormData({});
      setEditError(null);
    }
  };

  // Función para abrir el diálogo de confirmación de eliminación
  const handleDeleteClick = (lote: LoteEngorde) => {
    setDeletingLote(lote);
    setOpenDeleteDialog(true);
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!deletingLote) return;

    try {
      const success = await eliminarLote(deletingLote.id);
      
      if (success) {
        setOpenDeleteDialog(false);
        setDeletingLote(null);
      }
    } catch (error) {
      console.error('Error al eliminar lote:', error);
    }
  };

  // Función para cancelar eliminación
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setDeletingLote(null);
  };

  // Función para ver detalles
  const handleView = (lote: LoteEngorde) => {
    setViewingLote(lote);
    setOpenViewDialog(true);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Función para calcular días en engorde
  const calculateDaysInEngorde = (fechaInicio: string) => {
    const startDate = new Date(fechaInicio);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para obtener color del chip según días en engorde
  const getEngordeChipColor = (days: number) => {
    if (days <= 30) return 'info'; // Nuevo
    if (days <= 90) return 'warning'; // En proceso
    if (days <= 180) return 'success'; // Avanzado
    return 'default'; // Muy largo
  };

  // Función para calcular ganancia de peso
  const calculateGananciaPeso = (lote: LoteEngorde) => {
    if (lote.peso_actual_promedio && lote.peso_inicial_promedio) {
      return (lote.peso_actual_promedio - lote.peso_inicial_promedio).toFixed(2);
    }
    return 'N/A';
  };

  // Datos paginados
  const paginatedLotes = lotes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              <TableCell><strong>ID Lote</strong></TableCell>
              <TableCell><strong>Fecha Inicio</strong></TableCell>
              <TableCell><strong>Nº Cerdos</strong></TableCell>
              <TableCell><strong>Peso Inicial</strong></TableCell>
              <TableCell><strong>Peso Actual</strong></TableCell>
              <TableCell><strong>Ganancia</strong></TableCell>
              <TableCell><strong>Días Engorde</strong></TableCell>
              <TableCell><strong>Camada Origen</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay lotes de engorde registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLotes.map((lote) => {
                const diasEngorde = calculateDaysInEngorde(lote.fecha_inicio);
                const gananciaPeso = calculateGananciaPeso(lote);
                return (
                  <TableRow key={lote.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {lote.lote_id_str}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(lote.fecha_inicio)}</TableCell>
                    <TableCell>{lote.numero_cerdos}</TableCell>
                    <TableCell>
                      {lote.peso_inicial_promedio ? `${lote.peso_inicial_promedio} kg` : 'No registrado'}
                    </TableCell>
                    <TableCell>
                      {lote.peso_actual_promedio ? `${lote.peso_actual_promedio} kg` : 'No registrado'}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {gananciaPeso !== 'N/A' && (
                          <TrendingIcon 
                            fontSize="small" 
                            color={parseFloat(gananciaPeso) > 0 ? 'success' : 'error'} 
                          />
                        )}
                        <Typography 
                          variant="body2" 
                          color={gananciaPeso !== 'N/A' && parseFloat(gananciaPeso) > 0 ? 'success.main' : 'text.secondary'}
                        >
                          {gananciaPeso !== 'N/A' ? `${gananciaPeso} kg` : gananciaPeso}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${diasEngorde} días`}
                        color={getEngordeChipColor(diasEngorde)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Camada #{lote.camada_origen.id}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(lote.camada_origen.fecha_nacimiento)} - Madre: {lote.camada_origen.madre.codigo_id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => handleView(lote)}
                        title="Ver detalles"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(lote)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(lote)}
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
          count={lotes.length}
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
      <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle>Editar Lote de Engorde</DialogTitle>
        <DialogContent>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          
          <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField
              fullWidth
              label="ID del Lote"
              value={editFormData.lote_id_str || ''}
              onChange={(e) => handleEditFormChange('lote_id_str', e.target.value)}
              disabled={editLoading}
            />

            <TextField
              fullWidth
              label="Fecha de Inicio"
              type="date"
              value={editFormData.fecha_inicio || ''}
              onChange={(e) => handleEditFormChange('fecha_inicio', e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={editLoading}
            />

            <TextField
              fullWidth
              label="Número de Cerdos"
              type="number"
              value={editFormData.numero_cerdos || ''}
              onChange={(e) => handleEditFormChange('numero_cerdos', parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              disabled={editLoading}
            />

            <TextField
              fullWidth
              label="Peso Inicial Promedio (kg)"
              type="number"
              value={editFormData.peso_inicial_promedio || ''}
              onChange={(e) => handleEditFormChange('peso_inicial_promedio', parseFloat(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              disabled={editLoading}
            />

            <TextField
              fullWidth
              label="Peso Actual Promedio (kg)"
              type="number"
              value={editFormData.peso_actual_promedio || ''}
              onChange={(e) => handleEditFormChange('peso_actual_promedio', parseFloat(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              disabled={editLoading}
            />

            <FormControl fullWidth disabled={editLoading}>
              <InputLabel>Camada de Origen</InputLabel>
              <Select
                value={editFormData.camada_origen_id || ''}
                onChange={(e) => handleEditFormChange('camada_origen_id', e.target.value)}
                label="Camada de Origen"
              >
                {camadas.map((camada) => (
                  <MenuItem key={camada.id} value={camada.id}>
                    Camada #{camada.id} - {formatDate(camada.fecha_nacimiento)} 
                    ({camada.numero_lechones} lechones - Madre: {camada.madre.codigo_id})
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
            ¿Está seguro de que desea eliminar este lote de engorde?
          </Typography>
          {deletingLote && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>ID Lote:</strong> {deletingLote.lote_id_str}<br />
                <strong>Fecha Inicio:</strong> {formatDate(deletingLote.fecha_inicio)}<br />
                <strong>Número de Cerdos:</strong> {deletingLote.numero_cerdos}<br />
                <strong>Camada Origen:</strong> #{deletingLote.camada_origen.id}
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
        <DialogTitle>Detalles del Lote de Engorde</DialogTitle>
        <DialogContent>
          {viewingLote && (
            <Box sx={{ '& > :not(style)': { mb: 2 } }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">ID del Lote</Typography>
                <Typography variant="body1" fontWeight="bold">{viewingLote.lote_id_str}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Fecha de Inicio</Typography>
                <Typography variant="body1">{formatDate(viewingLote.fecha_inicio)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Días en Engorde</Typography>
                <Chip
                  label={`${calculateDaysInEngorde(viewingLote.fecha_inicio)} días`}
                  color={getEngordeChipColor(calculateDaysInEngorde(viewingLote.fecha_inicio))}
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Número de Cerdos</Typography>
                <Typography variant="body1">{viewingLote.numero_cerdos}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Peso Inicial Promedio</Typography>
                <Typography variant="body1">
                  {viewingLote.peso_inicial_promedio ? `${viewingLote.peso_inicial_promedio} kg` : 'No registrado'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Peso Actual Promedio</Typography>
                <Typography variant="body1">
                  {viewingLote.peso_actual_promedio ? `${viewingLote.peso_actual_promedio} kg` : 'No registrado'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Ganancia de Peso</Typography>
                <Typography variant="body1" color={calculateGananciaPeso(viewingLote) !== 'N/A' ? 'success.main' : 'text.secondary'}>
                  {calculateGananciaPeso(viewingLote) !== 'N/A' ? `${calculateGananciaPeso(viewingLote)} kg` : 'No calculable'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Camada de Origen</Typography>
                <Typography variant="body1">
                  Camada #{viewingLote.camada_origen.id} - {formatDate(viewingLote.camada_origen.fecha_nacimiento)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {viewingLote.camada_origen.numero_lechones} lechones - Madre: {viewingLote.camada_origen.madre.codigo_id} ({viewingLote.camada_origen.madre.raza})
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">Propietario</Typography>
                <Typography variant="body1">
                  {viewingLote.propietario.nombre} {viewingLote.propietario.apellido}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {viewingLote.propietario.tipo_documento}: {viewingLote.propietario.numero_documento}
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

export default TableEngorde;