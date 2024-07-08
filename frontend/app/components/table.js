"use client"

import Link from "next/link";
import React, { useState,  } from 'react';
import { GoSearch } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { VscEye } from "react-icons/vsc";
import ModalInfoficha from "../components/Modals/modalInfoficha";
import ModalQR from "../components/Modals/modalQR";
import Aprendiceslist from "../(routes)/aprendicelist/page";

export const Table = () => {

const [modalOpen, setModalOpen] = useState(false); // de linea 16 a linea 21 se crea la funcion para la logica del modal de ver info de ficha
const [modalQROpen, setModalQROpen] = useState(false); // de linea 23 a linea 30 se crea la funcion para la logica del modal de QR

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);

  };
  const handleOpenQRModal = () => {
    setModalQROpen(true);
  };

  const handleCloseQRModal = () => {
    setModalQROpen(false);
  };

    return(

    <div className=" w-11/12 h-96  rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10">
        <div className="flex bg-white w-full h-14">

            <form className="w-72 h-10">   
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GoSearch className="text-gray-400" />
                    </div>
                    <input type="search" className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300" placeholder="Buscar aprendiz." />
                </div>
            </form>

            <form className="w-72 h-10 ml-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GoSearch className="text-gray-400" />
                    </div>
                    <input type="date" className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300" placeholder="Buscar por fechas" />
                </div>
            </form>
    <div className="ml-32 mr-4">
        <button type="button" className="text-white font-serif h-11 w-36  rounded-lg text-sm px-5 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center"
            onClick={handleOpenQRModal}
            >
            Generar QR
            <MdOutlineQrCodeScanner className="ml-2" />
        </button>
        <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal}/>
    </div>
    <div>

        <button type="button" className="text-white font-serif h-11 w-56 rounded-lg text-xs px-5 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center"
        onClick={handleOpenModal}
        >
            Ver información de la ficha
            <VscEye className="w-5 h-5 ml-2" />
        </button>
        <ModalInfoficha isOpen={modalOpen} onClose={handleCloseModal}/>

    </div>

    <div className="ml-auto mr-4">
        <button type="button" className="text-white font-serif h-11 w-44 rounded-lg text-sm px-5 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center"
            >
            Finalizar Asistencia
        </button>
    </div>

    </div>

    {/* Tabla de lista de asistencia */}
    <div className="mt-4 w-full h-64 overflow-x-auto overflow-y-auto bg-purple-400">
        <div className=" bg-green-400 flex w-full space-x-36">

    <div className="ml-96 border-2 border-red-400">
            <span className="mx-7">
                Semana 1
            </span>
        </div>

        <div>
            <span>
                Semana 2
            </span>
        </div>

        <div>
            <span>
                Semana 3
            </span>
        </div>

        <div>
            <span>
                Semana 4
            </span>
        </div>
        </div>
    <table className="min-w-full text-left table-auto bg-white">
        <thead>
            <tr>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Número de Documento</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Nombres y Apellidos</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">L</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">J</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">V</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">S</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">D</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">L</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">J</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">V</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">S</th>
                <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">D</th>
                
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">10078459687</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
            </tr>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">10078459687</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
            </tr>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">10078459687</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
            </tr>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">10078459687</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
            </tr>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">10078459687</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
            </tr>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">10078459687</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
                <td className="px-4 py-3 border-2 border-gray-200 text-sm"></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

    )
}
