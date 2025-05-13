"use client";

import { ApolloProvider } from '@apollo/client';
import client from './lib/apollo-client';
import React, { useState } from 'react';
import Link from "next/link";
import { HiLockClosed } from "react-icons/hi";
import { BsPersonCircle } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import Image from "next/image";
import logoSena from '@public/img/LogoSena.png'
import LogoAquilesDarkBlue from '@public/img/LogoAquilesDarkBlue.png'
import ModalOlvidoContraseña from '@components/Modals/modalOlvidoContraseña'
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');
  const router = useRouter();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar campos del formulario
    if (!formData.documentType || !formData.documentNumber || !formData.password) {
      setValidationError('¡Acceso denegado! Verifica que los campos no estén vacios o incorrectos.');
      return;
    }

    try {
      // Limpiar errores previos
      setValidationError('');
      setError(null);

      const response = await axios.post('/api/auth/login', {
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.data) {
        const { redirectUrl, rol } = response.data.data;
        localStorage.setItem('userRole', rol);
        window.location.href = redirectUrl;
      } else {
        throw new Error("No se recibió la URL de redirección");
      }

    } catch (error) {
      setError('Error al iniciar sesión: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <ApolloProvider client={client}>

      <div className="font-inter min-h-screen flex flex-col lg:flex-row bg-white ">
        <div className="lg:w-1/2 p-6 md:p-6 flex flex-col justify-center h-screen items-center ">
          <div className="max-w-md mx-auto w-2/3">
            <div className="flex items-center mb-6">
              <Image src={LogoAquilesDarkBlue} alt="Logo Aquiles" className="w-24 sm:w-32 md:w-36 lg:w-32 xl:w-36 ml-[-10px]" />
              <div className="font-inter flex flex-col text-custom-blue">
                <h1 className="text-2xl sm:text-3xl lg:text-2xl xl:text-4xl md:text-4xl font-medium">Aquiles</h1>
                <p className="text-xs lg:text-xs xl:text-sm md:text-sm sm:text-sm font-light">
                  Sistema de Gestión de Asistencia y Seguimiento para Proyectos de Aprendices
                </p>
              </div>
            </div>
            <div className="font-inter text-custom-blue pt-4 md:pt-0">
              <h1 className="text-2xl lg:text-2xl xl:text-4xl md:text-4xl sm:text-3xl">Inicia Sesión</h1>
              <p className="text-sm md:text-base pt-0 sm:pt-5">
                ¡Bienvenido!
                <br />
                Accede a tu cuenta.
              </p>
            </div>

            {validationError && (
              <div className="bg-red-500 text-white p-4 rounded-md mt-4 mb-4">
                <p>{validationError}</p>
              </div>
            )}

            {error && (
              <div className="text-red-500 mt-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6">
              <div className="space-y-4">
                <div className="font-inter font-normal flex items-center w-full rounded border-solid border-2">
                  <HiMiniIdentification className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="outline-none text-sm w-full h-9 text-custom-blue"
                  >
                    <option value="" disabled hidden>
                      Tipo de documento
                    </option>
                    <option value="CC">Cédula de Ciudadania</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula Extranjería</option>
                    <option value="PP">Pasaporte</option>
                    <option value="PEP">Permiso Especial de Permanencia</option>
                    <option value="PPT">Permiso de Protección Temporal</option>
                  </select>
                </div>

                <div className="font-inter font-normal flex items-center w-full rounded border-solid border-2 text-custom-blue">
                  <BsPersonCircle className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                  <input
                    value={formData.documentNumber}
                    type="text"
                    name="documentNumber"
                    placeholder='Documento'
                    className='outline-none text-sm w-full h-9 text-custom-blue'
                    onChange={handleChange}
                  />
                </div>

                <div className="font-inter font-normal flex items-center w-full rounded border-solid border-2">
                  <HiLockClosed className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                  <input
                    value={formData.password}
                    type="password"
                    name="password"
                    placeholder='Contraseña'
                    className='outline-none text-sm w-full h-9 text-[#0e324d]'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="font-inter font-normal flex justify-end mt-2 text-[#0e324d]">
                <div className="text-sm">
                  <Link href="">
                    <p className='hover:text-custom-blues' onClick={handleOpenModal}>¿Olvidó su contraseña?</p>
                  </Link>
                  <ModalOlvidoContraseña isOpen={modalOpen} onClose={handleCloseModal} />
                </div>
              </div>

              <button
                className='font-inter font-semibold bg-[#0e324d] w-full p-2 text-white rounded mt-4 md:mt-6 hover:bg-[#01b001] transition-colors duration-300'
                type='submit'
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
        <div className="hidden lg:block xl:w-11/12 bg-cover bg-center" style={{ backgroundImage: "url('/img/fondo-login.png')" }}>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 h-full flex flex-col justify-between p-6 text-center text-white">
              <div className='flex justify-end'>
                <div className="w-36">
                  <Image src={logoSena} alt="" className="" />
                </div>
              </div>
              <div>
                <div className='font-inter font-normal flex justify-center'>
                  <div className='rounded-md relative w-3/5' style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}>
                    <p className='lg:text-sm 2xl:text-base text-justify'>
                      ¡Únete a la comunidad educativa del SENA y
                      potencia tu futuro! Regístrate ahora para
                      acceder a una amplia gama de programas de
                      formación y oportunidades de crecimiento
                      profesional.
                    </p>
                  </div>
                </div>
                <div className='font-inter font-normal flex items-center justify-end'>
                  <div>
                    <span className='text-xs'>Potenciando la asistencia </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  )
}