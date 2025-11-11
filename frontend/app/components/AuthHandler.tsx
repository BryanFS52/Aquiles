"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@hooks/useAuth";
import Loader from "@components/UI/Loader";

export default function AuthHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { initializeAuth, isAuthenticated, loading, error } = useAuth();
    const [isInitializing, setIsInitializing] = useState(true);
    const [redirectCount, setRedirectCount] = useState(0);
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

    useEffect(() => {
        // Prevenir loops de redirección
        if (redirectCount > 2) {
            console.error("❌ [AuthHandler] Loop detectado, abortando");
            setIsInitializing(false);
            return;
        }

        const handleAuth = async () => {
            if (hasAttemptedAuth) return;

            console.log("🚀 [AuthHandler] Iniciando autenticación...");
            setHasAttemptedAuth(true);

            try {
                // PRIMERO: Buscar token en la URL
                const token = searchParams.get("token");
                
                if (token) {
                    console.log("🔑 [AuthHandler] Token encontrado en URL:", token.substring(0, 20) + "...");
                    
                    // GUARDAR INMEDIATAMENTE en localStorage (ANTES de validar)
                    const tempAuth = {
                        token,
                        user: {
                            id: "temp",
                            person: { name: "Usuario", lastname: "Cargando...", document: "" },
                            roles: [{ name: "Usuario" }],
                        },
                    };
                    
                    console.log("💾 [AuthHandler] Guardando token en localStorage (10.1.175.79)...");
                    localStorage.setItem("olympo_auth", JSON.stringify(tempAuth));
                    sessionStorage.setItem("olympo_auth", JSON.stringify(tempAuth));
                    
                    // Verificar que se guardó
                    const verificacion = localStorage.getItem("olympo_auth");
                    console.log("🔍 [AuthHandler] Verificación localStorage:", verificacion ? "✅ GUARDADO" : "❌ ERROR");
                    
                    // AHORA intentar validar con backend (pero sin bloquear si falla)
                    try {
                        await initializeAuth();
                        console.log("✅ [AuthHandler] Token validado con backend");
                    } catch (validationError) {
                        console.warn("⚠️ [AuthHandler] Backend no validó, pero token ya está guardado");
                    }
                } else {
                    // No hay token en URL, intentar cargar desde storage
                    console.log("📦 [AuthHandler] No hay token en URL, intentando desde storage...");
                    await initializeAuth();
                }
                
                console.log("✅ [AuthHandler] Autenticación completada");
            } catch (error) {
                console.error("❌ [AuthHandler] Error:", error);
                setRedirectCount(prev => prev + 1);
            } finally {
                setIsInitializing(false);
            }
        };

        // Ejecutar inmediatamente sin delay
        handleAuth();
    }, [searchParams, hasAttemptedAuth, initializeAuth, redirectCount]);

    // Redirigir al dashboard cuando se complete la autenticación
    useEffect(() => {
        if (isAuthenticated && !loading && !isInitializing) {
            console.log("✅ [AuthHandler] Autenticado, redirigiendo a dashboard");
            router.push("/dashboard");
        }
    }, [isAuthenticated, loading, isInitializing, router]);

    // Mostrar spinner mientras se inicializa
    if (isInitializing || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-gray-600">
                        Validando credenciales de Cerberos...
                    </p>
                    {redirectCount > 0 && (
                        <p className="mt-2 text-sm text-yellow-600">
                            Intento {redirectCount + 1} de 3
                        </p>
                    )}
                    <p className="mt-2 text-xs text-blue-500">
                        Abre la consola (F12) para ver el proceso
                    </p>
                </div>
            </div>
        );
    }

    // Mostrar error si hay algún problema
    if (error || redirectCount > 2) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <h2 className="font-bold text-lg mb-2">❌ Error de Autenticación</h2>
                        {redirectCount > 2 ? (
                            <div>
                                <p>Se detectó un bucle de redirecciones. Esto puede ser debido a:</p>
                                <ul className="text-left mt-2 text-sm">
                                    <li>• Problemas de conectividad con el servidor</li>
                                    <li>• Token de Cerberos inválido o expirado</li>
                                    <li>• Configuración incorrecta</li>
                                </ul>
                            </div>
                        ) : (
                            <p>{error?.message || "Hubo un problema al validar tus credenciales"}</p>
                        )}
                        <div className="mt-4 space-x-2">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.href = "http://10.1.163.75:3001/auth/login?project=Aquiles";
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Limpiar y reintentar
                            </button>
                            <button
                                onClick={() => {
                                    setRedirectCount(0);
                                    setHasAttemptedAuth(false);
                                    setIsInitializing(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Intentar nuevamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Si no está autenticado y no hay loading, redirigir a Cerberos
    if (!isAuthenticated && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Redirigiendo a Cerberos...</p>
                    <button
                        onClick={() => {
                            window.location.href = "http://10.1.163.75:3001/auth/login?project=Aquiles";
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Ir a Cerberos manualmente
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
