'use client';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FiAlignRight } from "react-icons/fi";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import logoAquiles from "../../public/img/logoAquiles.png";
import LogoAquilesWhite from "../../public/img/LogoAquilesWhite.png";

// Importación dinámica de íconos para mejorar la carga inicial
const IconFicha = dynamic(() => import('react-icons/fa').then((mod) => mod.FaRegListAlt), { ssr: false });
const IconAsistencia = dynamic(() => import('react-icons/bs').then((mod) => mod.BsPersonFillCheck), { ssr: false });
const IconTeam = dynamic(() => import('react-icons/hi2').then((mod) => mod.HiUserGroup), { ssr: false });
const IconSustentaciones = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaChalkboardUser), { ssr: false });
const IconJustificaciones = dynamic(() => import('react-icons/gi').then((mod) => mod.GiNotebook), { ssr: false });
const IconConfiguracion = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaGear), { ssr: false });
const IconCerrarSesion = dynamic(() => import('react-icons/io').then((mod) => mod.IoMdLogOut), { ssr: false });

export const Sidebaraprendiz = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className={`xl:h-[100vh] overflow-y-auto fixed xl:static bg-[#00324d] w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto border-r border-gray-300 h-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
            <div>
                {/* LOGO */}
                <div className="flex items-center mb-10 space-x-0">
                    <Image src={LogoAquilesWhite} alt="Logo Aquiles" className="w-24" />
                    <span className="text-xs font-inter">PROYECTOS FORMATIVOS (C.S.F.) APRENDIZ</span>
                </div>

                <ul className='text-white'>
                    <li>
                        <Link href="/FichaAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <IconFicha className='text-2xl' />
                            Ficha
                        </Link>
                    </li>
                    <li>
                        <Link href="/asistenciaAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <IconAsistencia className='text-2xl' />
                            Asistencia
                        </Link>
                    </li>
                    <li>
                        <Link href="/teamScrumAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <IconTeam className='text-2xl' />
                            Team
                        </Link>
                    </li>
                    <li>    
                        <Link href="/ListaChequeoAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <IconSustentaciones className='text-2xl' />
                            Sustentaciones
                        </Link>
                    </li>
                    <li>
                        <Link href="/justificacionesAprendiz" className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                            <IconJustificaciones className='text-2xl' />
                            Justificaciones
                        </Link>
                    </li>
                </ul>
            </div>
            <ul>
                <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                    <IconConfiguracion className='text-2xl' />
                    Configuración
                </li>
                <li className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                    <IconCerrarSesion className='text-2xl' />
                    Cerrar Sesión
                </li>
            </ul>
            {/* Botón para togglear el menú */}
            <button onClick={toggleMenu} className='text-white bg-custom-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>
                {showMenu ? <IoClose /> : <FiAlignRight />}
            </button>
        </div>
    );
};
