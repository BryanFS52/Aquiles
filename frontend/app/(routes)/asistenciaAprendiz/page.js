'use client'

import React, { useState, useEffect } from "react";
import { Header } from "@components/header";
import { Sidebaraprendiz } from "@components/SidebarAprendiz";
import { GoSearch } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import '@schedule-x/theme-default/dist/index.css'

// Estilos CSS personalizados para forzar los colores
const customStyles = `
  .calendar-event-retardo {
    background-color: #fbbf24 !important;
    color: #000000 !important;
    border: 2px solid #d97706 !important;
    font-weight: 600 !important;
  }
  
  .calendar-event-inasistencia {
    background-color: #ef4444 !important;
    color: #ffffff !important;
    border: 2px solid #dc2626 !important;
    font-weight: 600 !important;
  }
  
  .calendar-event-justificacion {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
    border: 2px solid #2563eb !important;
    font-weight: 600 !important;
  }
  
  /* Asegurar que los eventos tengan el estilo correcto */
  .sx__event {
    border-radius: 6px !important;
    padding: 2px 4px !important;
    font-size: 11px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }
`;

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
  const [filter, setFilter] = useState('all');

  const router = useRouter();

  // Eventos base
  const allEvents = [
    // Semana actual (19-23 Mayo 2025)
    {
      id: '1',
      title: 'Justificado',
      start: '2025-05-23', // Viernes
      end: '2025-05-23',
      className: 'calendar-event-justificacion',
      type: 'Justificacion',
    },
    {
      id: '2',
      title: 'Inasistencia',
      start: '2025-05-22', // Jueves
      end: '2025-05-22',
      className: 'calendar-event-inasistencia',
      type: 'Inasistencia',
    },
    {
      id: '3',
      title: 'Retardo',
      start: '2025-05-21', // Miércoles
      end: '2025-05-21',
      className: 'calendar-event-retardo',
      type: 'Retardo',
    },
    {
      id: '4',
      title: 'Inasistencia',
      start: '2025-05-20', // Martes
      end: '2025-05-20',
      className: 'calendar-event-inasistencia',
      type: 'Inasistencia',
    },
    {
      id: '5',
      title: 'Justificado',
      start: '2025-05-19', // Lunes
      end: '2025-05-19',
      className: 'calendar-event-justificacion',
      type: 'Justificacion',
    },
    // Semana anterior (12-16 Mayo 2025)
    {
      id: '6',
      title: 'Retardo',
      start: '2025-05-16', // Viernes
      end: '2025-05-16',
      className: 'calendar-event-retardo',
      type: 'Retardo',
    },
    {
      id: '7',
      title: 'Inasistencia',
      start: '2025-05-15', // Jueves
      end: '2025-05-15',
      className: 'calendar-event-inasistencia',
      type: 'Inasistencia',
    },
    {
      id: '8',
      title: 'Justificado',
      start: '2025-05-14', // Miércoles
      end: '2025-05-14',
      className: 'calendar-event-justificacion',
      type: 'Justificacion',
    },
    {
      id: '9',
      title: 'Retardo',
      start: '2025-05-13', // Martes
      end: '2025-05-13',
      className: 'calendar-event-retardo',
      type: 'Retardo',
    },
    {
      id: '10',
      title: 'Inasistencia',
      start: '2025-05-12', // Lunes
      end: '2025-05-12',
      className: 'calendar-event-inasistencia',
      type: 'Inasistencia',
    }
  ];

  // Configurar el calendario
  const eventsService = useState(() => createEventsServicePlugin())[0];

  // Función para obtener eventos filtrados
  const getFilteredEvents = () => {
    if (filter === 'all') {
      return allEvents;
    }
    return allEvents.filter(event => event.type === filter);
  };

  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    defaultView: 'monthGrid',
    events: getFilteredEvents(),
    plugins: [eventsService],
    callbacks: {
      onRender: () => eventsService.getAll(),
      onEventClick: (event) => {
        router.push('/justificacionesAprendiz');
      },
      onJustificarClick: () => {
        router.push('/justificacionesAprendiz');
      }
    }
  });


  // Actualizar eventos cuando cambie el filtro
  useEffect(() => {
    if (calendar && eventsService) {
      // Limpiar eventos existentes
      const currentEvents = eventsService.getAll();
      currentEvents.forEach(event => {
        eventsService.remove(event.id);
      });

      // Agregar eventos filtrados
      const filteredEvents = getFilteredEvents();
      filteredEvents.forEach(event => {
        eventsService.add(event);
      });
    }
  }, [filter, calendar, eventsService]);

  // Función para manejar el cambio de filtro
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIsDropdownOpen(false);
  };

  // Obtener texto del filtro actual
  const getFilterText = () => {
    switch (filter) {
      case 'Inasistencia': return 'Inasistencias';
      case 'Retardo': return 'Retardos';
      case 'Justificacion': return 'Justificaciones';
      default: return 'Todos';
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      {/* Inyectar estilos CSS personalizados */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header role="Aprendiz" />

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
                    <div className="relative w-72 h-10">
                      <button
                        className="font-inter font-normal h-8 block w-48 pl-2 pr-10 text-sm rounded-lg border-2 border-slate-300 dark:text-black focus:outline-none focus:border-slate-300 flex items-center justify-between"
                        onClick={toggleDropdown}
                        type="button"
                      >
                        {getFilterText()}
                        <IoIosArrowDown className="text-black cursor-pointer" />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                          <ul className="text-sm">
                            <li
                              className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleFilterChange('Inasistencia')}
                            >
                              <span className="text-red-500 mr-2">❌</span>
                              Inasistencia
                            </li>
                            <li
                              className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleFilterChange('Retardo')}
                            >
                              <span className="text-yellow-500 mr-2">🟡</span>
                              Retardo
                            </li>
                            <li
                              className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleFilterChange('Justificacion')}
                            >
                              <span className="text-blue-500 mr-2">🟦</span>
                              Justificación
                            </li>
                            <li
                              className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleFilterChange('all')}
                            >
                              <span className="mr-2">📅</span>
                              Todos
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Calendario ScheduleX */}
                <div className="mt-6">
                  <ScheduleXCalendar
                    calendarApp={calendar}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}