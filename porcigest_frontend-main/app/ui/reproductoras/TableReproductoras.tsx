'use client';

import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  TableContainer,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

import {
  DeleteRounded,
  CreateRounded,
  VisibilityRounded,
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material';
import { CerdaReproductora } from '../../../lib/definitions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#99775C',
    color: theme.palette.common.white,
    fontWeight: '900',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: '600',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

interface TableReproductorasProps {
  reproductoras: CerdaReproductora[];
  loading: boolean;
  onEdit: (reproductora: CerdaReproductora) => void;
  onDelete: (id: number) => Promise<void>;
  onView: (reproductora: CerdaReproductora) => void;
}

// Función para obtener el color del chip según el estado
const getEstadoColor = (estado: string): "success" | "warning" | "error" | "info" | "default" => {
  switch (estado.toLowerCase()) {
    case 'gestante':
      return 'success';
    case 'lactando':
      return 'info';
    case 'vacía':
      return 'warning';
    case 'descarte':
      return 'error';
    default:
      return 'default';
  }
};

// Función para calcular la edad
const calcularEdad = (fechaNacimiento: string): number => {
  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();
  const diffTime = Math.abs(hoy.getTime() - fechaNac.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365); // Edad en años
};

// Función para formatear fecha
const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function TableReproductoras({ 
  reproductoras, 
  loading, 
  onEdit, 
  onDelete, 
  onView 
}: TableReproductorasProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reproductora: CerdaReproductora | null;
  }>({ open: false, reproductora: null });
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (reproductora: CerdaReproductora) => {
    setDeleteDialog({ open: true, reproductora });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.reproductora) return;
    
    setDeleting(true);
    try {
      await onDelete(deleteDialog.reproductora.id);
      setDeleteDialog({ open: false, reproductora: null });
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, reproductora: null });
  };

  if (loading && reproductoras.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando reproductoras...
        </Typography>
      </Box>
    );
  }

  if (!loading && reproductoras.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No hay reproductoras registradas
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Agrega tu primera reproductora usando el botón "Nueva Cerda"
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Código ID</StyledTableCell>
              <StyledTableCell>Edad</StyledTableCell>
              <StyledTableCell>Raza</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell>Fecha Nacimiento</StyledTableCell>
              <StyledTableCell>Propietario</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reproductoras.map((reproductora) => (
              <StyledTableRow key={reproductora.id}>
                <StyledTableCell component="th" scope="row">
                  <Typography variant="body1" fontWeight="bold">
                    {reproductora.codigo_id}
                  </Typography>
                </StyledTableCell>
                
                <StyledTableCell>
                  <Typography variant="body2">
                    {calcularEdad(reproductora.fecha_nacimiento)} años
                  </Typography>
                </StyledTableCell>
                
                <StyledTableCell>
                  <Typography variant="body2">
                    {reproductora.raza}
                  </Typography>
                </StyledTableCell>
                
                <StyledTableCell>
                  <Chip
                    label={reproductora.estado_reproductivo}
                    color={getEstadoColor(reproductora.estado_reproductivo)}
                    size="small"
                    variant="filled"
                  />
                </StyledTableCell>
                
                <StyledTableCell>
                  <Typography variant="body2">
                    {formatearFecha(reproductora.fecha_nacimiento)}
                  </Typography>
                </StyledTableCell>
                
                <StyledTableCell>
                  <Typography variant="body2">
                    {reproductora.propietario 
                      ? `${reproductora.propietario.nombre} ${reproductora.propietario.apellido}`
                      : 'N/A'
                    }
                  </Typography>
                </StyledTableCell>
                
                <StyledTableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        color="info"
                        onClick={() => onView(reproductora)}
                        size="small"
                      >
                        <VisibilityRounded />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(reproductora)}
                        size="small"
                      >
                        <CreateRounded />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(reproductora)}
                        size="small"
                      >
                        <DeleteRounded />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que deseas eliminar la reproductora con código{' '}
            <strong>{deleteDialog.reproductora?.codigo_id}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            disabled={deleting}
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
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}