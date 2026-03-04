import React, { useState, useEffect, useCallback } from 'react';
import { HiX, HiMail, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

const ModalOlvidoContraseña = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Limpiar estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setStatus('idle');
      setMessage('');
      setErrors({});
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Limpiar errores mientras el usuario escribe
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setStatus('loading');
    setErrors({});

    try {
      // Simular llamada a API - reemplaza con tu endpoint real
      const response = await axios.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase()
      }, {
        timeout: 10000
      });

      if (response.data?.success) {
        setStatus('success');
        setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');

        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('Error al recuperar contraseña:', error);

      setStatus('error');

      if (error.response?.status === 404) {
        setMessage('No se encontró una cuenta con este correo electrónico.');
      } else if (error.response?.status === 429) {
        setMessage('Demasiados intentos. Espera unos minutos antes de intentar nuevamente.');
      } else if (error.code === 'ECONNABORTED') {
        setMessage('Tiempo de espera agotado. Verifica tu conexión e intenta nuevamente.');
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error al enviar el correo de recuperación. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar clic en el backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            Recuperar Contraseña
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === 'success' ? (
            // Estado de éxito
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <HiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Correo Enviado!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {message}
              </p>
              <p className="text-xs text-gray-500">
                Este modal se cerrará automáticamente en unos segundos...
              </p>
            </div>
          ) : (
            // Formulario
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {/* Mensaje de error global */}
              {status === 'error' && message && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <HiExclamationCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo de email */}
                <div>
                  <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="recovery-email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg text-sm transition-colors duration-200 
                        ${errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        } 
                        focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500`}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-lightGreen border border-transparent rounded-lg hover:bg-darkGreen focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Enlace'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer informativo */}
        {status !== 'success' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              ¿No recibes el correo? Revisa tu carpeta de spam o intenta con otro correo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalOlvidoContraseña;