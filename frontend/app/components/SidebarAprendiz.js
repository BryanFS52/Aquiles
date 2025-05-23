'use client';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FiAlignRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import LogoAquilesWhite from "@public/img/LogoAquilesWhite.png";
import ButtonTheme from "@components/ButtonTheme";

// Importación dinámica de íconos para mejorar la carga inicial
const IconFicha = dynamic(() => import('react-icons/fa').then((mod) => mod.FaRegListAlt), { ssr: false });
const IconAsistencia = dynamic(() => import('react-icons/bs').then((mod) => mod.BsPersonFillCheck), { ssr: false });
const IconTeam = dynamic(() => import('react-icons/hi2').then((mod) => mod.HiUserGroup), { ssr: false });
const IconSustentaciones = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaChalkboardUser), { ssr: false });
const IconJustificaciones = dynamic(() => import('react-icons/gi').then((mod) => mod.GiNotebook), { ssr: false });

export const Sidebaraprendiz = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const menuItems = useMemo(() => [
        { href: "/FichaAprendiz", label: "Ficha", icon: <IconFicha className='text-2xl' /> },
        { href: "/asistenciaAprendiz", label: "Asistencia", icon: <IconAsistencia className='text-2xl' /> },
        { href: "/teamScrumAprendiz", label: "Team", icon: <IconTeam className='text-2xl' /> },
        { href: "/ListaChequeoAprendiz", label: "Sustentaciones", icon: <IconSustentaciones className='text-2xl' /> },
        { href: "/justificacionesAprendiz", label: "Justificaciones", icon: <IconJustificaciones className='text-2xl' /> },
    ], []);

    return (
        <div className="grid grid-flow-row">
            <div className="flex relative">
                <div className={`min-h-screen h-full overflow-y-auto fixed xl:static bg-lightGreen dark:bg-darkBlue w-4/5 md:w-2/5 lg:w-1/3 xl:w-auto border-r border-gray-300 xl:border-r-0 top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
                    <div>
                        {/* LOGO */}
                        <div className="flex items-center mb-10">
                            <Image src={LogoAquilesWhite} alt="Logo Aquiles" width={96} height={96} />
                            <span className="text-xs font-inter">PROYECTOS FORMATIVOS (C.S.F.) APRENDIZ</span>
                        </div>

                        <ul className="text-white">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.href} className="flex items-center gap-4 py-3 px-4 hover:bg-darkGreen dark:hover:bg-shadowBlue rounded-xl transition-colors">
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <ul>
                        <ButtonTheme />
                    </ul>

                    {/* Botón para togglear el menú */}
                    <button onClick={toggleMenu} className='text-white bg-custom-blue fixed bottom-4 right-4 p-2 text-lg rounded-full lg:hidden'>
                        {showMenu ? <IoClose /> : <FiAlignRight />}
                    </button>
                </div>
            </div>
        </div>
    );
};
