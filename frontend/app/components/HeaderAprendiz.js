"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "@components/notifications";

export const HeaderAprendiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const notificationsRef = useRef(null);
  const buttonRef = useRef(null);
  const unreadCount = Notifications.unreadCount;

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cerrar notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Cerrar notificaciones al presionar Escape
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className='h-[7vh] md:h-[9vh] mx-auto flex items-center justify-end px-3 sm:px-4 lg:px-5 py-2 lg:py-5 border-[#ffffff] bg-slate-200 shadow-none relative'>
      {/* Contenedor de notificaciones */}
      <div className="relative mr-3 sm:mr-4 lg:mr-6">
        <ul>
          <li
            ref={buttonRef}
            className='h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-white hover:bg-[#00324d] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group'
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
            aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} no leídas)` : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
          >
            <a href="#" className='text-gray-400 text-lg sm:text-xl md:text-2xl relative group-hover:text-white transition-colors duration-300' onClick={(e) => e.preventDefault()}>
              <IoNotificationsOutline className="text-[#01b001] group-hover:text-white transition-colors duration-300" />
              {unreadCount > 0 && (
                <RiCheckboxBlankCircleFill className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 md:top-1 md:right-1 text-red-600 h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 animate-pulse" />
              )}
            </a>
          </li>
        </ul>

        {/* Panel de notificaciones con posicionamiento responsive */}
        {isOpen && (
          <div
            ref={notificationsRef}
            className={`absolute z-50 ${isMobile
                ? 'right-0 top-full mt-2 w-80 max-w-[calc(100vw-24px)]'
                : 'right-0 top-full mt-2 w-96'
              }`}
          >
            <Notifications />
          </div>
        )}
      </div>

      {/* Perfil de usuario */}
      <Link
        href='/perfil'
        className='group flex items-center font-semibold text-white gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-3 lg:px-4 bg-[#00324d] hover:bg-[#01b001] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
      >
        {/* Información del usuario - Oculta en móviles muy pequeños */}
        <div className="hidden xs:flex flex-col text-end">
          <span className="text-sm sm:text-base lg:text-lg leading-tight">Usuario</span>
          <span className="text-xs sm:text-sm text-[#01b001] group-hover:text-[#00324d] transition-colors duration-300 leading-tight">
            Aprendiz
          </span>
        </div>

        {/* Avatar del usuario */}
        <div className="relative">
          <img
            src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
            alt="Avatar del usuario"
            className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 object-cover rounded-full border-2 border-white shadow-sm group-hover:border-[#00324d] transition-all duration-300'
          />
          {/* Indicador de estado online */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* Información del usuario para móviles muy pequeños */}
        <div className="flex xs:hidden flex-col text-start">
          <span className="text-xs leading-tight">Usuario</span>
          <span className="text-xs text-[#01b001] group-hover:text-[#00324d] transition-colors duration-300 leading-tight">
            Aprendiz
          </span>
        </div>
      </Link>
    </header>
  );
};