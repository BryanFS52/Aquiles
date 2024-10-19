"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { Notifications } from "./notifications";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = Notifications.unreadCount;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className='h-[7vh] md:h-[9vh] mx-auto flex items-center justify-end px-5 lg:py-5 lg:px-4 border-[#ffffff] bg-slate-200'>
      <div className="relative">
        <ul>
          <li
            className='h-10 w-10 flex items-center justify-center rounded-full bg-white hover:bg-[#00324d] transition-colors duration-300'
            onClick={toggleMenu}
          >
            <a href="#" className='text-gray-400 text-2xl relative'>
              <IoNotificationsOutline className="text-[#01b001] transition-colors duration-300"/>
              {unreadCount > 0 && (
                <RiCheckboxBlankCircleFill className="absolute top-0 right-0 text-red-600 h-3 w-3" />
              )}
            </a>
          </li>
        </ul>
        {isOpen && <Notifications />}
      </div>
      <Link href='/perfil' className='flex items-center gap-2 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'>
        <div className="text-[#000000] font-inter font-medium flex flex-col">
          <span className="text-end">Usuario</span>
          <span className="text-xs">Aprendices</span>
        </div>
        <img
          src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
          className='w-10 h-10 object-cover rounded-full'
        />
      </Link>
    </header>
  );
};
