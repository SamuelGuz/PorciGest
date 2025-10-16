"use client"

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
  Alert,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  DeleteRounded,
  CreateRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material";
import { useState } from "react";
import { useSementales, type Semental } from "../../../src/hooks/useSementales";
import DetallesSemental from "./DetallesSemental";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.background.default,
    fontWeight: "900",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: "900",
  },
}));

const columns = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Nombre" },
  { key: "raza", label: "Raza" },
  { key: "tasa_fertilidad", label: "Tasa Fertilidad %" },
  { key: "propietario", label: "Propietario" },
  { key: "acciones", label: "Acciones" },
];

const TableSementales = () => {
  const { 
    sementales, 
    loading, 
    error, 
    eliminarSemental,
    actualizarSemental, 
    clearError 
  } = useSementales();
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    semental: Semental | null;
  }>({
    open: false,
    semental: null
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    semental: Semental | null;
  }>({
    open: false,
    semental: null
  });

  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    semental: Semental | null;
  }>({
    open: false,
    semental: null
  });

  const [editFormData, setEditFormData] = useState<{
    nombre: string;
    raza: string;
    tasa_fertilidad: number;
  }>({
    nombre: "",
    raza: "",
    tasa_fertilidad: 0
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Razas comunes
  const razasComunes = [
    "Yorkshire", "Landrace", "Duroc", "Hampshire", "Pietrain", "Large White", "Cruce", "Otra"
  ];

  const handleDeleteClick = (semental: Semental) => {
    setDeleteDialog({ open: true, semental });
  };

  const handleEditClick = (semental: Semental) => {
    setEditFormData({
      nombre: semental.nombre,
      raza: semental.raza,
      tasa_fertilidad: semental.tasa_fertilidad || 0
    });
    setEditDialog({ open: true, semental });
    setFormErrors({});
  };

  const handleViewClick = (semental: Semental) => {
    setViewDialog({ open: true, semental });
  };

  const handleViewClose = () => {
    setViewDialog({ open: false, semental: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.semental) {
      const success = await eliminarSemental(deleteDialog.semental.id);
      if (success) {
        setDeleteDialog({ open: false, semental: null });
      }
      // Siempre cerramos el diálogo, incluso si hay error
      setDeleteDialog({ open: false, semental: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, semental: null });
    clearError();
  };

  const handleEditCancel = () => {
    setEditDialog({ open: false, semental: null });
    setFormErrors({});
    clearError();
  };

  const validateEditForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!editFormData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (editFormData.nombre.length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!editFormData.raza.trim()) {
      errors.raza = "La raza es obligatoria";
    }

    if (editFormData.tasa_fertilidad < 0 || editFormData.tasa_fertilidad > 100) {
      errors.tasa_fertilidad = "La tasa de fertilidad debe estar entre 0 y 100";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditConfirm = async () => {
    if (!editDialog.semental || !validateEditForm()) {
      return;
    }

    const success = await actualizarSemental(editDialog.semental.id, editFormData);
    if (success) {
      setEditDialog({ open: false, semental: null });
      setFormErrors({});
    }
  };

  const handleEditInputChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (loading) {
    return (
      <section className="shadow-lg mt-3 py-3 px-4 rounded-sm">
        <h3 className="text-bold">Registro de sementales</h3>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </section>
    );
  }

  return (
    <>
      <section className="shadow-lg mt-3 py-3 px-4 rounded-sm">
        <h3 className="text-bold">Registro de sementales</h3>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de sementales">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <StyledTableCell align="left" key={col.key}>
                    {col.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sementales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No hay sementales registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sementales.map((semental) => (
                  <TableRow
                    key={semental.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {semental.id}
                    </StyledTableCell>
                    <TableCell align="left">{semental.nombre}</TableCell>
                    <TableCell align="left">{semental.raza}</TableCell>
                    <TableCell align="left">
                      <Chip 
                        label={`${semental.tasa_fertilidad}%`}
                        color={semental.tasa_fertilidad >= 80 ? "success" : "warning"}
                      />
                    </TableCell>
                    <TableCell align="left">
                      {semental.propietario.nombre} {semental.propietario.apellido}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton 
                          color="success"
                          onClick={() => handleEditClick(semental)}
                        >
                          <CreateRounded />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Detalles">
                        <IconButton 
                          color="info"
                          onClick={() => handleViewClick(semental)}
                        >
                          <VisibilityRounded />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteClick(semental)}
                        >
                          <DeleteRounded />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar al semental{" "}
            <strong>{deleteDialog.semental?.nombre}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de edición */}
      <Dialog open={editDialog.open} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Semental</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={editFormData.nombre}
              onChange={(e) => handleEditInputChange('nombre', e.target.value)}
              error={!!formErrors.nombre}
              helperText={formErrors.nombre}
              disabled={loading}
            />
            
            <FormControl fullWidth error={!!formErrors.raza}>
              <InputLabel>Raza</InputLabel>
              <Select
                value={editFormData.raza}
                label="Raza"
                onChange={(e) => handleEditInputChange('raza', e.target.value)}
                disabled={loading}
              >
                {razasComunes.map((raza) => (
                  <MenuItem key={raza} value={raza}>
                    {raza}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.raza && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {formErrors.raza}
                </Typography>
              )}
            </FormControl>
            
            <TextField
              label="Tasa de Fertilidad (%)"
              type="number"
              fullWidth
              value={editFormData.tasa_fertilidad}
              onChange={(e) => handleEditInputChange('tasa_fertilidad', parseFloat(e.target.value) || 0)}
              error={!!formErrors.tasa_fertilidad}
              helperText={formErrors.tasa_fertilidad || "Valor entre 0 y 100"}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleEditCancel} 
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
            onClick={handleEditConfirm} 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#99775C",
              '&:hover': {
                backgroundColor: '#7a6049',
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles del semental */}
      <DetallesSemental
        open={viewDialog.open}
        semental={viewDialog.semental}
        onClose={handleViewClose}
      />
    </>
  );
};

export default TableSementales;
