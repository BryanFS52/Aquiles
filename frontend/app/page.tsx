"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "@redux/store";
import { loadAuthFromStorage } from "@redux/slices/cerberos/authSlice";
import Loader from "@components/UI/Loader";

function HomeContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primero intentar cargar la sesión existente
        await dispatch(loadAuthFromStorage()).unwrap();
        
        // Si llegamos aquí, hay una sesión válida
        router.replace("/dashboard");
      } catch (error) {
        // No hay sesión válida, redirigir a Cerberos
        const currentUrl = window.location.origin;
        const redirectUri = encodeURIComponent(`${currentUrl}/dashboard/auth/callback`);
        window.location.href = `http://10.1.163.75:3001/auth/login?project=Aquiles&redirectUri=${redirectUri}`;
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, router]);

  // Mostrar loader mientras verifica la autenticación
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
      <HomeContent />
    </Provider>
  );
}
