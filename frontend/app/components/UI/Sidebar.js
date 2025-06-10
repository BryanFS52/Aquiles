'use client';

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { usePathname } from 'next/navigation';
import { FaRegListAlt, FaLaptopCode, FaChalkboardTeacher } from 'react-icons/fa';
import { BsPersonFillCheck } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi2';
import { FaChalkboardUser } from 'react-icons/fa6';
import { GiNotebook } from 'react-icons/gi';
import { PiStudentFill } from 'react-icons/pi';
import Image from 'next/image';

// Íconos estáticos
const IconFichas = <FaRegListAlt className='text-2xl' />;
const IconProgramas = <FaLaptopCode className='text-2xl' />;
const IconAsistencia = <BsPersonFillCheck className='text-2xl' />;
const IconTeams = <HiUserGroup className='text-2xl' />;
const IconSustentaciones = <FaChalkboardUser className='text-2xl' />;
const IconJustificaciones = <GiNotebook className='text-2xl' />;
const IconProfesor = <FaChalkboardTeacher className='text-2xl' />;
const IconAprendices = <PiStudentFill className='text-2xl' />;

// Configuración de menú por rol
const MENU_CONFIG = {
    instructor: [
        { href: "/dashboard/FichasInstructor", label: "Fichas", icon: IconFichas },
        { href: "/dashboard/Programas", label: "Programas", icon: IconProgramas },
        { href: "/dashboard/asistencia", label: "Asistencia", icon: IconAsistencia },
        { href: "/dashboard/teamScrum", label: "Teams", icon: IconTeams },
        { href: "/dashboard/ListaChequeoInstructor", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/justificaciones", label: "Justificaciones", icon: IconJustificaciones },
    ],
    aprendiz: [
        { href: "/dashboard/FichaAprendiz", label: "Ficha", icon: IconFichas },
        { href: "/dashboard/asistenciaAprendiz", label: "Asistencia", icon: IconAsistencia },
        { href: "/dashboard/teamScrumAprendiz", label: "Team", icon: IconTeams },
        { href: "/dashboard/ListaChequeoAprendiz", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/justificacionesAprendiz", label: "Justificaciones", icon: IconJustificaciones },
    ],
    coordinador: [
        { href: "/dashboard/FichasCoordinador", label: "Fichas", icon: IconFichas },
        { href: "/dashboard/InstructoresCoordinador", label: "Instructores", icon: IconProfesor },
        { href: "/dashboard/ProgramasCoordinador", label: "Programas", icon: IconProgramas },
        { href: "/dashboard/ListaChequeoCoordinador", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/justificacionesCoordinador", label: "Justificaciones", icon: IconJustificaciones },
        { href: "/dashboard/Aprendices", label: "Aprendices", icon: IconAprendices },
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
    const [role, setRole] = useState(initialRole || 'instructor');
    const menuItems = useMemo(() => getMenuByRole(role), [role]);
    const pathname = usePathname();

    // Cierra el menú al navegar en móvil
    const handleLinkClick = () => {
        if (window.innerWidth < 1024) setShowMenu(false);
    };

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`
                    fixed inset-0 bg-black/50 z-40 
                    transition-opacity duration-300 
                    lg:hidden 
                    ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setShowMenu(false)}
            />

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full 
                    w-[280px] sm:w-[300px]
                    lg:static lg:w-full lg:max-w-[300px]
                    bg-white/95 dark:bg-gradient-to-b dark:from-shadowBlue dark:to-darkBlue
                    shadow-2xl lg:shadow-none
                    transition-transform duration-300
                    ${showMenu ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    flex flex-col justify-between
                    border-r border-darkGreen/10 dark:border-shadowBlue/30
                `}
            >
                <div className="p-4 lg:p-6 xl:p-7 overflow-y-auto">
                    {/* LOGO */}
                    <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                        <Image
                            src="/img/LogoAquilesWhite.png"
                            alt="Logo Aquiles"
                            width={80}
                            height={80}
                            className='
                                bg-green-600 drop-shadow-xl pl-2 py-1 
                                w-[60px] h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[80px] xl:h-[80px]
                                rounded-2xl border-2 border-darkGreen/30 
                                dark:border-shadowBlue/40 dark:bg-darkBlue/80
                            '
                        />
                        <span className="
                            text-base lg:text-lg font-bold 
                            text-black dark:text-white 
                            tracking-wide drop-shadow-md leading-tight
                        ">
                            PROYECTOS FORMATIVOS<br />
                            <span className="
                                uppercase text-xs lg:text-[13px] 
                                text-darkGreen dark:text-lightGreen 
                                font-extrabold tracking-widest
                            ">
                                {role}
                            </span>
                        </span>
                    </div>

                    {/* Selector temporal de rol */}
                    <div className="mb-6 lg:mb-8 flex items-center justify-center">
                        <div className="
                            bg-gradient-to-r from-darkGreen/90 to-shadowBlue/90 
                            dark:from-shadowBlue/90 dark:to-darkBlue/90 
                            rounded-xl shadow px-3 lg:px-4 py-2 
                            flex gap-2 items-center 
                            text-sm font-semibold text-white 
                            backdrop-blur-md border border-white/20
                        ">
                            <span className="font-bold tracking-wide drop-shadow">Rol:</span>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="
                                    rounded-lg px-2 lg:px-3 py-1 
                                    border-2 border-white/30 
                                    bg-white/90 dark:bg-darkBlue/80 
                                    text-darkBlue dark:text-white 
                                    font-bold shadow text-sm
                                    focus:outline-none focus:ring-2 focus:ring-darkGreen/60 
                                    transition-all duration-200
                                "
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
                            {menuItems.map((item, idx) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <li key={idx}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 
                                                py-2.5 lg:py-3 px-3 lg:px-4
                                                rounded-xl transition-all 
                                                text-sm lg:text-base
                                                font-semibold group shadow-sm hover:shadow-lg 
                                                border border-darkGreen/10 dark:border-shadowBlue/30
                                                duration-200
                                                tracking-wide truncate
                                                relative overflow-hidden
                                                before:absolute before:inset-0 before:rounded-xl before:-z-10 before:opacity-0 before:transition-opacity before:duration-200
                                                hover:before:opacity-100
                                                ${isActive ? 'before:opacity-100' : ''}
                                                before:bg-gradient-to-r before:from-darkGreen before:to-lightGreen dark:before:from-[#1e3a8a] dark:before:to-[#2563eb]
                                                ${isActive ? 'border-l-4 border-darkGreen dark:border-blue-400 pl-5' : 'hover:border-l-4 hover:border-darkGreen dark:hover:border-blue-400 hover:pl-5'}
                                                text-darkBlue dark:text-white hover:text-white
                                                ${isActive ? 'text-white' : ''}
                                            `}
                                            onClick={handleLinkClick}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <span className="
                                                transition-transform group-hover:scale-125 
                                                text-xl lg:text-2xl drop-shadow flex-shrink-0
                                            ">
                                                {item.icon}
                                            </span>
                                            <span className="tracking-wide font-semibold truncate">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Botón toggle para móvil */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className='
                    fixed bottom-4 right-4 z-50 
                    text-white bg-gradient-to-br from-darkGreen to-shadowBlue 
                    p-3 text-2xl rounded-full shadow-2xl 
                    border-2 border-white/30 
                    lg:hidden 
                    transition-all duration-200 
                    hover:scale-110 active:scale-95
                '
                aria-label="Abrir menú"
            >
                {showMenu ? <IoClose /> : <FiAlignRight />}
            </button>
        </>
    );
};