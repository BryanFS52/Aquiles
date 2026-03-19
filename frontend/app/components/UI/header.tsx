"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "@components/UI/notifications";
import Link from "next/link";
import Switch from '@components/UI/switch';
import Image from "next/image";
import { RoleType } from '@type/roles';
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  role: RoleType;
}

export const Header: React.FC<HeaderProps> = ({ role: initialRole }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [role, setRole] = useState(initialRole || 'instructor');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const buttonRef = useRef<HTMLLIElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const unreadCount = Notifications.unreadCount;
  
  // Hook de autenticación
  const { user } = useAuth();

  // Obtener iniciales del nombre
  const getInitials = (name?: string): string => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Obtener nombre corto para móvil
  const getShortName = (name?: string): string => {
    if (!name) return "Usuario";
    const parts = name.trim().split(" ");
    return parts[0];
  };

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isProfileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  // Obtener nombre y rol del usuario
  const userName = user?.person?.name && user?.person?.lastname 
    ? `${user.person.name} ${user.person.lastname}` 
    : "Usuario";
  const userRole = user?.roles?.[0]?.name || "Usuario";
  const userInitials = getInitials(userName);
  const userShortName = getShortName(userName);

  // Role-specific color/text
  const roleLabel: Record<RoleType, string> = {
    aprendiz: "Aprendiz",
    instructor: "Instructor",
    coordinador: "Coordinador",
  };

  const roleColor: Record<RoleType, string> = {
    aprendiz: "text-black group-hover:text-darkBlue",
    instructor: "text-black  group-hover:text-darkBlue",
    coordinador: "text-black group-hover:text-darkBlue",
  };

  return (
    <header className="h-[60px] sm:h-[7vh] md:h-[10vh] w-full flex items-center bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 px-2 md:px-6 relative z-50">
      {/* Logo SENA a la izquierda */}
      <div className="flex items-center flex-shrink-0 min-w-[60px] sm:min-w-[80px] md:min-w-[140px]">
        <Image
          src="/img/logo_Sena.png"
          alt="Logo SENA"
          width={80}
          height={80}
          className="object-contain h-8 w-12 sm:h-10 sm:w-14 md:h-14 md:w-24 lg:h-20 lg:w-32"
          priority
        />
      </div>

      {/* Barra de búsqueda al centro - comentada para futuras implementaciones */}
      {/* <div className="flex-1 flex justify-center px-2 sm:px-4">
        <div className="relative w-full max-w-[140px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full rounded-full pl-8 pr-3 py-1.5 sm:py-2 bg-[#ffffff33] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-lightGreen transition-all duration-200 text-xs sm:text-sm md:text-base shadow-inner"
            style={{ backdropFilter: 'blur(2px)' }}
          />
          <svg className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80" width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.15 10.15Z" /></svg>
        </div>
      </div> */}

      {/* Espaciador para mantener los iconos a la derecha */}
      <div className="flex-1" />

      {/* Notificaciones, Switch y Perfil a la derecha */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
        {/* Notificaciones */}
        <div className="relative">
          <ul>
            <li
              ref={buttonRef}
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-full bg-white dark:bg-shadowBlue hover:bg-lightGray dark:hover:bg-darkBlue transition-all duration-300 shadow-md cursor-pointer group border border-darkGreen/20 dark:border-shadowBlue/40"
              onClick={toggleMenu}
              role="button"
              tabIndex={0}
              aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} no leídas)` : ""}`}
              onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => {
                if (["Enter", " "].includes(e.key)) {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
            >
              <a
                href="#"
                className="text-sm sm:text-lg md:text-xl relative group-hover:text-darkBlue dark:group-hover:text-lightGreen"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
              >
                <IoNotificationsOutline className="text-lightGreen group-hover:text-darkBlue dark:group-hover:text-lightGreen transition-colors duration-300" />
                {unreadCount > 0 && (
                  <RiCheckboxBlankCircleFill className="absolute top-0 right-0 text-red-600 h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 animate-pulse" />
                )}
              </a>
            </li>
          </ul>
          {isOpen && (
            <div
              ref={notificationsRef}
              className="fixed top-16 sm:top-20 md:top-24 right-2 sm:right-4 md:right-6 z-[9999]"
              style={{
                transform: 'translateX(0)',
              }}
            >
              <Notifications />
            </div>
          )}
        </div>

        {/* Switch al lado del botón de notificaciones */}
        <div className="flex items-center">
          <div className="scale-[0.65] sm:scale-75 md:scale-90">
            <Switch />
          </div>
        </div>

        {/* Perfil */}
        <div className="relative">
          <div
            ref={profileButtonRef}
            onClick={toggleProfileMenu}
            className="group flex items-center font-semibold text-black dark:text-white gap-1 sm:gap-2 py-1 px-1 sm:py-2 sm:px-2 lg:px-3 bg-transparent dark:bg-darkBlue rounded-lg shadow-lg border border-darkGreen/20 dark:border-shadowBlue/40 min-w-0 flex-shrink-0 cursor-pointer hover:bg-white/10 transition-all"
          >
            {/* Texto del usuario - Solo visible en pantallas medianas y grandes */}
            <div className="hidden md:flex flex-col text-end min-w-0 max-w-[120px]">
              <span className="text-[10px] sm:text-xs lg:text-sm text-black dark:text-white truncate">
                {userName}
              </span>
              <span className="text-[8px] lg:text-xs text-white/80 dark:text-lightGreen truncate">
                {userRole}
              </span>
            </div>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-[#5cb800] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-[8px] sm:text-xs md:text-sm font-bold text-white">{userInitials}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-lightGreen border-2 border-white rounded-full"></div>
            </div>

            {/* Texto del usuario - Solo visible en móvil y tablet pequeño */}
            <div className="flex md:hidden flex-col text-start min-w-0 max-w-[80px]">
              <span className="text-[8px] sm:text-[10px] leading-tight text-white truncate">
                {userShortName}
              </span>
              <span className="text-[7px] sm:text-[9px] text-white/80 dark:text-lightGreen leading-tight truncate">
                {userRole}
              </span>
            </div>
          </div>

          {/* Menú desplegable del perfil */}
          {isProfileMenuOpen && (
            <div
              ref={profileMenuRef}
              className="fixed top-16 sm:top-20 md:top-24 right-2 sm:right-4 md:right-6 z-[9999] w-48 bg-white dark:bg-shadowBlue rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user?.person?.document || ""}
                </p>
              </div>
              
              <Link
                href="/dashboard/perfil"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ver Perfil
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;