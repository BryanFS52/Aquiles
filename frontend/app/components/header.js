"use client";

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "@components/notifications";
import Switch from "@components/Switch";

export const Header = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef(null);
  const notificationsRef = useRef(null);
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
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Role-specific color/text
  const roleLabel = {
    Aprendiz: "Aprendiz",
    Instructor: "Instructor",
    Coordinador: "Coordinador",
  }[role];

  const roleColor = {
    Aprendiz: "text-lightGreen group-hover:text-darkBlue",
    Instructor: "text-lightGreen group-hover:text-darkBlue",
    Coordinador: "text-lightGreen group-hover:text-darkBlue",
  }[role];

  const bgColor = "bg-darkBlue dark:bg-lightGreen";

  return (
    <header
      className={`w-full sm:w-[90vw] md:w-[85vw] lg:w-full h-[9vh] min-h-[60px] mx-auto flex items-center justify-between px-3 sm:px-6 lg:px-10 py-2 lg:py-4 shadow-none bg-lime-500 dark:bg-gradient-to-r dark:from-shadowBlue dark:to-darkBlue border-b border-darkGreen/10 dark:border-shadowBlue/30 transition-all duration-300`}
    >
      {/* Logo y Switch */}
      <div className="flex items-center gap-4">
        <div className="ml-2">
          <Switch />
        </div>
      </div>
      {/* Notificaciones y Perfil */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="ml-2">
          <Switch />
        </div>
        {/* Notificaciones */}
        <div className="relative">
          <ul>
            <li
              ref={buttonRef}
              className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 flex items-center justify-center rounded-full bg-white hover:bg-lightGray transition-all duration-300 shadow-md cursor-pointer group"
              onClick={toggleMenu}
              role="button"
              tabIndex={0}
              aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} no leídas)` : ""}`}
              onKeyDown={(e) => {
                if (["Enter", " "].includes(e.key)) {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
            >
              <a
                href="#"
                className="text-gray-400 text-xl sm:text-xl lg:text-2xl relative group-hover:text-darkBlue"
                onClick={(e) => e.preventDefault()}
              >
                <IoNotificationsOutline className="text-lightGreen group-hover:text-darkBlue transition-colors duration-300" />
                {unreadCount > 0 && (
                  <RiCheckboxBlankCircleFill className="absolute top-0.5 right-0.5 text-red-600 h-2.5 w-2.5 sm:h-3 sm:w-3 animate-pulse" />
                )}
              </a>
            </li>
          </ul>
          {isOpen && (
            <div
              ref={notificationsRef}
              className={`absolute z-50 ${isMobile
                ? "right-0 top-full mt-2 w-80 max-w-[calc(100vw-24px)]"
                : "right-0 top-full mt-2 w-96"
                }`}
            >
              <Notifications />
            </div>
          )}
        </div>
        {/* Perfil */}
        <Link
          href="/perfil"
          className="group flex items-center font-semibold text-white gap-2 sm:gap-3 py-2 px-3 sm:px-4 bg-darkBlue hover:bg-lightGreen dark:bg-lightGreen dark:hover:bg-darkBlue rounded-lg transition-all duration-300 shadow-lg"
        >
          <div className="hidden xs:flex flex-col text-end">
            <span className="text-sm sm:text-base lg:text-lg text-darkBlue dark:text-white">Usuario</span>
            <span className={`text-xs sm:text-sm lg:text-base ${roleColor}`}>{roleLabel}</span>
          </div>
          <div className="relative">
            <img
              src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
              alt="Avatar de usuario"
              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-cover rounded-full border-2 border-white shadow-sm transition-all duration-300"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex xs:hidden flex-col text-start">
            <span className="text-xs leading-tight text-darkBlue dark:text-white">Usuario</span>
            <span className={`text-xs ${roleColor} leading-tight`}>{roleLabel}</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

Header.propTypes = {
  role: PropTypes.oneOf(["Aprendiz", "Instructor", "Coordinador"]).isRequired,
};

export default Header;
