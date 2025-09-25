"use client"

import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";
import { useSementales, type SementalCreate } from "../../../src/hooks/useSementales";

const RegistroNuevoSemental = ({
  setShowForm,
  onSementalCreated, // Nueva prop
}: {
  setShowForm: (value: boolean) => void;
  onSementalCreated?: () => void; // Callback para refrescar datos
}) => {
  const { crearSemental, loading, error, clearError } = useSementales();
  
  // Estados para capturar los valores de los inputs
  const [formData, setFormData] = useState<SementalCreate>({
    nombre: "",
    raza: "",
    tasa_fertilidad: 0,
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Razas comunes de cerdos
  const razasComunes = [
    "Yorkshire",
    "Landrace", 
    "Duroc",
    "Hampshire",
    "Pietrain",
    "Large White",
    "Cruce",
    "Otra"
  ];

  const handleInputChange = (field: keyof SementalCreate, value: any) => {
    setFormData(prev => ({
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

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.raza.trim()) {
      errors.raza = "La raza es obligatoria";
    }

    if ((formData.tasa_fertilidad || 0) < 0 || (formData.tasa_fertilidad || 0) > 100) {
      errors.tasa_fertilidad = "La tasa de fertilidad debe estar entre 0 y 100";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const success = await crearSemental(formData);
    
    if (success) {
      // Cerrar el formulario
      setShowForm(false);
      
      // Llamar al callback para refrescar los datos
      if (onSementalCreated) {
        onSementalCreated();
      }
      
      // Opcional: Mostrar mensaje de éxito (podrías usar un toast/snackbar)
      console.log("Semental creado exitosamente");
    }
  };

  const handleCancel = () => {
    clearError();
    setShowForm(false);
  };

  return (
    <section
      id="form-semental"
      className="py-6 px-4 rounded-sm shadow-lg gap-2 flex flex-col"
    >
      <h2 id="title">Registro nuevo semental</h2>
      
      {error && (
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div id="fields" className="flex flex-col gap-2 md:flex-row flex-wrap items-stretch">
          <TextField 
            label="Nombre" 
            sx={{minWidth: "220px", flex: 1}}
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            error={!!formErrors.nombre}
            helperText={formErrors.nombre}
            required
            disabled={loading}
          />
          
          <FormControl sx={{minWidth: "220px", flex: 1}} error={!!formErrors.raza}>
            <InputLabel>Raza</InputLabel>
            <Select
              value={formData.raza}
              label="Raza"
              onChange={(e) => handleInputChange('raza', e.target.value)}
              required
              disabled={loading}
            >
              {razasComunes.map((raza) => (
                <MenuItem key={raza} value={raza}>
                  {raza}
                </MenuItem>
              ))}
            </Select>
            {formErrors.raza && (
              <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginLeft: '14px' }}>
                {formErrors.raza}
              </span>
            )}
          </FormControl>
          
          <TextField 
            label="Tasa de Fertilidad (%)" 
            sx={{minWidth: "220px", flex: 1}}
            type="number"
            value={formData.tasa_fertilidad}
            onChange={(e) => handleInputChange('tasa_fertilidad', parseFloat(e.target.value) || 0)}
            error={!!formErrors.tasa_fertilidad}
            helperText={formErrors.tasa_fertilidad || "Valor entre 0 y 100"}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            disabled={loading}
          />
        </div>
        
        <div id="actions" className="flex mt-3 gap-3">
          <Button 
            type="submit"
            variant="contained"  
            sx={{ 
              alignSelf: "start", 
              backgroundColor: "#99775C",
              '&:hover': {
                backgroundColor: '#7a6049',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Guardar"}
          </Button>

          <Button 
            onClick={handleCancel} 
            sx={{ 
              color: "#99775C",
              '&:hover': {
                backgroundColor: '#F5F5F5',
              }
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RegistroNuevoSemental;
