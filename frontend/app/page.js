'use client'

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faLink } from '@fortawesome/free-solid-svg-icons';
import { MdOutlineNumbers } from "react-icons/md";
import { HiIdentification } from "react-icons/hi";
import Image from 'next/image';
import logo from "../public/img/logo.png";
import logoSena from "../public/img/LogoSena.png";


export default function Login() {


    return (
        <div className="w-screen h-screen flex justify-center items-center bg-white">
          <div className="w-full h-full flex justify-between items-center"> 
            <div className="xl:w-1/2 h-full flex justify-center items-center sm:w-full">
                <div className="xl:w-1/2  p-5 sm:">
                    <div className="flex items-center">
                      <Image src={logo} alt="LogoEmpresa" className="w-10 h-auto"/>
                      <div className="flex flex-col px-2 text-custom-blue">
                        <h1 className="text-3xl font-medium ">Sena Stock</h1>
                        <p className="text-[6px] font-light">Transformando vidas, construyendo futuro.</p>
                      </div>
                    </div>
                    <div className="text-custom-blue pt-10">
                      <h1 className="text-4xl">Inicia Sesión</h1>
                      <p className="text-base pt-5">
                        ¡Bienvenido de vuelta! Por favor, inicia sesión para acceder a tu cuenta.
                      </p>
                    </div>
    
                    <div className="mt-20">
                        <form >
                          <div className="flex flex-col items-center">
                            <div className="flex items-center w-full mt-4 rounded border-solid border-2 ">
                              <HiIdentification className="w-4 mr-2 mx-3" />
                              <select name="select" className='outline-none text-sm w-full h-9 text-custom-blue'>
                                <option value="">Selecciona una opción</option>
                                <option value="cc">Cédula de Ciudadania</option>
                                <option value="ti">Tarjeta de Identidad</option>
                                <option value="pp">Cédula Extranjería</option>
                                <option value="pp">PEP</option>
                                <option value="pp">Permiso de Protección temporal</option>
                              </select>
                            </div>

                            <div className=" flex items-center w-full mt-4 rounded border-solid border-2 text-custom-blue">
                              <MdOutlineNumbers className="w-4 mr-2 mx-3" />
                              <input type="number" name="document" placeholder='Documento' className='outline-none text-sm w-full h-9 text-custom-blue' />
                            </div> 
    
                            <div className=" flex items-center w-full mt-4 rounded border-solid border-2 ">
                              <FontAwesomeIcon icon={faLock} className="w-4 mr-2 mx-3" />
                              <input type="password" name="password" placeholder='Contraseña' className='outline-none text-sm w-full h-9 text-custom-blue' />
                            </div>
                          </div>
                          <div className="flex justify-between mt-4 items-center text-custom-blue">
                            <div className="flex text-center	">
                              <input type="checkbox" className='mr-2'/>
                              <label htmlFor="" className='text-xs'>Recordar</label>
                              
                            </div>
                            <div className="text-xs ">
                              <Link href="" >
                                <p className='hover:text-custom-blues'>¿Olvido su contraseña?</p>
                              </Link>
                            </div>
                          </div>
    
                          <Link href="/home" passHref>
                            <button className='bg-custom-blue w-full p-2 text-white font-medium rounded mt-20 hover:bg-custom-blues' type='submit'>
                              Iniciar Sesion
                            </button>
                          </Link>
                        </form>
                    </div>
                </div>
            </div>
            <div className="w-1/2 justify-center items-center bg-cover bg-center h-screen hidden xl:block" style={{ backgroundImage: "url('/img/fondo1.jpg')"}}>
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between p-10 text-center text-white">
                      <div className='flex justify-end '> 
                        <div className="w-36">
                          <Image src={logoSena} alt="" className="" />
                        </div>
                      </div>
                      <div >
                        <div className='flex justify-center'>
                          <div className='rounded-md relative' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <p className='text-xl text-left px-4 py-4'>
                            ¡Únete a la comunidad educativa del SENA y <br />
                            potencia tu futuro! Regístrate ahora para <br />
                            acceder a una amplia gama de programas de <br />
                            formación y oportunidades de crecimiento <br />
                            profesional.</p>
                          </div>
                          
                          </div>
                          <div className='flex items-center justify-end'>
                            <div>
                              <Image src={logo} alt="LogoEmpresa" className="w-10 h-auto"/>
                          </div>
                          <div>
                            <span className='text-2xl'>Sena Stock</span>
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