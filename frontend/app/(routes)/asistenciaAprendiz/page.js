'use client'

import React, { useState } from "react";
import { HeaderAprendiz } from "@components/HeaderAprendiz";
import { Sidebaraprendiz } from "@components/SidebarAprendiz";
import { GoSearch } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import '@schedule-x/theme-default/dist/index.css'

// ScheduleX Calendar
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

export default function AsistenciaAprendiz() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const router = useRouter();
  const handleNext = () => router.push('/justificacionesAprendiz');

  // Configurar el calendario
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    events: [
      {
        id: '1',
        title: 'Justificar asistencia',
        start: '2023-12-26',
        end: '2023-12-26',
      },
    ],
    plugins: [eventsService],
    callbacks: {
      onRender: () => eventsService.getAll(),
    }
  });

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <HeaderAprendiz />

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">
            Mi Asistencia
          </h1>

          <div className="flex w-full xl:w-11/12 h-auto border-2 border-gray-400 rounded-lg overflow-hidden shadow-lg bg-zinc-100 relative mb-4 p-4 mx-auto">
            <div className="container mx-auto">
              <div className="w-full h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-3 mt-6">

                {/* Header de mes y filtros */}
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <h1 className="text-green-600 font-inter font-semibold text-3xl ml-6">
                    Calendario
                  </h1>

                  <div className="relative w-72 h-10">
                    <input
                      type="search"
                      className="font-inter font-normal h-8 block w-48 pl-2 pr-10 text-sm rounded-lg border-2 border-slate-300 dark:text-black focus:outline-none focus:border-slate-300"
                      placeholder="Filtrar por"
                      onClick={toggleDropdown}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <IoIosArrowDown className="text-black cursor-pointer" onClick={toggleDropdown} />
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

                {/* Calendario ScheduleX */}
                <div className="mt-6">
                  <ScheduleXCalendar calendarApp={calendar} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
