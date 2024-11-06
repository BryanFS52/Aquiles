"use client";

import React, { useState } from 'react'; 
import Link from "next/link";
import { HiLockClosed } from "react-icons/hi";
import { BsPersonCircle } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import Image from "next/image";
import logoSena from "../public/img/LogoSena.png";
import LogoAquiles from "../public/img/LogoAquiles.png";
import LogoAquilesDarkBlue from "../public/img/LogoAquilesDarkBlue.png";
import ModalOlvidoContraseña from "../app/components/Modals/modalOlvidoContraseña";
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Asegúrate de importar axios

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

      // Verifica que la respuesta contenga datos antes de intentar acceder a ellos
      if (response.data && response.data.data) {
          const { redirectUrl, rol } = response.data.data;
          localStorage.setItem('userRole', rol);
          window.location.href = redirectUrl; // Redirige a la URL proporcionada
      } else {
          throw new Error("No se recibió la URL de redirección");
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setError('Error al iniciar sesión: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="font-inter w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-full h-full flex justify-between items-center">
        <div className="xl:w-1/2 h-full flex justify-center items-center sm:w-full">
          <div className="xl:w-1/2 p-5">
            <div className="flex items-center mb-3 space-x-2">
              <Image src={LogoAquilesDarkBlue} alt="Logo Aquiles" className="w-36" />
              <div className="font-inter flex flex-col px-2 text-custom-blue">
                <h1 className="text-4xl font-medium ">Aquiles</h1>
                <p className="text-[13px] font-light">
                Sistema de Gestión de Asistencia y Seguimiento para Proyectos de Aprendices
                </p>
              </div>
            </div>
            <div className="font-inter text-custom-blue pt-10">
              <h1 className="text-4xl">Inicia Sesión</h1>
              <p className="text-base pt-5">
                ¡Bienvenido de Vuelta!
                <br />
                Inicia Sesión para Acceder a tu Cuenta.
              </p>
            </div>

            {error && (
              <div className="text-red-500 mt-4">
                {error}
              </div>
            )}

            <div className="mt-20">
              <form onSubmit={handleLogin}>
                <div className="flex flex-col items-center">
                  <div className="font-inter font-normal flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiMiniIdentification className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      className="outline-none text-sm w-full h-9 text-custom-blue"
                      required // Asegura que se seleccione un tipo de documento
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

                  <div className="font-inter font-normal flex items-center w-full mt-4 rounded border-solid border-2 text-custom-blue">
                    <BsPersonCircle className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input 
                      value={formData.documentNumber} 
                      type="text" 
                      name="documentNumber" 
                      placeholder='Documento' 
                      className='outline-none text-sm w-full h-9 text-custom-blue'
                      onChange={handleChange}
                      required // Asegura que el número de documento sea obligatorio
                    />
                  </div> 

                  <div className="font-inter font-normal flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiLockClosed className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input 
                      value={formData.password} 
                      type="password" 
                      name="password" 
                      placeholder='Contraseña' 
                      className='outline-none text-sm w-full h-9 text-[#0e324d]'
                      onChange={handleChange}
                      required // Asegura que la contraseña sea obligatoria
                    />
                  </div>
                </div>
                <div className="font-inter font-normal flex justify-between mt-4 items-center text-[#0e324d]">
                  <div className="flex text-center">
                  </div>
                  <div className="text-sm">
                    <Link href="">
                      <p className='hover:text-custom-blues' onClick={handleOpenModal}>¿Olvidó su contraseña?</p>
                    </Link>
                    <ModalOlvidoContraseña isOpen={modalOpen} onClose={handleCloseModal}/>
                  </div>
                </div>

                <button 
                  className='font-inter font-semibold bg-[#0e324d] w-full p-2 text-white rounded mt-20 hover:bg-[#01b001] transition-colors duration-300' 
                  type='submit'
                >
                  Iniciar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-[70%] justify-center items-center bg-cover bg-center h-screen hidden xl:block" style={{ backgroundImage: "url('/img/fondo-login.png')"}}>
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
                  <p className='text-xl text-left px-4 py-4'>
                      ¡Únete a la comunidad educativa del SENA y <br />
                      potencia tu futuro! Regístrate ahora para <br />
                      acceder a una amplia gama de programas de <br />
                      formación y oportunidades de crecimiento <br />
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
    </div>
  );
}
