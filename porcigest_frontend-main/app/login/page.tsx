"use client";
import {
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  FormLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import theme from "@/theme/theme";
import Link from "next/link";
import { useAuth } from "../../src/contexts/AuthContext";

const { main } = theme.palette.secondary;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorDocument, setErrorDocument] = useState(false);

  // Usar el contexto de autenticación
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setErrorDocument(false);
    setErrorPassword(false);
    clearError();

    // Validación básica
    if (!documento && !password) {
      setErrorDocument(true);
      setErrorPassword(true);
      return;
    }
    
    if (!documento) {
      setErrorDocument(true);
      return;
    }
    
    if (!password) {
      setErrorPassword(true);
      return;
    }

    // Validación del formato de documento
    const regexDoc = /^\d{8,12}$/; // Permitir entre 8 y 12 dígitos
    if (!regexDoc.test(documento)) {
      setErrorDocument(true);
      return;
    }

    // Intentar login
    const result = await login(documento, password);
    
    if (result.success) {
      router.push('/dashboard');
    }
    // Los errores se manejan automáticamente por el contexto
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex min-h-full ">
      <main className="min-w-lg m-auto mt-20 py-10 px-4 bg-stone-100 rounded-md shadow-lg">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-4xl text-[#99775C]">Hello Welcome!</h2>
          <h2>Inicia Sesión en PorciGest</h2>
        </div>

        <form
          className="max-w-md m-auto mt-12 mb-4 flex flex-col"
          onSubmit={handleSubmit}
        >
          {/* Mostrar errores del backend */}
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="flex flex-col gap-1 mb-6">
            <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
              Número de documento
            </FormLabel>
            <TextField
              error={errorDocument}
              variant="outlined"
              placeholder="Ingrese su número de documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              helperText={errorDocument ? "Número de documento inválido (8-12 dígitos)" : ""}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1 mb-6">
            <FormLabel sx={{ fontWeight: 600, color: "#black" }}>
              Contraseña
            </FormLabel>
            <OutlinedInput
              error={errorPassword}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errorPassword && (
              <span className="text-red-500 text-sm">Contraseña requerida</span>
            )}
          </div>

          <Button
            sx={{
              backgroundColor: main,
              color: "white",
              "&:hover": { backgroundColor: "#7a6049" },
              padding: "12px",
              borderRadius: "8px",
            }}
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link 
              href="/registro" 
              className="text-[#99775C] hover:underline font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}