"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "@redux/store";
import { loadAuthFromStorage } from "@redux/slices/cerberos/authSlice";
import { verifyTokenInStorage, debugStorageState, isTokenValid } from "@lib/tokenPersistence";
import { LoaderProvider } from "@context/LoaderContext";
import Loader from "@components/UI/Loader";

function HomeContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[Home] Iniciando verificación de autenticación...");
        console.log("[Home] Dominio Actual:", window.location.hostname);

        // Verificar que el token está en localStorage
        debugStorageState();

        const hasValidToken = verifyTokenInStorage();
        const isValid = isTokenValid();

        console.log("[Home] Estado del Token:", {
          existeEnStorage: hasValidToken,
          esValido: isValid,
        });

        if (hasValidToken && isValid) {
          console.log("[Home] Token válido encontrado en localStorage");
          console.log("[Home] Intentando cargar sesión desde storage...");
          
          await dispatch(loadAuthFromStorage()).unwrap();
          
          console.log("[Home] Sesión cargada exitosamente");
          console.log("[Home] Redirigiendo al dashboard...");
          
          setTimeout(() => {
            router.replace("/dashboard");
          }, 300);
        } else {
          console.warn("[Home] No hay token válido en storage");
          console.log("[Home] Redirigiendo a Cerberos para login...");
          
          const cerberoUrl = "http://10.1.163.75:3001";
          const callbackUrl = "http://10.1.175.79:3000/auth/callback";
          const loginUrl = `${cerberoUrl}/auth/login?project=aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;
          
          console.log("[Home] URL de Cerberos:", loginUrl);
          console.log("[Home] Callback URL:", callbackUrl);
          
          setTimeout(() => {
            window.location.href = loginUrl;
          }, 500);
        }
      } catch (error) {
        console.error("[Home] Error verificando sesión:", error);

        const cerberoUrl = "http://10.1.163.75:3001";
        const callbackUrl = "http://10.1.175.79:3000/auth/callback";
        const loginUrl = `${cerberoUrl}/auth/login?project=aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;
        
        console.log("[Home] URL de Cerberos (error flow):", loginUrl);
        
        setTimeout(() => {
          window.location.href = loginUrl;
        }, 800);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, router]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
          <p className="mt-2 text-gray-500 text-sm">Conectando con Cerberos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Redirigiendo al login...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Provider store={store}>
      <LoaderProvider>
        <HomeContent />
      </LoaderProvider>
    </Provider>
  );
}
