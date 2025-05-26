"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "@components/notifications";

export const Header = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = Notifications.unreadCount;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Estilo general para todos los roles
  const roleStyles = {
    bg: "bg-lightGreen dark:bg-darkBlue",
  };

  return (
    <header className={`w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[78vw] h-[9vh] min-h-[60px] rounded-xl mx-auto flex items-center justify-end px-3 sm:px-4 lg:px-5 py-2 lg:py-5 my-3 sm:my-4 lg:my-5 shadow-none ${roleStyles.bg}`}>

      <div className="relative mr-3 sm:mr-4 lg:mr-6">
        <ul>
          <li
            className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 flex items-center justify-center rounded-full bg-white hover:bg-lightGray transition-all duration-300 shadow-md cursor-pointer"
            onClick={toggleMenu}
          >
            <a href="#" className="text-gray-400 text-xl sm:text-xl lg:text-2xl relative">
              <IoNotificationsOutline className="text-lightGreen dark:text-darkBlue transition-colors duration-300" />
              {unreadCount > 0 && (
                <RiCheckboxBlankCircleFill className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 text-red-600 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              )}
            </a>
          </li>
        </ul>
        {isOpen && <Notifications />}
      </div>

      <Link href="/perfil" className="group flex items-center font-semibold text-white gap-2 sm:gap-3 py-2 px-3 sm:px-4 bg-darkBlue hover:shadow-darkGreen dark:bg-lightGreen dark:hover:shadow-shadowBlue rounded-lg transition-all duration-300 shadow-lg">
        <div className="flex flex-col text-end">
          <span className="text-sm sm:text-base lg:text-lg">Usuario</span>
          <span className="text-xs sm:text-sm lg:text-sl text-lightGreen dark:text-darkBlue">
            {role}
          </span>
        </div>

        <img
          src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
          alt="Avatar de usuario"
          className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-cover rounded-full border-2 border-white shadow-sm flex-shrink-0"
        />
      </Link>
    </header>
  );
};

// Definir los tipos de props correctamente
Header.propTypes = {
  role: PropTypes.oneOf(["Instructor", "Aprendiz", "Coordinador"]).isRequired,
};

export default Header;