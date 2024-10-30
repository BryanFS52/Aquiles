'use client'
import Link from 'next/link';
import React, { useState,  } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";
import { FaLaptopCode } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { TfiBlackboard } from "react-icons/tfi";
import { IoSettings } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import { GiNotebook } from "react-icons/gi";
import { FaChalkboardUser } from "react-icons/fa6";
// import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import Image from 'next/image';
import logoSena from "../../public/img/Logo-sena-green.png";
import logoAquiles from "../../public/img/logoAquiles.png"

export const Sidebaraprendiz = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className={`xl:h-[100vh] overflow-y-auto fixed xl:static bg-[#00324d] w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto border-r border-gray-300 h-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
        <div>
            {/*LOGO*/}
            <div className="flex items-center mb-10 space-x-5">
                <Image src={logoAquiles} alt="Logo Aquiles" className="w-14" />
                <span className="text-xs font-inter">PROYECTOS FORMATIVOS (C.S.F.) APRENDIZ </span>
            </div>

            <ul className='text-white'>

                    <li>
                            <Link href="/FichaAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <IoPersonSharp className='text-2xl' />
                                Ficha
                            </Link>
                        </li>

                    <li>
                            <Link href="/asistenciaAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <BsPersonCheck className='text-2xl' />
                                Asistencia
                            </Link>
                        </li>

                        <li>
                            <Link href="/teamScrumAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <HiUserGroup className='text-2xl' />
                                Team
                            </Link>
                        </li>
                        
                        <li>
                        <Link href="/listaChequeoAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <FaChalkboardUser className='text-2xl' />
                            Sustentaciones
                        </Link>
                        </li>

                        <li>
                        <Link href="/justificacionesAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <GiNotebook className='text-2xl' />
                            Justificaciones
                        </Link>
                        </li>

                    </ul>
                </div>
                <ul>
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> 
                        <FaGear className='text-2xl' />
                        Configuración 
                    </li>
                    
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                        <IoMdLogOut className='text-2xl' />
                        Cerrar Sesión
                    </li>
                    
                </ul>
                   {/* bton */}
                    <button onClick={toggleMenu} className='text-white bg-custom-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>

                        {showMenu ? <IoClose/> : <FiAlignRight/>}
                    </button>
            </div>
    );
}; 