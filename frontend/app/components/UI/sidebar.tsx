'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    PiUsersDuotone,
    PiClipboardTextDuotone,
    PiUserCheckDuotone,
    PiUsersThreeDuotone,
    PiChalkboardDuotone,
    PiBookDuotone,
    PiChalkboardTeacherDuotone,
    PiStudentDuotone,
    PiClipboardDuotone,
    PiCirclesFourDuotone,
    PiListBulletsDuotone,
    PiCaretDoubleLeftDuotone,
    PiTargetDuotone,
    PiNotepadDuotone
} from "react-icons/pi";

import Link from 'next/link';
import Image from 'next/image';

// Tipos
interface MenuItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface MenuConfig {
    instructor: MenuItem[];
    aprendiz: MenuItem[];
    coordinador: MenuItem[];
}

interface SidebarProps {
    role?: string;
}

// Íconos estáticos
const IconFichas = <PiClipboardTextDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconProgramas = <PiCirclesFourDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconAsistencia = <PiUserCheckDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconTeams = <PiUsersThreeDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconSustentaciones = <PiChalkboardDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconJustificaciones = <PiBookDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconProfesor = <PiChalkboardTeacherDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconAprendices = <PiStudentDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconPlanesMejoramiento = <PiClipboardDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconCoordinaciones = <PiUsersDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconSeguimiento = <PiTargetDuotone className="w-6 h-6 text-black dark:text-dark-text" />;
const IconActas = <PiNotepadDuotone className="w-6 h-6 text-black dark:text-dark-text" />;

