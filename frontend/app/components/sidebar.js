'use client'
import Link from 'next/link';
import React, { useState,  } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";
import { FaLaptopCode } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { TfiBlackboard } from "react-icons/tfi";
import { GiNotebook } from "react-icons/gi";
import { IoSettings } from "react-icons/io5";
// import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import Image from 'next/image';
import logoSena from "../../public/img/Logo-sena-green.png";

export const Sidebar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
            <div className={`xl:h-[100vh] overflow-y-scroll fixed xl:static bg-custom-blue w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto border-r border-gray-300 h-full -left-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
                <div>
                    {/*LOGO*/}
                    <div className="flex items-center mb-10 space-x-5">
                        <Image src={logoSena} alt="Logo Sena" className="w-11
                        " />
                        <span className="text-s">PROYECTOS FORMATIVOS (C.S.F.) </span>
                    </div>

                    <ul className='text-white'>
                        
                        
                        <li>
                            <Link href="/fichasasignadas" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <IoPersonSharp/>
                                Fichas
                            </Link>
                        </li>

                        <li>
                            <Link href="/inventario" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <FaLaptopCode />
                                Programas
                            </Link>
                        </li>

                        <li>
                            <Link href="/asistencia" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <BsPersonCheck />
                                Asistencia
                            </Link>
                        </li>

                        <li>
                            <Link href="#" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <HiUserGroup  />
                                Teams
                            </Link>
                        </li>

                        <li>
                            <Link href="/home" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <TfiBlackboard />
                                Proyectos
                            </Link>
                        </li>

                        <li>
                            <Link href="/justificaciones" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <GiNotebook/>
                                Justificaciones
                            </Link>
                        </li>

                        <li>
                            <Link href="/aprendicelist" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <PiStudentFill  />
                                Aprendices
                            </Link>
                        </li>
                    </ul>
                </div>

                <ul>
                    {/* <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> <img src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg" className='w-6 h-6 object-cover rounded-full' />
                        <RiCheckboxBlankCircleFill className='absolute text-green-600 left-16 translate-y-2 text-xs'/>
                        Usuario
                    </li>  */}
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> <IoMdLogOut />
                        Cerrar Sesión
                    </li>
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> <IoSettings/>
                        Configuración 
                    </li>

                </ul>
                   {/* bton */}
                    <button onClick={toggleMenu} className='text-white bg-custom-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>

                        {showMenu ? <IoClose/> : <FiAlignRight/>}
                    </button>
            </div>
    );
}; 