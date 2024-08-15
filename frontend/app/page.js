"use client";

import React, { useState } from 'react'; 
import Link from "next/link";
import { HiLockClosed } from "react-icons/hi";
import { BsPersonCircle } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import Image from "next/image";
import logoSena from "../public/img/LogoSena.png";
import LogoAquiles from "../public/img/LogoAquiles.png";
import ModalOlvidoContraseña from "../app/components/Modals/modalOlvidoContraseña";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    password: ''
  });
  const [error, setError] = useState(null); // Añadido estado para errores
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

  const getCsrfToken = async () => {
    try {
      const response = await axios.get('/api/csrf-token');
      return response.data.csrfToken; // Ajusta esto según la estructura de tu respuesta
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error.message);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = await getCsrfToken();

      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        }
      });
      console.log('Respuesta del servidor:', response.data);
      router.push('/home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setError('Error al iniciar sesión: ' + error.message); // Utilizar setError aquí
    }
  };

  return (
		<div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-full h-full flex justify-between items-center">
        <div className="xl:w-1/2 h-full flex justify-center items-center sm:w-full">
          <div className="xl:w-1/2 p-5">
            <div className="flex items-center mb-8">
              <Image src={LogoAquiles} alt="TDA Logo" className="w-28" />
              <div className="flex flex-col px-2 text-custom-blue">
                <h1 className="text-3xl font-medium ">TDA</h1>
                <p className="text-[11px] font-light">
                  Transformando el futuro con las nuevas habilidades del SENA.
                </p>
              </div>
            </div>
						<div className="text-custom-blue pt-10">
							<h1 className="text-4xl">Inicia Sesión</h1>
							<p className="text-base pt-5">
								¡Bienvenido de vuelta!
								<br />
								Por favor, inicia sesión para acceder a tu cuenta.
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
                  <div className="flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiMiniIdentification className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      className="outline-none text-sm w-full h-9 text-custom-blue"
                    >
                      <option value="">Tipo de documento</option>
                      <option value="CC">Cédula de Ciudadania</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="CE">Cédula Extranjería</option>
                      <option value="PP">Pasaporte</option>
                      <option value="PEP">Permiso Especial de Permanencia</option>
                      <option value="PPT">Permiso de Protección Temporal</option>
                    </select>
                  </div>

                  <div className="flex items-center w-full mt-4 rounded border-solid border-2 text-custom-blue">
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

                  <div className="flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiLockClosed className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input 
                      value={formData.password} 
                      type="password" 
                      name="password" 
                      placeholder='Contraseña' 
                      className='outline-none text-sm w-full h-9 text-custom-blue'
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4 items-center text-custom-blue">
                  <div className="flex text-center">
                    <input type="checkbox" className='mr-2'/>
                    <label htmlFor="" className='text-xs'>Recordar</label>
                  </div>
                  <div className="text-xs">
                    <Link href="">
                      <p className='hover:text-custom-blues' onClick={handleOpenModal}>¿Olvidó su contraseña?</p>
                    </Link>
                    <ModalOlvidoContraseña isOpen={modalOpen} onClose={handleCloseModal}/>
                  </div>
                </div>

                <button 
                  className='bg-custom-blue w-full p-2 text-white font-medium rounded mt-20 hover:bg-custom-blues' 
                  type='submit'
                >
                  Iniciar Sesion
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
                <div className='flex justify-center'>
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
                <div className='flex items-center justify-end'>
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
