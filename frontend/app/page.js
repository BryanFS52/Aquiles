"use client";

import React, { useState, useCallback } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@lib/apollo-client';
import { HiLockClosed } from "react-icons/hi";
import { BsPersonCircle } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Image from "next/image";
import logoSena from '@public/img/LogoSena.png'
import LogoAquilesDarkBlue from '@public/img/LogoAquilesDarkBlue.png'
import ModalOlvidoContraseña from '@components/Modals/modalOlvidoContraseña'
import axios from 'axios';

// Tipos de documento disponibles
const DOCUMENT_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PP", label: "Pasaporte" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
  { value: "PPT", label: "Permiso de Protección Temporal" }
];

// Componente de campo de entrada reutilizable
const InputField = ({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  className = "",
  showPasswordToggle = false,
  onTogglePassword = null,
  showPassword = false,
  error = false,
  ...props
}) => (
  <div className={`relative font-inter font-normal flex items-center w-full rounded border-solid border-2 ${error ? 'border-red-500' : 'border-gray-300 focus-within:border-custom-blue'
    } transition-colors duration-200`}>
    <Icon className="w-5 mr-2 mx-3 h-5 text-gray-500" />
    <input
      value={value}
      type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
      name={name}
      placeholder={placeholder}
      className={`outline-none text-sm w-full h-10 text-custom-blue bg-transparent ${className}`}
      onChange={onChange}
      {...props}
    />
    {showPasswordToggle && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? (
          <HiEyeSlash className="w-5 h-5" />
        ) : (
          <HiEye className="w-5 h-5" />
        )}
      </button>
    )}
  </div>
);

// Componente de select reutilizable
const SelectField = ({
  icon: Icon,
  name,
  value,
  onChange,
  options,
  placeholder,
  error = false
}) => (
  <div className={`font-inter font-normal flex items-center w-full rounded border-solid border-2 ${error ? 'border-red-500' : 'border-gray-300 focus-within:border-custom-blue'
    } transition-colors duration-200`}>
    <Icon className="w-5 mr-2 mx-3 h-5 text-gray-500" />
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="outline-none text-sm w-full h-10 text-custom-blue bg-transparent"
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Componente de alerta
const Alert = ({ type = "error", message, onClose }) => {
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={`${bgColor} text-white p-4 rounded-md mt-4 mb-4 relative`}>
      <p className="text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  // Función para limpiar alertas después de un tiempo
  const showAlert = useCallback((message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(''), 5000);
  }, []);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.documentType) {
      newErrors.documentType = 'Selecciona un tipo de documento';
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = 'Ingresa tu número de documento';
    } else if (!/^\d+$/.test(formData.documentNumber)) {
      newErrors.documentNumber = 'El número de documento solo debe contener números';
    }

    if (!formData.password) {
      newErrors.password = 'Ingresa tu contraseña';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    setAlertMessage('');

    try {
      const response = await axios.post('/api/auth/login', {
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos de timeout
      });

      if (response.data?.success && response.data?.data) {
        const { redirectUrl, rol } = response.data.data;

        // Validar que tenemos los datos necesarios
        if (!redirectUrl || !rol) {
          throw new Error("Respuesta del servidor incompleta");
        }

        localStorage.setItem('userRole', rol);

        // Mostrar mensaje de éxito antes de redirigir
        showAlert('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);

      } else {
        throw new Error(response.data?.message || "Error en la respuesta del servidor");
      }

    } catch (error) {
      console.error('Error en login:', error);

      let errorMessage = 'Error al iniciar sesión. ';

      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Tiempo de espera agotado. Intenta nuevamente.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Credenciales incorrectas.';
      } else if (error.response?.status === 429) {
        errorMessage += 'Demasiados intentos. Espera un momento.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Verifica tu conexión e intenta nuevamente.';
      }

      showAlert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApolloProvider client={client}>
      <div className="font-inter min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Panel de login */}
        <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-center min-h-screen items-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo y título */}
            <div className="flex items-center mb-8">
              <Image
                src={LogoAquilesDarkBlue}
                alt="Logo Aquiles"
                className="w-24 sm:w-32 md:w-36 lg:w-32 xl:w-36 ml-[-10px]"
                priority
              />
              <div className="font-inter flex flex-col text-custom-blue">
                <h1 className="text-2xl sm:text-3xl lg:text-2xl xl:text-4xl md:text-4xl font-medium">
                  Aquiles
                </h1>
                <p className="text-xs lg:text-xs xl:text-sm md:text-sm sm:text-sm font-light">
                  Sistema de Gestión de Asistencia y Seguimiento para Proyectos de Aprendices
                </p>
              </div>
            </div>

            {/* Encabezado de login */}
            <div className="font-inter text-custom-blue mb-6">
              <h2 className="text-2xl lg:text-2xl xl:text-4xl md:text-4xl sm:text-3xl font-semibold">
                Inicia Sesión
              </h2>
              <p className="text-sm md:text-base pt-2 text-gray-600">
                ¡Bienvenido!<br />
                Accede a tu cuenta para continuar.
              </p>
            </div>

            {/* Alertas */}
            {alertMessage && (
              <Alert
                type={alertType}
                message={alertMessage}
                onClose={() => setAlertMessage('')}
              />
            )}

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              <div className="space-y-4">
                {/* Tipo de documento */}
                <div>
                  <SelectField
                    icon={HiMiniIdentification}
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    options={DOCUMENT_TYPES}
                    placeholder="Tipo de documento"
                    error={!!errors.documentType}
                  />
                  {errors.documentType && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>
                  )}
                </div>

                {/* Número de documento */}
                <div>
                  <InputField
                    icon={BsPersonCircle}
                    type="text"
                    name="documentNumber"
                    placeholder="Número de documento"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    error={!!errors.documentNumber}
                    autoComplete="username"
                  />
                  {errors.documentNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <InputField
                    icon={HiLockClosed}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    showPasswordToggle={true}
                    showPassword={showPassword}
                    onTogglePassword={togglePasswordVisibility}
                    error={!!errors.password}
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Enlace de recuperación */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="text-sm text-custom-blue hover:text-blue-600 transition-colors duration-200 underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`font-inter font-semibold w-full p-3 text-white rounded-md transition-all duration-300 ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0e324d] hover:bg-[#01b001] hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Panel lateral con imagen */}
        <div className="hidden lg:block lg:w-1/2 xl:w-3/5 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/img/fondo-login.png')" }}>
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
            {/* Logo SENA */}
            <div className="flex justify-end">
              <div className="w-32 xl:w-36">
                <Image
                  src={logoSena}
                  alt="Logo SENA"
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="max-w-lg text-center bg-black bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-sm xl:text-base leading-relaxed">
                    ¡Únete a la comunidad educativa del SENA y potencia tu futuro!
                    Regístrate ahora para acceder a una amplia gama de programas de
                    formación y oportunidades de crecimiento profesional.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <p className="text-xs xl:text-sm font-light">
                  Potenciando la asistencia y el aprendizaje
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recuperación de contraseña */}
      <ModalOlvidoContraseña
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </ApolloProvider>
  );
}