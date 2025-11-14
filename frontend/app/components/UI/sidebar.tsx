'use client';

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { useAuth } from '@hooks/useAuth';
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
        { href: "/dashboard/Seguimiento", label: "Seguimiento", icon: IconSeguimiento },
        { href: "/dashboard/actasInstructor", label: "Actas", icon: IconActas }
    ],
    aprendiz: [
        { href: "/dashboard/FichaAprendiz", label: "Ficha", icon: IconFichas },
        { href: "/dashboard/asistenciaAprendiz", label: "Asistencia", icon: IconAsistencia },
        { href: "/dashboard/teamScrumAprendiz", label: "Team", icon: IconTeams },
        { href: "/dashboard/ListaChequeoAprendiz", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/JustificacionesAprendiz", label: "Justificaciones", icon: IconJustificaciones },
        { href: "/dashboard/planesMejoramientoAprendiz", label: "P. Mejoramiento", icon: IconPlanesMejoramiento },
    ],
    coordinador: [
        { href: "/dashboard/coordinacionesCoordinador", label: "Coordinaciones", icon: IconCoordinaciones },
        { href: "/dashboard/FichasCoordinador", label: "Fichas", icon: IconFichas },
        { href: "/dashboard/InstructoresCoordinador", label: "Instructores", icon: IconProfesor },
        { href: "/dashboard/ProgramasCoordinador", label: "Programas", icon: IconProgramas },
        { href: "/dashboard/ListaChequeoCoordinador", label: "Sustentaciones", icon: IconSustentaciones },
        { href: "/dashboard/JustificacionesCoordinador", label: "Justificaciones", icon: IconJustificaciones },
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
    const { logout } = useAuth();
    
    // Obtener rol del Redux store
    const { user } = useSelector((state: RootState) => state.auth);
    const userRole = user?.roles?.[0]?.name || initialRole || "instructor";

    // Normalizar rol
    const getRoleKey = (roleName: string): string => {
        const lower = roleName.toLowerCase();
        if (lower.includes('coordinador')) return 'coordinador';
        if (lower.includes('instructor')) return 'instructor';
        if (lower.includes('aprendiz')) return 'aprendiz';
        return 'instructor';
    };

    const roleKey = getRoleKey(userRole);
    const menuItems: MenuItem[] = useMemo(() => getMenuByRole(roleKey), [roleKey]);

    const handleLinkClick = (): void => {
        if (window.innerWidth < 1024) setShowMenu(false);
    };

    const toggleMenu = (): void => {
        setShowMenu(!showMenu);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            if (window.innerWidth < 1024) setShowMenu(false);
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
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
                                {roleKey.toUpperCase()}
                            </span>
                        </span>
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

                {/* Botón de Logout - Centrado y más grande */}
                <div className="flex items-center justify-center p-4 lg:p-6 border-t border-darkGreen/10 dark:border-dark-border/20">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center justify-start w-14 h-14 lg:w-16 lg:h-16 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-40 lg:hover:w-48 hover:rounded-lg active:translate-x-1 active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-dark-sidebar"
                        title="Cerrar sesión"
                    >
                        {/* Icono */}
                        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:pl-4">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 512 512" fill="white">
                                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                            </svg>
                        </div>
                        
                        {/* Texto - Aparece en hover */}
                        <div className="absolute right-6 transform translate-x-full opacity-0 text-white text-lg lg:text-xl font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Logout
                        </div>
                    </button>
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
