'use client';

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ButtonTheme from "@components/ButtonTheme";

// Íconos dinámicos
const IconFichas = dynamic(() => import('react-icons/fa').then(mod => mod.FaRegListAlt), { ssr: false });
const IconProgramas = dynamic(() => import('react-icons/fa').then(mod => mod.FaLaptopCode), { ssr: false });
const IconAsistencia = dynamic(() => import('react-icons/bs').then(mod => mod.BsPersonFillCheck), { ssr: false });
const IconTeams = dynamic(() => import('react-icons/hi2').then(mod => mod.HiUserGroup), { ssr: false });
const IconSustentaciones = dynamic(() => import('react-icons/fa6').then(mod => mod.FaChalkboardUser), { ssr: false });
const IconJustificaciones = dynamic(() => import('react-icons/gi').then(mod => mod.GiNotebook), { ssr: false });
const IconProfesor = dynamic(() => import('react-icons/fa').then(mod => mod.FaChalkboardTeacher), { ssr: false });
const IconAprendices = dynamic(() => import('react-icons/pi').then(mod => mod.PiStudentFill), { ssr: false });

export const Sidebar = ({ role }) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => setShowMenu(!showMenu);

    const menuItems = useMemo(() => {
        // Todos los items del menú sin importar el rol
        return [
            // Items de Instructor
            { href: "/dashboard/FichasInstructor", label: "Fichas Instructor", icon: <IconFichas className='text-2xl' /> },
            { href: "/dashboard/Programas", label: "Programas", icon: <IconProgramas className='text-2xl' /> },
            { href: "/dashboard/asistencia", label: "Asistencia", icon: <IconAsistencia className='text-2xl' /> },
            { href: "/dashboard/teamScrum", label: "Teams", icon: <IconTeams className='text-2xl' /> },
            { href: "/dashboard/ListaChequeoInstructor", label: "Sustentaciones Instructor", icon: <IconSustentaciones className='text-2xl' /> },
            { href: "/dashboard/justificaciones", label: "Justificaciones", icon: <IconJustificaciones className='text-2xl' /> },

            // Items de Aprendiz
            { href: "/dashboard/FichaAprendiz", label: "Ficha Aprendiz", icon: <IconFichas className='text-2xl' /> },
            { href: "/dashboard/asistenciaAprendiz", label: "Asistencia Aprendiz", icon: <IconAsistencia className='text-2xl' /> },
            { href: "/dashboard/teamScrumAprendiz", label: "Team Aprendiz", icon: <IconTeams className='text-2xl' /> },
            { href: "/dashboard/ListaChequeoAprendiz", label: "Sustentaciones Aprendiz", icon: <IconSustentaciones className='text-2xl' /> },
            { href: "/dashboard/justificacionesAprendiz", label: "Justificaciones Aprendiz", icon: <IconJustificaciones className='text-2xl' /> },

            // Items de Coordinador
            { href: "/dashboard/FichasCoordinador", label: "Fichas Coordinador", icon: <IconFichas className='text-2xl' /> },
            { href: "/dashboard/InstructoresCoordinador", label: "Instructores", icon: <IconProfesor className='text-2xl' /> },
            { href: "/dashboard/ProgramasCoordinador", label: "Programas Coordinador", icon: <IconProgramas className='text-2xl' /> },
            { href: "/dashboard/ListaChequeoCoordinador", label: "Sustentaciones Coordinador", icon: <IconSustentaciones className='text-2xl' /> },
            { href: "/dashboard/justificacionesCoordinador", label: "Justificaciones Coordinador", icon: <IconJustificaciones className='text-2xl' /> },
            { href: "/dashboard/Aprendices", label: "Aprendices", icon: <IconAprendices className='text-2xl' /> },
        ];
    }, []);

    return (
        <div className="grid grid-flow-row font-inter">
            <div className="flex relative">
                <div className={`min-h-screen h-full overflow-y-auto fixed xl:static bg-green-gradient dark:bg-blue-gradient w-4/5 md:w-2/5 lg:w-1/3 xl:w-auto border-r border-gray-300 xl:border-r-0 top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>

                    <div>
                        {/* LOGO */}
                        <div className="flex items-center mb-10">
                            <Image src="/img/LogoAquilesWhite.png" alt="Logo Aquiles" width={96} height={96} />
                            <span className="text-xs font-inter text-grayText">
                                PROYECTOS FORMATIVOS (C.S.F.) {role?.toUpperCase()}
                            </span>
                        </div>

                        {/* Menú con todos los items */}
                        <ul className="text-grayText">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-4 py-3 px-4 hover:bg-darkGreen dark:hover:bg-shadowBlue rounded-xl transition-colors"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Botón de tema */}
                    <ul>
                        <ButtonTheme />
                    </ul>
                </div>

                {/* Botón toggle para móvil */}
                <button
                    onClick={toggleMenu}
                    className='text-white bg-darkBlue dark:bg-shadowBlue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden z-50'
                >
                    {showMenu ? <IoClose /> : <FiAlignRight />}
                </button>
            </div>
        </div>
    );
};