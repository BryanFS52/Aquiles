'use client';

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Íconos dinámicos
const IconFichas = dynamic(() => import('react-icons/fa').then(mod => mod.FaRegListAlt), { ssr: false });
const IconProgramas = dynamic(() => import('react-icons/fa').then(mod => mod.FaLaptopCode), { ssr: false });
const IconAsistencia = dynamic(() => import('react-icons/bs').then(mod => mod.BsPersonFillCheck), { ssr: false });
const IconTeams = dynamic(() => import('react-icons/hi2').then(mod => mod.HiUserGroup), { ssr: false });
const IconSustentaciones = dynamic(() => import('react-icons/fa6').then(mod => mod.FaChalkboardUser), { ssr: false });
const IconJustificaciones = dynamic(() => import('react-icons/gi').then(mod => mod.GiNotebook), { ssr: false });
const IconProfesor = dynamic(() => import('react-icons/fa').then(mod => mod.FaChalkboardTeacher), { ssr: false });
const IconAprendices = dynamic(() => import('react-icons/pi').then(mod => mod.PiStudentFill), { ssr: false });

// Configuración de menú por rol
const MENU_CONFIG = {
    instructor: [
        { href: "/dashboard/FichasInstructor", label: "Fichas", icon: <IconFichas className='text-2xl' /> },
        { href: "/dashboard/Programas", label: "Programas", icon: <IconProgramas className='text-2xl' /> },
        { href: "/dashboard/asistencia", label: "Asistencia", icon: <IconAsistencia className='text-2xl' /> },
        { href: "/dashboard/teamScrum", label: "Teams", icon: <IconTeams className='text-2xl' /> },
        { href: "/dashboard/ListaChequeoInstructor", label: "Sustentaciones", icon: <IconSustentaciones className='text-2xl' /> },
        { href: "/dashboard/justificaciones", label: "Justificaciones", icon: <IconJustificaciones className='text-2xl' /> },
    ],
    aprendiz: [
        { href: "/dashboard/FichaAprendiz", label: "Ficha", icon: <IconFichas className='text-2xl' /> },
        { href: "/dashboard/asistenciaAprendiz", label: "Asistencia", icon: <IconAsistencia className='text-2xl' /> },
        { href: "/dashboard/teamScrumAprendiz", label: "Team", icon: <IconTeams className='text-2xl' /> },
        { href: "/dashboard/ListaChequeoAprendiz", label: "Sustentaciones", icon: <IconSustentaciones className='text-2xl' /> },
        { href: "/dashboard/justificacionesAprendiz", label: "Justificaciones", icon: <IconJustificaciones className='text-2xl' /> },
    ],
    coordinador: [
        { href: "/dashboard/FichasCoordinador", label: "Fichas", icon: <IconFichas className='text-2xl' /> },
        { href: "/dashboard/InstructoresCoordinador", label: "Instructores", icon: <IconProfesor className='text-2xl' /> },
        { href: "/dashboard/ProgramasCoordinador", label: "Programas", icon: <IconProgramas className='text-2xl' /> },
        { href: "/dashboard/ListaChequeoCoordinador", label: "Sustentaciones", icon: <IconSustentaciones className='text-2xl' /> },
        { href: "/dashboard/justificacionesCoordinador", label: "Justificaciones", icon: <IconJustificaciones className='text-2xl' /> },
        { href: "/dashboard/Aprendices", label: "Aprendices", icon: <IconAprendices className='text-2xl' /> },

    ]
};

const getMenuByRole = (role) => {
    if (!role) return [];
    if (role.toLowerCase().includes('coordinador')) return MENU_CONFIG.coordinador;
    if (role.toLowerCase().includes('instructor')) return MENU_CONFIG.instructor;
    if (role.toLowerCase().includes('aprendiz')) return MENU_CONFIG.aprendiz;
    return [];
};

export const Sidebar = ({ role: initialRole }) => {
    const [showMenu, setShowMenu] = useState(false);
    // Selector temporal de rol para desarrollo
    const [role, setRole] = useState(initialRole || 'instructor');

    const menuItems = useMemo(() => getMenuByRole(role), [role]);

    // Cierra el menú al navegar en móvil
    const handleLinkClick = () => {
        if (window.innerWidth < 1024) setShowMenu(false);
    };

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowMenu(false)}
            />
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-[90vw] max-w-xs sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-[300px]
                    bg-white/95 dark:bg-gradient-to-b dark:from-shadowBlue dark:to-darkBlue
                    shadow-2xl transition-transform duration-300
                    ${showMenu ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:shadow-none
                    flex flex-col justify-between
                    border-r border-darkGreen/10 dark:border-shadowBlue/30
                `}
            >
                <div className="p-5 sm:p-7">
                    {/* Selector temporal de rol (solo para pruebas/desarrollo) */}

                    {/* LOGO */}
                    <div className="flex items-center gap-4 mb-8">
                        <Image src="/img/LogoAquilesWhite.png" alt="Logo Aquiles" width={80} height={80} className='bg-green-600 drop-shadow-xl pl-2 py-1 w-[80px] h-[80px] rounded-2xl border-2 border-darkGreen/30 dark:border-shadowBlue/40 dark:bg-darkBlue/80' />
                        <span className="text-lg font-bold text-darkBlue dark:text-white tracking-wide drop-shadow-md leading-tight">
                            PROYECTOS FORMATIVOS<br />
                            <span className="uppercase text-[13px] text-darkGreen dark:text-shadowBlue font-extrabold tracking-widest">{role}</span>
                        </span>
                    </div>
                    <div className="mb-8 flex items-center justify-center">
                        <div className="bg-gradient-to-r from-darkGreen/90 to-shadowBlue/90 dark:from-shadowBlue/90 dark:to-darkBlue/90 rounded-xl shadow px-4 py-2 flex gap-2 items-center text-sm font-semibold text-white backdrop-blur-md border border-white/20">
                            <span className="font-bold tracking-wide drop-shadow">Rol:</span>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="rounded-lg px-3 py-1 border-2 border-white/30 bg-white/90 dark:bg-darkBlue/80 text-darkBlue dark:text-white font-bold shadow focus:outline-none focus:ring-2 focus:ring-darkGreen/60 transition-all duration-200"
                            >
                                <option value="instructor">Instructor</option>
                                <option value="aprendiz">Aprendiz</option>
                                <option value="coordinador">Coordinador</option>
                            </select>
                        </div>
                    </div>
                    {/* Menú dinámico */}
                    <nav>
                        <ul className="space-y-2">
                            {menuItems.map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 py-2 px-3 rounded-xl transition-all text-base
                                            text-darkBlue dark:text-white
                                            bg-white/70 dark:bg-shadowBlue/50
                                            hover:bg-lightGreen/80 dark:hover:bg-darkGreen/70
                                            hover:text-white dark:hover:text-lightGreen
                                            font-semibold group shadow-sm hover:shadow-lg border border-darkGreen/10 dark:border-shadowBlue/30
                                            duration-200"
                                        onClick={handleLinkClick}
                                    >
                                        <span className="transition-transform group-hover:scale-125 text-2xl drop-shadow">{item.icon}</span>
                                        <span className="tracking-wide text-base font-semibold">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
            {/* Botón toggle para móvil */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className='fixed bottom-4 right-4 z-50 text-white bg-gradient-to-br from-darkGreen to-shadowBlue p-3 text-2xl rounded-full shadow-2xl border-2 border-white/30 lg:hidden transition-all duration-200 hover:scale-110 active:scale-95'
                aria-label="Abrir menú"
            >
                {showMenu ? <IoClose /> : <FiAlignRight />}
            </button>
        </>
    );
};