// Configuración de menú por rol
const MENU_CONFIG: MenuConfig = {
    instructor: [
        { href: "/dashboard/FichasInstructor", label: "Fichas", icon: IconFichas },
        { href: "/dashboard/teamScrum", label: "Teams", icon: IconTeams },
        { href: "/dashboard/InstructorSelection", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/planesMejoramientoInstructor", label: "P. Mejoramiento", icon: IconPlanesMejoramiento },
        { href: "/dashboard/InstructorFollowUp", label: "Seguimiento", icon: IconSeguimiento },
        { href: "/dashboard/actasInstructor", label: "Actas", icon: IconActas }
    ],
    aprendiz: [
        { href: "/dashboard/FichaAprendiz", label: "Ficha", icon: IconFichas },
        { href: "/dashboard/asistenciaAprendiz", label: "Asistencia", icon: IconAsistencia },
        { href: "/dashboard/teamScrumAprendiz", label: "Team", icon: IconTeams },
        { href: "/dashboard/ListaChequeoAprendiz", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/justificacionesAprendiz", label: "Justificaciones", icon: IconJustificaciones },
        { href: "/dashboard/planesMejoramientoAprendiz", label: "P. Mejoramiento", icon: IconPlanesMejoramiento },
    ],
    coordinador: [
        { href: "/dashboard/coordinacionesCoordinador", label: "Coordinaciones", icon: IconCoordinaciones },
        { href: "/dashboard/FichasCoordinador", label: "Fichas", icon: IconFichas },
        { href: "/dashboard/InstructoresCoordinador", label: "Instructores", icon: IconProfesor },
        { href: "/dashboard/ProgramasCoordinador", label: "Programas", icon: IconProgramas },
        { href: "/dashboard/ListaChequeoCoordinador", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/justificacionesCoordinador", label: "Justificaciones", icon: IconJustificaciones },
        { href: "/dashboard/Aprendices", label: "Aprendices", icon: IconAprendices },
    ]
};

const getMenuByRole = (role: string | undefined): MenuItem[] => {
    if (!role) return [];
    if (role.toLowerCase().includes('coordinador')) return MENU_CONFIG.coordinador;
    if (role.toLowerCase().includes('instructor')) return MENU_CONFIG.instructor;
    if (role.toLowerCase().includes('aprendiz')) return MENU_CONFIG.aprendiz;
    return [];
};

export const Sidebar: React.FC<SidebarProps> = ({ role: initialRole }) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const pathname = usePathname();
    const [isClientMounted, setIsClientMounted] = useState(false);
    const [role, setRole] = useState<string>(initialRole || "instructor");

    // Inicializar después del montaje del cliente
    useEffect(() => {
        setIsClientMounted(true);
        
        // Cargar rol desde localStorage solo después del montaje
        const savedRole = localStorage.getItem("sidebar-role");
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);

    // 🔹 Guardar rol en localStorage cada vez que cambie (solo en cliente)
    useEffect(() => {
        if (isClientMounted) {
            localStorage.setItem("sidebar-role", role);
        }
    }, [role, isClientMounted]);

    const menuItems: MenuItem[] = useMemo(() => getMenuByRole(role), [role]);

    const handleLinkClick = (): void => {
        if (window.innerWidth < 1024) setShowMenu(false);
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setRole(event.target.value);
    };

    const toggleMenu = (): void => {
        setShowMenu(!showMenu);
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-screen
          w-[280px] sm:w-[300px]
          lg:w-full lg:max-w-[300px]
          bg-white/95 dark:bg-gradient-to-b dark:from-dark-sidebar dark:to-dark-sidebarGradient
          shadow-2xl lg:shadow-none
          transition-transform duration-300
          ${showMenu ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          flex flex-col justify-between
          border-r border-darkGreen/10 dark:border-dark-border
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
                            className="bg-gradient-to-r from-lime-600 to-lime-500 drop-shadow-xl pl-2 py-1 
                         w-[60px] h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[80px] xl:h-[80px]
                         rounded-2xl border-2 border-darkGreen/30 
                         dark:from-dark-sidebar dark:to-shadowBlue"
                        />
                        <span className="text-base lg:text-lg font-bold text-black dark:text-dark-text tracking-wide drop-shadow-md leading-tight">
                            PROYECTOS FORMATIVOS<br />
                            <span className="text-xs lg:text-[13px] text-darkGreen dark:text-blue-300 font-extrabold tracking-widest">
                                {isClientMounted ? role : (initialRole || "instructor")}
                            </span>
                        </span>
                    </div>

                    {/* Selector temporal de rol */}
                    <div className="mb-6 lg:mb-8 flex items-center justify-center">
                        <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-dark-sidebar rounded-xl shadow px-3 lg:px-4 py-2 flex gap-2 items-center text-sm font-semibold text-white backdrop-blur-md border border-white/20">
                            <span className="font-bold tracking-wide drop-shadow">Rol:</span>
                            <select
                                value={isClientMounted ? role : (initialRole || "instructor")}
                                onChange={handleRoleChange}
                                className="sidebar-select rounded-lg px-2 lg:px-3 py-1 border-2 border-white/30 
                            bg-white/90 text-gray-900 dark:bg-dark-card dark:text-dark-text dark:border-dark-border
                            font-bold shadow text-sm focus:outline-none focus:ring-2 focus:ring-darkGreen/60 transition-all duration-200"
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
                            {menuItems.map((item: MenuItem, idx: number) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <li key={idx}>
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 
                        py-2.5 lg:py-3 px-3 lg:px-4
                        rounded-lg transition-all 
                        text-sm lg:text-base
                        font-semibold group hover:shadow-lg 
                        tracking-wide truncate relative overflow-hidden
                        before:absolute before:inset-0 before:-z-10 before:opacity-0 hover:before:opacity-100
                        before:bg-gradient-to-r before:from-lime-600 before:to-lime-500
                        dark:before:bg-gradient-to-r dark:before:from-shadowBlue dark:before:to-darkBlue
                        hover:text-white
                        ${isActive
                                                    ? 'before:opacity-100 bg-gradient-to-r from-lime-600 to-lime-500 dark:bg-gradient-to-r dark:from-shadowBlue dark:to-darkBlue text-white shadow-md pl-4'
                                                    : 'hover:pl-4'}
                        text-black dark:text-dark-text
                      `}
                                            onClick={handleLinkClick}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <span className="transition-transform group-hover:scale-125 text-xl lg:text-2xl drop-shadow flex-shrink-0">
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
                onClick={toggleMenu}
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
                {showMenu ? <PiCaretDoubleLeftDuotone /> : <PiListBulletsDuotone />}
            </button>
        </>
    );
};
