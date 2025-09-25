'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * Context para manejar el estado de autenticación global de la aplicación
 */

// Definir el tipo del contexto
interface AuthContextType {
  // Estado
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Acciones
  login: (numeroDocumento: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Verificar si hay token y datos de usuario
      if (authService.isAuthenticated()) {
        const userData = authService.getUserData();
        if (userData) {
          setUser(userData);
        } else {
          // Si hay token pero no datos de usuario, hacer logout
          authService.logout();
        }
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (numeroDocumento: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.login(numeroDocumento, password) as any;

      if (result.success) {
        // Guardar datos del usuario en el estado
        setUser(result.data || { numeroDocumento });
        return { success: true };
      } else {
        setError(result.error || 'Error en el login');
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado en el login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.signup(userData) as any;

      if (result.success) {
        return { success: true };
      } else {
        setError(result.error || 'Error en el registro');
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado en el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    // Opcional: redirigir al login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;