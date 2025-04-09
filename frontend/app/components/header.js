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
    <header className={`w-[78vw] h-[9vh] rounded-xl mx-auto flex items-center justify-end px-5 lg:py-5 lg:px-4 my-5 shadow-none ${roleStyles.bg}`}>
      
      <div className="relative mr-6">
        <ul>
          <li
            className="h-11 w-11 flex items-center justify-center rounded-full bg-white hover:bg-lightGray transition-all duration-300 shadow-md"
            onClick={toggleMenu}
          >
            <a href="#" className="text-gray-400 text-2xl relative">
              <IoNotificationsOutline className="text-lightGreen dark:text-darkBlue transition-colors duration-300" />
              {unreadCount > 0 && (
                <RiCheckboxBlankCircleFill className="absolute top-1 right-1 text-red-600 h-3 w-3" />
              )}
            </a>
          </li>
        </ul>
        {isOpen && <Notifications />}
      </div>

      <Link href="/perfil" className="group flex items-center font-semibold text-white gap-3 py-2 px-4 bg-darkBlue hover:shadow-darkGreen dark:bg-lightGreen dark:hover:shadow-shadowBlue rounded-lg transition-all duration-300 shadow-lg">
        <div className="flex flex-col text-end">
          <span className="text-lg">Usuario</span>
          <span className="text-sl text-lightGreen dark:text-darkBlue">
            {role}
          </span>
        </div>

        <img
          src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
          className="w-11 h-11 object-cover rounded-full border-2 border-white shadow-sm"
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
