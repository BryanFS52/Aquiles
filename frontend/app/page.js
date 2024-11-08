"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { HiLockClosed } from "react-icons/hi";
import { BsPersonCircle } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import Image from "next/image";
import logoSena from "../public/img/LogoSena.png";
import LogoAquilesDarkBlue from "../public/img/LogoAquilesDarkBlue.png";
import ModalOlvidoContraseña from "../app/components/Modals/modalOlvidoContraseña";
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
    try {
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
      console.error('Error al iniciar sesión:', error.message);
      setError('Error al iniciar sesión: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="font-inter min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 p-6 md:p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center mb-6 space-x-2">
            <Image src={LogoAquilesDarkBlue} alt="Logo Aquiles" className="w-24 md:w-36" />
            <div className="font-inter flex flex-col text-custom-blue">
              <h1 className="text-2xl md:text-4xl font-medium">Aquiles</h1>
              <p className="text-xs md:text-sm font-light">
                Sistema de Gestión de Asistencia y Seguimiento para Proyectos de Aprendices
              </p>
            </div>
          </div>
          <div className="font-inter text-custom-blue pt-6 md:pt-0">
            <h1 className="text-3xl md:text-4xl">Inicia Sesión</h1>
            <p className="text-sm md:text-base pt-3 md:pt-5">
              ¡Bienvenido de Vuelta!
              <br />
              Inicia Sesión para Acceder a tu Cuenta.
            </p>
          </div>

          {error && (
            <div className="text-red-500 mt-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 md:mt-6">
            <div className="space-y-4">
              <div className="font-inter font-normal flex items-center w-full rounded border-solid border-2">
                <HiMiniIdentification className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="outline-none text-sm w-full h-9 text-custom-blue"
                  required
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
                  required
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
                  required
                />
              </div>
            </div>
            <div className="font-inter font-normal flex justify-end mt-4 text-[#0e324d]">
              <div className="text-sm">
                <Link href="">
                  <p className='hover:text-custom-blues' onClick={handleOpenModal}>¿Olvidó su contraseña?</p>
                </Link>
                <ModalOlvidoContraseña isOpen={modalOpen} onClose={handleCloseModal}/>
              </div>
            </div>

            <button 
              className='font-inter font-semibold bg-[#0e324d] w-full p-2 text-white rounded mt-8 md:mt-6 hover:bg-[#01b001] transition-colors duration-300' 
              type='submit'
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/img/fondo-login.png')"}}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 h-full flex flex-col justify-between p-10 text-center text-white">
            <div className='flex justify-end'> 
              <div className="w-36">
                <Image src={logoSena} alt="" className="" />
              </div>
            </div>
            <div>
              <div className='font-inter font-normal flex justify-center'>
                <div className='rounded-md relative' style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}>
                  <p className='text-xl text-left px-4 py-0'>
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
  );
}