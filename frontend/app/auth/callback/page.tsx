"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { validateCerberosToken } from "@redux/slices/cerberos/authSlice";
import Loader from "@components/UI/Loader";

const AQUILES_URL = process.env.NEXT_PUBLIC_AQUILES_URL || "http://localhost:3000";

export default function CerberosCallback() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    console.log("🎯 [Callback Page] Iniciando...");
    console.log("🔗 [Callback Page] URL completa:", window.location.href);
    console.log("📦 [Callback Page] Search params:", Array.from(searchParams.entries()));

    const token = searchParams.get("token");
    console.log("🔑 [Callback Page] Token recibido:", token ? "SÍ (" + token.substring(0, 30) + "...)" : "NO");

    if (token) {
      validateTokenWithRedux(token);
    } else {
      console.error("❌ [Callback Page] NO HAY TOKEN, redirigiendo a home...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [searchParams, dispatch, router]);

  const validateTokenWithRedux = async (token: string) => {
    console.log("🚀 [Callback Page] Iniciando validación del token...");

    try {
      console.log("📡 [Callback Page] Llamando a validateCerberosToken...");
      const result = await dispatch(validateCerberosToken(token)).unwrap();
      console.log("✅ [Callback Page] Token validado exitosamente:", result);

      // Verificar que se guardó
      const stored = localStorage.getItem("aquiles_auth");
      console.log("💾 [Callback Page] localStorage después de validación:", stored ? "✅ EXISTE" : "❌ VACÍO");
      if (stored) {
        console.log("📦 [Callback Page] Contenido guardado:", JSON.parse(stored));
      }

      // Usar router.push en lugar de window.location.href para preservar el estado de Redux
      console.log("🔄 [Callback Page] Redirigiendo a dashboard (client-side navigation)...");
      setTimeout(() => {
        // Verificar una última vez antes de redirigir
        const finalCheck = localStorage.getItem("aquiles_auth");
        console.log("🔍 [Callback Page] Verificación final antes de redirect:", finalCheck ? "✅ OK" : "❌ PERDIDO");

        router.push("/dashboard");
      }, 500);
    } catch (error: any) {
      console.error("❌ [Callback Page] Error validando token:", error);
      console.warn("⚠️ [Callback Page] Guardando datos temporales como fallback...");

      const tempAuthData = {
        token,
        user: {
          id: "temp",
          person: {
            name: "Usuario",
            lastname: "Temporal",
            document: "",
          },
          roles: [{ name: "aprendiz" }],
        },
      };

      console.log("💾 [Callback Page] Guardando en localStorage/sessionStorage...");
      localStorage.setItem("aquiles_auth", JSON.stringify(tempAuthData));
      sessionStorage.setItem("aquiles_auth", JSON.stringify(tempAuthData));

      // Verificar
      const verified = localStorage.getItem("aquiles_auth");
      console.log("🔍 [Callback Page] Verificación localStorage:", verified ? "✅ GUARDADO" : "❌ ERROR");
      if (verified) {
        console.log("📦 [Callback Page] Datos guardados:", JSON.parse(verified));
      }

      console.log("🔄 [Callback Page] Redirigiendo a dashboard (con fallback, client-side)...");
      setTimeout(() => {
        // Verificar una última vez antes de redirigir
        const finalCheck = localStorage.getItem("aquiles_auth");
        console.log("🔍 [Callback Page] Verificación final antes de redirect:", finalCheck ? "✅ OK" : "❌ PERDIDO");

        router.push("/dashboard");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  );
}
