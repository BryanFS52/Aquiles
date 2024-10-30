"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "./notifications";

export const HeaderAprendiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = Notifications.unreadCount;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className='h-[7vh] md:h-[9vh] mx-auto flex items-center justify-end px-5 lg:py-5 lg:px-4 border-[#ffffff] bg-slate-200 shadow-none'>
      <div className="relative mr-6">
        <ul>
          <li
            className='h-10 w-10 flex items-center justify-center rounded-full bg-white hover:bg-[#00324d] transition-all duration-300 shadow-md'
            onClick={toggleMenu}
            >
            <a href="#" className='text-gray-400 text-2xl relative'>
              <IoNotificationsOutline className="text-[#01b001] transition-colors duration-300"/>
              {unreadCount > 0 && (
                <RiCheckboxBlankCircleFill className="absolute top-1 right-1 text-red-600 h-3 w-3" />
              )}
            </a>
          </li>
        </ul>
        {isOpen && <Notifications />}
      </div>
      <Link href='/perfil' className='group flex items-center font-semibold text-white gap-3 py-3 px-4 bg-[#00324d] hover:bg-[#01b001] rounded-lg transition-all duration-300 shadow-md'>
        <div className="flex flex-col text-end">
          <span className="text-lg">Usuario</span>
          <span className="text-sm text-[#01b001] group-hover:text-[#00324d] transition-colors duration-300">Aprendiz</span>
        </div>
        <img
          src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
          className='w-11 h-11 object-cover rounded-full border-2 border-white shadow-sm'
        />
      </Link>


    </header>
  );
};
