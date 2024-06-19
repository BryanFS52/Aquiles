'use client'
import Link from 'next/link';
import React, { useState,  } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { FaHome,FaDesktop, FaPowerOff } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { FaTableList } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { FaPersonChalkboard } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Image from 'next/image';
import logoSena from "../../public/img/LogoSena.png";


export const Sidebar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
            <div className={`xl:h-[100vh] overflow-y-scroll fixed xl:static bg-custom-blue w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto border-r border-gray-300 h-full -left-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
                <div>
                    {/*LOGO*/}
                    <div className="flex items-center mb-10">
                        <Image src={logoSena} alt="Logo Sena" className="w-20" />
                        <span className="text-2xl">SENA Stock</span>
                    </div>

                    <ul className='text-white'>
                        
                        <li>
                            <Link href="/home" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <FaHome/>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/inventario" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <MdInventory/>
                                Inventario
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <FaTableList/>
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <FaDesktop />
                                Articles
                            </Link>
                        </li>
                        <li>
                            <Link href="/roles" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                <FaPersonChalkboard />
                                roles
                            </Link>
                        </li>
                    </ul>
                </div>
                <ul>
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> <img src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg" className='w-6 h-6 object-cover rounded-full' />
                        <RiCheckboxBlankCircleFill className='absolute text-green-600 left-16 translate-y-2 text-xs'/>
                        Usuario
                    </li>
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> <IoSettings/>
                        Configuracion 
                    </li>
                    <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> <FaPowerOff/>
                        Cerrar Sesion
                    </li>

                </ul>
                   {/* bton */}
                    <button onClick={toggleMenu} className='text-white bg-sena-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>

                        {showMenu ? <IoClose/> : <FiAlignRight/>}
                    </button>
            </div>
    );
}; 
