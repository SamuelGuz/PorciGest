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

  // Estados para los errores de validación
  const [errors, setErrors] = useState<FormErrors>({});

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  // Función de validación
  const validateForm = () => {
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

    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = "Debe seleccionar un tipo de documento";
    }

    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = "El número de documento es obligatorio";
    } else if (!/^\d+$/.test(formData.numeroDocumento)) {
      newErrors.numeroDocumento =
        "El número de documento solo debe contener números";
    } else if (formData.numeroDocumento.length < 6) {
      newErrors.numeroDocumento =
        "El número de documento debe tener al menos 6 dígitos";
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Datos del formulario:", formData);
      setOpenSnackbar(true);

      setFormData({
        nombre: "",
        apellido: "",
        tipoDocumento: "",
        numeroDocumento: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="max-w-5xl m-auto ">
      <header className="mt-10  ">
        <div className="logo flex gap-2 items-center">
          <img src="/logo.jpg" alt="logo de porciGest" className="bg-primary w-20 h-20 rounded-full"/>
          <h3 className="text-2xl">Porcigest</h3>
        </div>
      </header>
      <main>
        <div className="bg-accent text-center p-4 mt-4 rounded flex flex-col items-center">
          <h1 className="text-xl font-semibold text-[#000000]">
            Registrar Usuario
          </h1>
           <PersonIcon sx={{ fontSize: 80 }} className="text-[#000000] mt-2"/>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg mt-6 p-8"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <FormLabel sx={{ fontWeight: 600, color:"#black" }}>
                Nombre
              </FormLabel>
                <TextField
                  label=""
                  variant="outlined"
                  fullWidth
                  value={formData.nombre}
                  onChange={handleInputChange("nombre")}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
            </div>

            <div className="flex flex-col gap-1">
              <FormLabel sx={{ fontWeight: 600, color:"#black" }}>
                Apellido
              </FormLabel>
            <TextField
              label=""
              variant="outlined"
              fullWidth
              value={formData.apellido}
              onChange={handleInputChange("apellido")}
              error={!!errors.apellido}
              helperText={errors.apellido}
            />
            </div>
            <TextField
              select 
              label="Tipo de documento"
              variant="outlined"
              fullWidth
              value={formData.tipoDocumento}
              onChange={handleInputChange("tipoDocumento")}
              error={!!errors.tipoDocumento}
              helperText={errors.tipoDocumento}
            >
              {documentTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Número de documento"
              variant="outlined"
              fullWidth
              value={formData.numeroDocumento}
              onChange={handleInputChange("numeroDocumento")}
              error={!!errors.numeroDocumento}
              helperText={errors.numeroDocumento}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar contraseña"
              type={showConfirm ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirm} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-accent text-[#000000] px-6 py-2 rounded-lg hover:bg-primary"
            >
              <Link href="/"> Registrar <PersonAddIcon/></Link>
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">¿Ya tienes cuenta?</span>
            <button
              type="button"
              className="bg-accent text-black px-4 py-1 rounded-lg hover:bg-primary transition">
              <Link href="/login"> Iniciar Sesión <LoginIcon/> </Link>
            </button>
          </div>
        </form>
      </main>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Usuario registrado exitosamente!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
