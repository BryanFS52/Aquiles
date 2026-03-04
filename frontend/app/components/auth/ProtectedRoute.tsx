/**
 * 🛡️ PROTECTED ROUTE COMPONENT
 * 
 * Componente para proteger rutas que requieren autenticación.
 * Redirige automáticamente al login si el usuario no está autenticado.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import Loader from "@components/UI/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredProcess?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredProcess,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuth, hasRole, hasProcess, login } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        
        if (!authenticated) {
          // No autenticado, redirigir a login
          login();
          return;
        }

        // Verificar rol si es requerido
        if (requiredRole && !hasRole(requiredRole)) {
          setHasAccess(false);
          setIsChecking(false);
          return;
        }

        // Verificar proceso si es requerido
        if (requiredProcess && !hasProcess(requiredProcess)) {
          setHasAccess(false);
          setIsChecking(false);
          return;
        }

        // Usuario tiene acceso
        setHasAccess(true);
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        login();
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth, hasRole, hasProcess, requiredRole, requiredProcess, login]);

  // Mostrar loader mientras verifica
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // No tiene acceso
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">🚫 Acceso Denegado</h2>
            <p className="mb-4">
              No tienes los permisos necesarios para acceder a esta página.
            </p>
            {requiredRole && (
              <p className="text-sm mb-2">
                <strong>Rol requerido:</strong> {requiredRole}
              </p>
            )}
            {requiredProcess && (
              <p className="text-sm mb-4">
                <strong>Proceso requerido:</strong> {requiredProcess}
              </p>
            )}
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado y con acceso
  return <>{children}</>;
}

/**
 * 📚 EJEMPLO DE USO:
 * 
 * 1. Proteger una ruta simple:
 * <ProtectedRoute>
 *   <MiComponente />
 * </ProtectedRoute>
 * 
 * 2. Proteger con rol específico:
 * <ProtectedRoute requiredRole="admin">
 *   <PanelAdmin />
 * </ProtectedRoute>
 * 
 * 3. Proteger con proceso específico:
 * <ProtectedRoute requiredProcess="Gestión Académica">
 *   <ComponenteAcademico />
 * </ProtectedRoute>
 * 
 * 4. Con fallback personalizado:
 * <ProtectedRoute 
 *   requiredRole="instructor"
 *   fallback={<div>No eres instructor</div>}
 * >
 *   <PanelInstructor />
 * </ProtectedRoute>
 */
