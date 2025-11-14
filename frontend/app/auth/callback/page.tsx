"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { validateCerberosToken } from "@redux/slices/cerberos/authSlice";
import Loader from "@components/UI/Loader";

const AQUILES_URL = process.env.NEXT_PUBLIC_AQUILES_URL || "http://localhost:3000";

export default function CerberosCallback() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      validateTokenWithRedux(token);
    } else {
      setTimeout(() => {
        window.location.href = `${AQUILES_URL}/`;
      }, 2000);
    }
  }, [searchParams, dispatch]);

  const validateTokenWithRedux = async (token: string) => {
    try {
      await dispatch(validateCerberosToken(token)).unwrap();

      setTimeout(() => {
        window.location.href = `${AQUILES_URL}/dashboard`;
      }, 500);
    } catch (error) {
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

      localStorage.setItem("aquiles_auth", JSON.stringify(tempAuthData));
      sessionStorage.setItem("aquiles_auth", JSON.stringify(tempAuthData));

      setTimeout(() => {
        window.location.href = `${AQUILES_URL}/dashboard`;
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
