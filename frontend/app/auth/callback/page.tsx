"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { validateCerberosToken } from "@redux/slices/cerberos/authSlice";
import Loader from "@components/UI/Loader";

export default function CerberosCallback() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("[Callback] Recibido en /auth/callback");
    console.log("[Callback] URL:", window.location.href);
    console.log("[Callback] Token:", token ? "SI (long: " + token.length + ")" : "NO");

    if (token) {
      // Validar token usando Redux thunk
      validateTokenWithRedux(token);
    } else {
      console.error("[Callback] No hay token en URL");
      setTimeout(() => {
        window.location.href = "http://10.1.175.79:3000/";
      }, 2000);
    }
  }, [searchParams, dispatch]);

  const validateTokenWithRedux = async (token: string) => {
    try {
      console.log("[Callback] Validando token con Redux thunk...");

      // Usar el thunk validateCerberosToken del Redux slice
      const result = await dispatch(validateCerberosToken(token)).unwrap();

      console.log("[Callback] Token validado exitosamente");
      console.log("[Callback] Usuario:", result.user);

      // El thunk ya guardó en localStorage, solo redirigir
      setTimeout(() => {
        console.log("[Callback] Redirigiendo a dashboard...");
        window.location.href = "http://10.1.175.79:3000/dashboard";
      }, 500);
    } catch (error) {
      console.error("[Callback] Error validando token:", error);

      // Fallback: guardar datos temporales si falla
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

      console.log("[Callback] Guardando datos temporales...");
      localStorage.setItem("aquiles_auth", JSON.stringify(tempAuthData));
      sessionStorage.setItem("aquiles_auth", JSON.stringify(tempAuthData));

      setTimeout(() => {
        window.location.href = "http://10.1.175.79:3000/dashboard";
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Procesando autenticacion...</p>
        <p className="mt-2 text-xs text-gray-500">Validando token con servidor...</p>
      </div>
    </div>
  );
}
