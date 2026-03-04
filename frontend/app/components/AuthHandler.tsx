"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { validateCerberosToken, loadAuthFromStorage } from "@redux/slices/cerberos/authSlice";
import Loader from "@components/UI/Loader";

const CERBEROS_URL = process.env.NEXT_PUBLIC_CERBEROS_URL || "https://cerberos.datasena.com";
const AQUILES_URL = process.env.NEXT_PUBLIC_AQUILES_URL || "http://localhost:3000";

export default function AuthHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [redirectCount, setRedirectCount] = useState(0);
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

    useEffect(() => {
        // Prevenir loops de redirección
        if (redirectCount > 2) {
            console.error("❌ [AuthHandler] Loop detectado después de 3 intentos");
            setIsInitializing(false);
            return;
        }

        const handleAuth = async () => {
            if (hasAttemptedAuth) return;

            console.log("🚀 [AuthHandler] Iniciando procesamiento del callback...");
            console.log("📍 [AuthHandler] URL actual:", window.location.href);
            console.log("🔗 [AuthHandler] Search params:", window.location.search);

            setHasAttemptedAuth(true);

            try {
                // PASO 1: Buscar token en la URL
                const token = searchParams.get("token");

                console.log("🔍 [AuthHandler] Buscando token...");
                console.log("📦 [AuthHandler] Parámetros disponibles:", Array.from(searchParams.entries()));

                if (token) {
                    console.log("✅ [AuthHandler] Token en URL:", token.substring(0, 30) + "...");

                    // PASO 2: Guardar INMEDIATAMENTE en localStorage
                    const tempAuth = {
                        token,
                        user: {
                            id: "temp",
                            person: { name: "Usuario", lastname: "Temporal", document: "" },
                            roles: [{ name: "Usuario" }],
                        },
                    };

                    console.log("💾 [AuthHandler] Guardando en localStorage de Aquiles...");
                    localStorage.setItem("aquiles_auth", JSON.stringify(tempAuth));
                    sessionStorage.setItem("aquiles_auth", JSON.stringify(tempAuth));

                    // Verificar que se guardó
                    const verificacion = localStorage.getItem("aquiles_auth");
                    console.log("🔍 [AuthHandler] localStorage:", verificacion ? "✅ GUARDADO EXITOSAMENTE" : "❌ FALLO");

                    // PASO 3: Intentar validar con backend
                    console.log("📡 [AuthHandler] Validando token con backend...");
                    try {
                        const result = await dispatch(validateCerberosToken(token)).unwrap();
                        console.log("✅ [AuthHandler] Token validado correctamente");
                        // Ya se guardó en validateCerberosToken también
                    } catch (validationError: any) {
                        console.warn("⚠️ [AuthHandler] Backend no pudo validar:", validationError?.message);
                        console.log("✅ [AuthHandler] Pero el token temporal ya está guardado, continuando...");
                    }

                    console.log("✅ [AuthHandler] Procesamiento completado");
                } else {
                    // No hay token en URL, intentar cargar desde storage existente
                    console.log("❌ [AuthHandler] NO HAY TOKEN EN URL!");
                    console.log("📦 [AuthHandler] Intentando cargar desde storage...");
                    const result = await dispatch(loadAuthFromStorage()).unwrap();
                    if (!result) {
                        throw new Error("No hay autenticación disponible");
                    }
                    console.log("✅ [AuthHandler] Sesión cargada desde storage");
                }

            } catch (err: any) {
                console.error("❌ [AuthHandler] Error:", err?.message);
                setError(err?.message || "Error en autenticación");
                setRedirectCount(prev => prev + 1);
            } finally {
                setIsInitializing(false);
            }
        };

        handleAuth();
    }, [searchParams, hasAttemptedAuth, dispatch, redirectCount]);

    // Redirigir al dashboard cuando se complete la autenticación
    useEffect(() => {
        if (isAuthenticated && !loading && !isInitializing) {
            console.log("✅ [AuthHandler] Redux state actualizado, redirigiendo...");

            // Esperar un poquito para asegurar que el DOM está listo
            const timer = setTimeout(() => {
                console.log("🚀 [AuthHandler] Redirección final al dashboard");
                router.push("/dashboard");
            }, 500);

            return () => clearTimeout(timer);
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
                            <p>{error || "Hubo un problema al validar tus credenciales"}</p>
                        )}
                        <div className="mt-4 space-x-2">
                            <button
                                onClick={() => {
                                    console.log("🧹 [AuthHandler] Limpiando localStorage y redirigiendo...");
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    const callbackUrl = `${AQUILES_URL}/auth/callback`;
                                    const loginUrl = `${CERBEROS_URL}/auth/login?project=Aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;
                                    window.location.href = loginUrl;
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
                            console.log("🔐 [AuthHandler] Redirigiendo manualmente a Cerberos...");
                            const callbackUrl = `${AQUILES_URL}/auth/callback`;
                            const loginUrl = `${CERBEROS_URL}/auth/login?project=Aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;
                            window.location.href = loginUrl;
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
