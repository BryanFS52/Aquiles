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

const CERBEROS_URL = process.env.NEXT_PUBLIC_CERBEROS_URL || "https://cerberos.datasena.com";
const AQUILES_URL = process.env.NEXT_PUBLIC_AQUILES_URL || "http://localhost:3000";

function HomeContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // ========================================
    // 🚫 AUTENTICACIÓN DESHABILITADA TEMPORALMENTE
    // ========================================
    // Descomenta el bloque de abajo para habilitar el login nuevamente
    
    /*
    const checkAuth = async () => {
      try {
        const hasValidToken = verifyTokenInStorage();
        const isValid = isTokenValid();

        if (hasValidToken && isValid) {
          await dispatch(loadAuthFromStorage()).unwrap();

          setTimeout(() => {
            router.replace("/dashboard");
          }, 300);
        } else {
          const callbackUrl = `${AQUILES_URL}/auth/callback`;
          const loginUrl = `${CERBEROS_URL}/auth/login?project=Aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;

          setTimeout(() => {
            window.location.href = loginUrl;
          }, 500);
        }
      } catch (error) {
        console.error("[Home] Error verificando sesión:", error);

        const callbackUrl = `${AQUILES_URL}/auth/callback`;
        const loginUrl = `${CERBEROS_URL}/auth/login?project=Aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;

        setTimeout(() => {
          window.location.href = loginUrl;
        }, 800);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
    */

    // ========================================
    // 🎯 ACCESO DIRECTO AL DASHBOARD (TEMPORAL)
    // ========================================
    // Esta línea permite ir directamente al dashboard sin login
    setTimeout(() => {
      router.replace("/dashboard");
      setIsChecking(false);
    }, 300);
    
  }, [dispatch, router]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
          <p className="mt-2 text-gray-500 text-sm">Conectando con cerberos...</p>
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
