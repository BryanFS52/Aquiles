'use client';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import LogoAquilesWhite from "../../public/img/LogoAquilesWhite.png";

// Importación dinámica de íconos para mejorar la carga inicial
const IconFichas = dynamic(() => import('react-icons/fa').then((mod) => mod.FaRegListAlt), { ssr: false });
const IconProgramas = dynamic(() => import('react-icons/fa').then((mod) => mod.FaLaptopCode), { ssr: false });
const IconAsistencia = dynamic(() => import('react-icons/bs').then((mod) => mod.BsPersonFillCheck), { ssr: false });
const IconTeams = dynamic(() => import('react-icons/hi2').then((mod) => mod.HiUserGroup), { ssr: false });
const IconSustentaciones = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaChalkboardUser), { ssr: false });
const IconAprendices = dynamic(() => import('react-icons/pi').then((mod) => mod.PiStudentFill), { ssr: false });
const IconJustificaciones = dynamic(() => import('react-icons/gi').then((mod) => mod.GiNotebook), { ssr: false });
const IconConfiguracion = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaGear), { ssr: false });
const IconCerrarSesion = dynamic(() => import('react-icons/io').then((mod) => mod.IoMdLogOut), { ssr: false });

export const Sidebar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // Lista de enlaces de menú
    const menuItems = useMemo(() => [
        { href: "/FichasInstructor", label: "Fichas", icon: <IconFichas className='text-2xl' /> },
        { href: "/Programas", label: "Programas", icon: <IconProgramas className='text-2xl' /> },
        { href: "/asistencia", label: "Asistencia", icon: <IconAsistencia className='text-2xl' /> },
        { href: "/teamScrum", label: "Teams", icon: <IconTeams className='text-2xl' /> },
        { href: "/ListaChequeoInstructor", label: "Sustentaciones", icon: <IconSustentaciones className='text-2xl' /> },
        { href: "/Aprendices", label: "Aprendices", icon: <IconAprendices className='text-2xl' /> },
        { href: "/justificaciones", label: "Justificaciones", icon: <IconJustificaciones className='text-2xl' /> },
    ], []);

    return (
        <div className={`xl:h-[100vh] overflow-y-scroll fixed xl:static bg-[#0e324b] w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto border-r-0 border-gray-300 h-full -left-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
            <div>
                {/* LOGO */}
                <div className="flex items-center mb-10 space-x-0">
                    <Image src={LogoAquilesWhite} alt="Logo Aquiles" className="w-24" />
                    <span className="text-xs font-inter">PROYECTOS FORMATIVOS (C.S.F.) INSTRUCTOR</span>
                </div>

                <ul className='text-white'>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className='flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
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
            <button onClick={toggleMenu} className='text-white bg-custom-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>
                {showMenu ? <IoClose /> : <FiAlignRight />}
            </button>
        </div>
    );
};
