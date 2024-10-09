'use client'
import Link from 'next/link';
import React, { useState, } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";
import { FaLaptopCode } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { TfiBlackboard } from "react-icons/tfi";
import { GiNotebook } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { FaChalkboardUser } from "react-icons/fa6";
// import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import Image from 'next/image';
import logoSena from "../../public/img/Logo-sena-green.png";

export const Sidebarcoordinador = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className={`xl:h-[100vh] overflow-y-scroll fixed xl:static bg-custom-blue w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto border-r-0 border-gray-300 h-full -left-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
            <div>
                {/*LOGO*/}
                <div className="flex items-center mb-10 space-x-5">
                    <Image src={logoSena} alt="Logo Sena" className="w-11
                        " />
                    <span className="text-xs font-inter">PROYECTOS FORMATIVOS (C.S.F.) COORDINADOR </span>
                </div>

                <ul className='text-white'>


                    <li>
                        <Link href="/FichasCoordinador" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <IoPersonSharp className='text-2xl' />
                            Fichas
                        </Link>
                    </li>

                    <li>
                        <Link href="/" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <FaLaptopCode className='text-2xl' />
                            Instructores
                        </Link>
                    </li>

                    <li>
                        <Link href="/" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <BsPersonCheck className='text-2xl' />
                            Listas de Chequeo
                        </Link>
                    </li>

                    <li>
                        <Link href="/" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <BsPersonCheck className='text-2xl' />
                            Jurados 
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
            <button onClick={toggleMenu} className='text-white bg-custom-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>

                {showMenu ? <IoClose /> : <FiAlignRight />}
            </button>
        </div>
    );
}; 