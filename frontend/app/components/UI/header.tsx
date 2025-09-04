"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "@components/UI/notifications";
import Link from "next/link";
import Switch from '@components/UI/switch';
import Image from "next/image";
import { RoleType } from '@type/roles';

interface HeaderProps {
  role: RoleType;
}

export const Header: React.FC<HeaderProps> = ({ role: initialRole }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [role, setRole] = useState(initialRole || 'instructor');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const buttonRef = useRef<HTMLLIElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const unreadCount = Notifications.unreadCount;

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

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
    <header className="h-[7vh] md:h-[10vh] w-full flex items-center justify-between bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500"
    >
      {/* Espacio izquierdo */}
      <div className="flex-1"></div>

      {/* Notificaciones, Switch y Perfil a la derecha */}
      <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
        {/* Notificaciones */}
        <div className="relative">
          <ul>
            <li
              ref={buttonRef}
              className="
                h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11
                flex items-center justify-center 
                rounded-full 
                bg-white dark:bg-shadowBlue 
                hover:bg-lightGray dark:hover:bg-darkBlue 
                transition-all duration-300 
                shadow-md cursor-pointer group 
                border border-darkGreen/20 dark:border-shadowBlue/40
              "
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
                className="text-lg sm:text-3xl lg:text-2xl relative group-hover:text-darkBlue dark:group-hover:text-lightGreen"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
              >
                <IoNotificationsOutline className="sm:w-xl text-lightGreen  group-hover:text-darkBlue dark:group-hover:text-lightGreen transition-colors duration-300" />
                {unreadCount > 0 && (
                  <RiCheckboxBlankCircleFill className="absolute top-0 right-0 text-red-600 h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 animate-pulse" />
                )}
              </a>
            </li>
          </ul>
          {isOpen && (
            <div
              ref={notificationsRef}
              className="absolute z-50 right-0 top-full mt-2"
            >
              <Notifications />
            </div>
          )}
        </div>

        {/* Switch al lado del botón de notificaciones */}
        <div className="flex items-center">
          <Switch />
        </div>

        {/* Perfil */}
        <Link
          href="/dashboard/perfil"
          className="
            group flex items-center 
            font-semibold text-black dark:text-white 
            gap-2 sm:gap-3 
            py-2 px-2 sm:px-3 lg:px-4 
            bg-transparent
            dark:bg-darkBlue 
            rounded-lg 
            shadow-lg 
            border border-darkGreen/20 dark:border-shadowBlue/40
            min-w-0
          "
        >
          {/* Texto del usuario - Solo visible en pantallas medianas y grandes */}
          <div className="hidden sm:flex flex-col text-end min-w-0">
            <span className="text-xs sm:text-sm lg:text-base text-black dark:text-white truncate">
              Usuario
            </span>
            <span className={`text-xs lg:text-sm ${roleColor[role]} truncate`}>
              {roleLabel[role]}
            </span>
          </div>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
              alt="Avatar de usuario"
              width={40}
              height={40}
              className="
                w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11
                object-cover rounded-full 
                border-2 border-white 
                shadow-sm 
                transition-all duration-300
              "
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-lightGreen border-2 border-white rounded-full"></div>
          </div>

          {/* Texto del usuario - Solo visible en móvil */}
          <div className="flex sm:hidden flex-col text-start min-w-0">
            <span className="text-xs leading-tight text-darkBlue dark:text-white truncate">
              Usuario
            </span>
            <span className={`text-xs ${roleColor[role]} leading-tight truncate`}>
              {roleLabel[role]}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;