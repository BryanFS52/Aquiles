"use client";

import React, { useState } from "react";
import { HeaderAprendiz } from "../../components/HeaderAprendiz";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz"; // Importaciones del header y del sidebar
import { GoSearch } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation'; // Importa useRouter de next/navigation

export default function AsistenciaAprendiz() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

   const router = useRouter(); 
  const handleNext = () => {  
    router.push('/justificacionesAprendiz'); 
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <HeaderAprendiz />

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">
            Mi Asistencia
          </h1>
          <div className="flex w-3/4 h-auto border-2 border-gray-400 rounded-lg overflow-hidden shadow-lg bg-zinc-100 relative mb-4 p-4 ml-28">
            <div className="container mx-auto">
              <div className="w-11/12 h-auto rounded-lg overflow-hidden shadow-lg bg-custom-blue border-2 border-gray-300 relative mb-4 p-3 ml-16 mt-10 justify-center">
                <div className="flex bg-custom-blue w-full h-14">
                  <h1 className="text-green-600 font-inter font-semibold text-3xl pt-3 ml-6">
                    Junio
                  </h1>

                  <form className="w-72 h-10 ml-60 pt-3 pl-7">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GoSearch className="text-gray-400 ml-40" />
                      </div>
                      <input
                        type="date"
                        className="h-8 block w-44 pl-10 pr-4 ml-40 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300"
                        placeholder="Buscar por fechas"
                      />
                    </div>
                  </form>

                  <div className="relative w-72 h-10 ml-24 pt-3">
                    <div className="relative">
                      <input
                        type="search"
                        className="font-inter font-normal h-8 block w-48 pl-2 pr-10 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300"
                        placeholder="Filtrar por"
                        onClick={toggleDropdown}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center ">
                        <IoIosArrowDown className="text-black mr-9 cursor-pointer" onClick={toggleDropdown} />
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                          <ul className="text-sm">
                            <li className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
                              <span className="text-red-500 mr-2">❌</span>
                              Inasistencia
                            </li>
                            <li className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
                              <span className="text-yellow-500 mr-2">🟡</span>
                              Retardo
                            </li>
                            <li className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
                              <span className="text-blue-500 mr-2">🟦</span>
                              Justificación
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm text-left text-black dark:text-black border-2 border-gray-400 ml-0">
                  <thead className="text-base font-serif dark:bg-[#265067] dark:text-white text-center">
                  <tr>
                      <th className="font-inter font-semibold px-7 py-3 border-2 border-gray-400 text-white"> Domingo</th>
                      <th className="font-inter font-semibold px-10 py-3 border-2 border-gray-400 text-white"> Lunes</th>
                      <th className="font-inter font-semibold px-9 py-3 border-2 border-gray-400 text-white"> Martes</th>
                      <th className="font-inter font-semibold px-6 py-3 border-2 border-gray-400 text-white"> Miercoles</th>
                      <th className="font-inter font-semibold px-9 py-3 border-2 border-gray-400 text-white"> Jueves</th>
                      <th className="font-inter font-semibold px-8 py-3 border-2 border-gray-400 text-white"> Viernes</th>
                      <th className="font-inter font-semibold px-8 py-3 border-2 border-gray-400 text-white"> Sabado</th>
                  </tr>
      
                  </thead>
                  <tbody>
                  <tr className="bg-white dark:bg-white">
                      <th className="px-6 py-4 border-2 border-gray-400 bg-gray-200"></th>
                      <td className="px-6 py-4 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-4 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-4 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-4 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-4 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">1</span>
                      </td>
                  </tr>
      
                  <tr className="bg-white dark:bg-white">
                      <th className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">2</span>
                      </th>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">3</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">4</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">5</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">6</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">7</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">8</span>
                      </td>
                  </tr>
      
                  <tr className="bg-white dark:bg-white">
                      <th className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">9</span>
                      </th>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">10</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">11</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">12</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">13</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">14</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">15</span>
                      </td>
                  </tr>
      
                  <tr className="bg-white dark:bg-white">
                      <th className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">16</span>
                      </th>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">17</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">18</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">19</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">20</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">21</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">22</span>
                      </td>
                  </tr>
      
                  <tr className="bg-white dark:bg-white">
                      <th className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">23</span>
                      </th>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">24</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">25</span>
                      </td>

                      <td className="px-6 py-11 border-2 border-gray-400 relative semicircle">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">26</span>
                      <button className="absolute bottom-0 left-0 px-4 py-2 bg-custom-blue text-white text-xs w-24 ml-8 font-bold rounded"
                      onClick={handleNext}>
                      Justificar</button>
                      </td>

                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">27</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">28</span>
                      </td>
                      <td className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">29</span>
                      </td>
                  </tr>
      
                  <tr className="bg-white dark:bg-white">
                      <th className="px-6 py-11 border-2 border-gray-400 relative">
                      <span className="absolute top-0 right-0 pr-2 font-inter font-semibold text-3xl">30</span>
                      </th>
                      <td className="px-6 py-9 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-9 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-9 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-9 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-9 border-2 border-gray-400 bg-gray-200"></td>
                      <td className="px-6 py-9 border-2 border-gray-400 bg-gray-200"></td>
                  </tr>
      
                  </tbody>
                  </table>
                  
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
