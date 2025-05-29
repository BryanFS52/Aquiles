'use client'

import React, { useState, useEffect } from "react";
import { Header } from "@components/header";
import { SidebarAprendiz } from "@components/SidebarAprendiz";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import '@schedule-x/theme-default/dist/index.css'

// Estilos CSS personalizados para forzar los colores y responsividad
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

  /* Estilos responsive para el calendario */
  @media (max-width: 768px) {
    .sx__calendar {
      font-size: 12px !important;
    }
    
    .sx__event {
      font-size: 9px !important;
      padding: 1px 2px !important;
    }
    
    .sx__week-grid-day-header {
      font-size: 11px !important;
      padding: 4px 2px !important;
    }
    
    .sx__month-grid-day {
      min-height: 60px !important;
    }
    
    .sx__month-grid-day-header {
      font-size: 11px !important;
      padding: 4px 2px !important;
    }

    .sx__calendar-header {
      padding: 8px !important;
    }

    .sx__calendar-header-content {
      flex-direction: column !important;
      gap: 8px !important;
    }
  }

  @media (max-width: 480px) {
    .sx__calendar {
      font-size: 10px !important;
    }
    
    .sx__event {
      font-size: 8px !important;
      padding: 1px !important;
    }
    
    .sx__month-grid-day {
      min-height: 45px !important;
    }
    
    .sx__week-grid-day-header,
    .sx__month-grid-day-header {
      font-size: 9px !important;
      padding: 2px 1px !important;
    }
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
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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

  // Configurar vistas del calendario según dispositivo
  const getCalendarViews = () => {
    if (isMobile) {
      return [
        createViewMonthGrid(),
        createViewMonthAgenda(),
        createViewWeek()
      ];
    }
    return [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ];
  };

  const calendar = useNextCalendarApp({
    views: getCalendarViews(),
    defaultView: isMobile ? 'monthGrid' : 'monthGrid',
    events: getFilteredEvents(),
    plugins: [eventsService],
    callbacks: {
      onRender: () => eventsService.getAll(),
      onEventClick: () => {
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

      <SidebarAprendiz />
      <div className="xl:col-span-5">
        <Header role="Aprendiz" />

        <div className="h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12">
          <h1 className="text-[#0e324d] text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 sm:mb-6 lg:mb-12 font-inter font-semibold">
            Mi Asistencia
          </h1>

          <div className="w-full h-auto border-2 border-gray-400 rounded-lg overflow-hidden shadow-lg bg-zinc-100 relative mb-4 p-2 sm:p-4">
            <div className="w-full">
              <div className="w-full h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-2 sm:p-3 mt-4 sm:mt-6">

                {/* Header de mes y filtros */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h1 className="text-green-600 font-inter font-semibold text-xl sm:text-2xl md:text-3xl ml-2 sm:ml-6">
                    Calendario
                  </h1>

                  <div className="relative w-full sm:w-72 h-10 mr-2 sm:mr-6">
                    <button
                      className="font-inter font-normal h-8 w-full sm:w-48 pl-2 pr-10 text-sm rounded-lg border-2 border-slate-300 dark:text-black focus:outline-none focus:border-slate-300 flex items-center justify-between"
                      onClick={toggleDropdown}
                      type="button"
                    >
                      <span className="truncate">{getFilterText()}</span>
                      <IoIosArrowDown className="text-black cursor-pointer flex-shrink-0 ml-2" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-12 right-0 w-full sm:w-48 bg-white border border-gray-300 rounded shadow-lg z-20">
                        <ul className="text-sm">
                          <li
                            className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleFilterChange('Inasistencia')}
                          >
                            <span className="text-red-500 mr-2 flex-shrink-0">❌</span>
                            <span className="truncate">Inasistencia</span>
                          </li>
                          <li
                            className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleFilterChange('Retardo')}
                          >
                            <span className="text-yellow-500 mr-2 flex-shrink-0">🟡</span>
                            <span className="truncate">Retardo</span>
                          </li>
                          <li
                            className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleFilterChange('Justificacion')}
                          >
                            <span className="text-blue-500 mr-2 flex-shrink-0">🟦</span>
                            <span className="truncate">Justificación</span>
                          </li>
                          <li
                            className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleFilterChange('all')}
                          >
                            <span className="mr-2 flex-shrink-0">📅</span>
                            <span className="truncate">Todos</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Leyenda responsive para móviles */}
                {isMobile && (
                  <div className="mb-4 px-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-1">❌</span>
                        <span>Inasistencia</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">🟡</span>
                        <span>Retardo</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-500 mr-1">🟦</span>
                        <span>Justificación</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">📅</span>
                        <span>Todos</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calendario ScheduleX */}
                <div className="mt-4 sm:mt-6 mx-2 sm:mx-6">
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