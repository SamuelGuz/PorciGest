"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  FormLabel,
  Alert,
  CircularProgress,
  MenuItem,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Snackbar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import Link from "next/link";
import theme from "../theme/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import MuiAlert from "@mui/material/Alert";

const { main } = theme.palette.secondary;

interface FormData {
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const documentTypes = [
  { value: "Cedula", label: "Cédula de Ciudadanía" },
  { value: "Tarjeta", label: "Tarjeta de Identidad" },
  { value: "Pasaporte", label: "Pasaporte" },
];

export default function Registro() {
  const router = useRouter();
  const { signup, loading, error, isAuthenticated, clearError } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para los campos del formulario
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    tipo_documento: "",
    numero_documento: "",
    password: "",
    confirmPassword: "",
  });

  // Estados para los errores de validación
  const [errors, setErrors] = useState<FormErrors>({});

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Limpiar errores cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
      
      // Limpiar errores del backend
      if (error) {
        clearError();
      }
    };

  // Función de validación
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    if (!formData.tipo_documento) {
      newErrors.tipo_documento = "Debe seleccionar un tipo de documento";
    }

    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = "El número de documento es obligatorio";
    } else if (!/^\d+$/.test(formData.numero_documento)) {
      newErrors.numero_documento = "El número de documento solo debe contener números";
    } else if (formData.numero_documento.length < 8) {
      newErrors.numero_documento = "El número de documento debe tener al menos 8 dígitos";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    // Preparar datos para el backend (sin confirmPassword)
    const userData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipo_documento: formData.tipo_documento,
      numero_documento: formData.numero_documento,
      password: formData.password,
    };

    const result = await signup(userData);

    if (result.success) {
      setSuccessMessage("¡Usuario registrado exitosamente! Redirigiendo al login...");
      setOpenSnackbar(true);
      
      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        tipo_documento: "",
        numero_documento: "",
        password: "",
        confirmPassword: "",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="max-w-5xl m-auto">
      <header className="mt-10">
        <div className="logo flex gap-2 items-center">
          <PersonIcon sx={{ fontSize: 40, color: main }} />
          <div>
            <h1 className="text-3xl font-bold text-[#99775C]">PorciGest</h1>
            <p className="text-gray-600">Sistema de Gestión Porcina</p>
          </div>
        </div>
      </header>

      <main className="mt-8 bg-stone-100 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#99775C] mb-2">
            Crear Nueva Cuenta
          </h2>
          <p className="text-gray-600">
            Completa el formulario para registrarte en PorciGest
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Mostrar errores del backend */}
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {/* Fila 1: Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
                Nombre *
              </FormLabel>
              <TextField
                fullWidth
                value={formData.nombre}
                onChange={handleInputChange("nombre")}
                error={!!errors.nombre}
                helperText={errors.nombre}
                placeholder="Ingrese su nombre"
                disabled={loading}
              />
            </div>
            <div>
              <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
                Apellido *
              </FormLabel>
              <TextField
                fullWidth
                value={formData.apellido}
                onChange={handleInputChange("apellido")}
                error={!!errors.apellido}
                helperText={errors.apellido}
                placeholder="Ingrese su apellido"
                disabled={loading}
              />
            </div>
          </div>

          {/* Fila 2: Tipo y Número de Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
                Tipo de Documento *
              </FormLabel>
              <TextField
                fullWidth
                select
                value={formData.tipo_documento}
                onChange={handleInputChange("tipo_documento")}
                error={!!errors.tipo_documento}
                helperText={errors.tipo_documento}
                disabled={loading}
              >
                {documentTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
                Número de Documento *
              </FormLabel>
              <TextField
                fullWidth
                value={formData.numero_documento}
                onChange={handleInputChange("numero_documento")}
                error={!!errors.numero_documento}
                helperText={errors.numero_documento}
                placeholder="Ingrese su número de documento"
                disabled={loading}
              />
            </div>
          </div>

          {/* Fila 3: Contraseñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
                Contraseña *
              </FormLabel>
              <OutlinedInput
                fullWidth
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                error={!!errors.password}
                placeholder="Ingrese su contraseña"
                disabled={loading}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
                Confirmar Contraseña *
              </FormLabel>
              <OutlinedInput
                fullWidth
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                error={!!errors.confirmPassword}
                placeholder="Confirme su contraseña"
                disabled={loading}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirm}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Botón de Registro */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
            sx={{
              backgroundColor: main,
              color: "white",
              "&:hover": { backgroundColor: "#7a6049" },
              padding: "14px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </Button>

          {/* Link al Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link 
                href="/login" 
                className="text-[#99775C] hover:underline font-medium flex items-center justify-center gap-1 mt-2"
              >
                <LoginIcon fontSize="small" />
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </form>
      </main>

      {/* Snackbar para éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={handleCloseSnackbar} 
          severity="success"
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}