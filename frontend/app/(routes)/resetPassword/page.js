"use client";

import React, { useState } from 'react'; 
import { HiLockClosed } from "react-icons/hi";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import logoSena from "../../../public/img/LogoSena.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle password reset logic here
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-full h-full flex justify-between items-center">
      <div className="w-[50%] justify-center items-center bg-cover bg-center h-screen hidden xl:block" style={{ backgroundImage: "url('/img/restorePassword.png')" }}>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 h-full flex flex-col justify-between p-10 text-center text-white">
              <div className='flex justify-end '> 
                <div className="w-36">
                 
                </div>
              </div>
              <div>
                <div className='flex justify-center'>
                  <div className='rounded-md relative' style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}>
                  </div>
                </div>
                <div className='flex items-center justify-end'>
                  <div>
                    <span className='text-xs'>Restablecer Contraseña </span>
                  </div>
                </div>
              </div>
            </div>     
          </div>   
        </div> 
        <div className="xl:w-1/2 h-full flex justify-center items-center sm:w-full">
          <div className="xl:w-1/2 p-5">
            <div className="flex items-center">
              <div className="flex flex-col px-2 text-custom-blue">
                <h1 className="text-3xl font-medium">TDA</h1>
                <p className="text-[11px] font-light">
                  Transformando el futuro con las nuevas habilidades del SENA.
                </p>
              </div>
            </div>
            <div className="text-custom-blue pt-10">
              <h1 className="text-4xl">Restablecer Contraseña</h1>
              <p className="text-2xl pt-5">
                Crea una nueva contraseña segura. 
              </p>
              <p className="text-base pt-3">
              Elige una contraseña nueva que cumpla con todos los requisitos de seguridad y que no hayas utilizado en otros sitios web.
              </p>
            </div>
            <div className="mt-20">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiLockClosed className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Nueva contraseña"
                      className="outline-none text-sm w-full h-9 text-[#0E324D]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                      <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className={`mx-3 w-5 h-5 cursor-pointer transition-colors duration-300 ${
                            showPassword ? 'text-[#3da900]' : 'text-[#0E324D]' 
                          }`}
                          onClick={handleTogglePassword}
                        />
                  </div>
                  <div className="flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiLockClosed className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      className="outline-none text-sm w-full h-9 text-[#0E324D]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                      <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            className={`mx-3 w-5 h-5 cursor-pointer transition-colors duration-300 ${
                              showConfirmPassword ? 'text-[#3da900]' : 'text-[#0E324D]'  
                            }`}
                            onClick={handleToggleConfirmPassword}
                          />
                  </div>
                </div>
                <button
                  className="bg-custom-blue w-full p-2 text-white font-medium rounded mt-20 hover:bg-custom-blues  transition-colors duration-300 dark:focus:ring-custom-blue"
                  type="submit"
                >
                  Confirmar 



                </button>
              </form>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
}