/**
 * 🪝 CUSTOM HOOK: useAuth
 * 
 * Hook personalizado para facilitar el uso de autenticación en toda la aplicación.
 * Proporciona métodos y estados simplificados para trabajar con el auth slice.
 */

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@redux/store";
import {
  loadAuthFromStorage,
  logoutUser,
  clearAuth,
  validateCerberosToken,
} from "@redux/slices/cerberos/authSlice";
import type { User } from "@graphql/generated";

interface UseAuthReturn {
  // Estados
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: { code: string | number; message: string } | null;
  loading: boolean;
  
  // Métodos
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  
  // Utilidades
  hasRole: (roleName: string) => boolean;
  hasProcess: (processName: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated, user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  /**
   * 🔄 Verificar si hay una sesión activa
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      console.log("[useAuth] checkAuth: Iniciando verificación...");
      const result = await dispatch(loadAuthFromStorage()).unwrap();
      console.log("[useAuth] checkAuth: Resultado:", result ? "Autenticado" : "No autenticado");
      return !!result;
    } catch (error) {
      console.error("[useAuth] checkAuth: Error verificando autenticación:", error);
      return false;
    }
  }, [dispatch]);

  /**
   * � Inicializar autenticación desde URL o storage
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    try {
      // Primero intentar cargar desde storage
      console.log("🔍 [useAuth] Verificando localStorage...");
      const stored = await dispatch(loadAuthFromStorage()).unwrap();
      
      if (stored) {
        console.log("✅ [useAuth] Sesión encontrada en storage");
        return;
      }

      // Si no hay en storage, buscar token en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        console.log("🔑 [useAuth] Token encontrado en URL, validando...");
        
        // Guardar inmediatamente en storage como fallback
        const tempAuth = {
          token,
          user: {
            id: "temp",
            person: { name: "Usuario", lastname: "Temporal", document: "" },
            roles: [{ name: "Usuario" }],
          },
        };
        localStorage.setItem("aquiles_auth", JSON.stringify(tempAuth));
        
        // Intentar validar con backend
        try {
          const result = await dispatch(validateCerberosToken(token)).unwrap();
          console.log("✅ [useAuth] Token validado y guardado");
          
          // Actualizar con datos reales
          localStorage.setItem("aquiles_auth", JSON.stringify(result));
        } catch (validationError) {
          console.warn("⚠️ [useAuth] No se pudo validar con backend, usando token directo");
        }
        
        return;
      }

      // Si no hay token, redirigir a login
      console.log("❌ [useAuth] No hay token, redirigiendo a Cerberos");
      throw new Error("No authentication token found");
      
    } catch (error) {
      console.error("❌ [useAuth] Error en initializeAuth:", error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 🔐 Redirigir a login de Cerberos
   */
  const login = useCallback(() => {
    console.log("🚀 [useAuth] Redirigiendo a Cerberos login...");
    const cerberoUrl = "http://10.1.163.75:3001";
    const callbackUrl = "http://10.1.175.79:3000/auth/callback";
    const loginUrl = `${cerberoUrl}/auth/login?project=aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;
    console.log("🔗 [useAuth] Login URL:", loginUrl);
    // Redirigir a Cerberos con callback
    window.location.href = loginUrl;
  }, []);

  /**
   * 🚪 Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      console.log("🚪 [useAuth] Cerrando sesión...");
      await dispatch(logoutUser()).unwrap();
      // Redirigir a Cerberos (10.1.163.75:3001)
      window.location.href = "http://10.1.163.75:3001/auth/login";
    } catch (error) {
      console.error("❌ [useAuth] Error en logout:", error);
      // Limpiar sesión local de todas formas
      dispatch(clearAuth());
      window.location.href = "http://10.1.163.75:3001/auth/login";
    }
  }, [dispatch]);

  /**
   * 🧹 Limpiar errores
   */
  const clearError = useCallback(() => {
    // dispatch(clearError()); // Implementar esta acción si es necesaria
  }, []);

  /**
   * 👤 Verificar si el usuario tiene un rol específico
   */
  const hasRole = useCallback(
    (roleName: string): boolean => {
      if (!user?.roles) return false;
      return user.roles.some(
        (role) => role?.name?.toLowerCase() === roleName.toLowerCase()
      );
    },
    [user]
  );

  /**
   * 🔧 Verificar si el usuario tiene acceso a un proceso específico
   */
  const hasProcess = useCallback(
    (processName: string): boolean => {
      if (!user?.processDetails) return false;
      return user.processDetails.some(
        (detail) =>
          detail?.process?.functionName?.toLowerCase() === processName.toLowerCase()
      );
    },
    [user]
  );

  return {
    // Estados
    isAuthenticated,
    isLoading: loading,
    loading,
    user,
    token,
    error,
    
    // Métodos
    login,
    logout,
    checkAuth,
    initializeAuth,
    clearError,
    
    // Utilidades
    hasRole,
    hasProcess,
  };
};

export default useAuth;
