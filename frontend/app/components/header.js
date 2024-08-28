"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";  // Importa el componente Image de Next.js
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const notificationsData = [
  {
    id: 1,
    user: 'Coordinación',
    action: 'Acercarse el dia sabado 17 de julio a las',
    content: '8:00 am',
    time: '1m ago',
    unread: true,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 2,
    user: 'Diego Boada',
    action: 'Es tu nuevo instructor tecnico',
    time: '1h ago',
    unread: true,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 3,
    user: 'Julian Paredes',
    action: 'Nuevo aprendiz en la ficha',
    content: '278483',
    time: '1 day ago',
    unread: true,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 4,
    user: 'Katalina Torres',
    action: 'Ha subido la justificación de su ausencia en el componente',
    time: '5 days ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
    // image: '/assets/images/image-chess.webp',
  },
  {
    id: 5,
    user: 'Paula Contreras',
    action: 'No asistió al componente de Bases de datos',
    time: '1 week ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 6,
    user: 'Natalia Martinez',
    action: 'Asignación a la nueva ficha',
    content: '2968472',
    time: '2 weeks ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 7,
    user: 'Anna Rincon',
    action: 'es nueva la instructora tecnica de la ficha',
    content: '255794',
    time: '2 weeks ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
  },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  return (
    <header className='h-[7vh] md:h-[9vh] mx-auto flex items-center justify-end px-5 lg:py-5 lg:px-4  border-[#ffffff] bg-slate-100'>
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
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-2">
              <span className="text-[#00324d] font-inter font-bold">Notifications</span>
              <button
                className="text-[#00324d] hover:text-[#40b003] text-sm font-inter"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>
            <ul className="p-2 max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <li
                  key={notification.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <img
                    src={notification.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4 flex-1">
                    <p className="text-[#00324d]">
                      <strong className="hover:text-[#40b003]">{notification.user}</strong> {notification.action} {notification.content && <strong className="text-[#40b003]">{notification.content}</strong>}
                    </p>
                    <p className="text-gray-500 text-sm">{notification.time}</p>
                    {notification.message && (
                      <div className="p-2 border border-gray-200 rounded-md mt-2">
                        {notification.message}
                      </div>
                    )}
                  </div>
                  {notification.image && (
                    <img
                      src={notification.image}
                      alt="content"
                      className="w-12 h-12 rounded-md ml-auto"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
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
