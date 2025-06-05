'use client'

import { useState, useEffect, useCallback } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import '@schedule-x/theme-default/dist/index.css'
import { allEvents } from '@data/allEvents';

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

  // Configurar el calendario
  const eventsService = useState(() => createEventsServicePlugin())[0];

  // Función para obtener eventos filtrados
  const getFilteredEvents = useCallback(() => {
    if (filter === 'all') return allEvents;
    return allEvents.filter(event => event.type === filter);
  }, [filter]);


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
      const currentEvents = eventsService.getAll();
      currentEvents.forEach(event => {
        eventsService.remove(event.id);
      });

      const filteredEvents = getFilteredEvents();
      filteredEvents.forEach(event => {
        eventsService.add(event);
      });
    }
  }, [filter, calendar, eventsService, getFilteredEvents]);


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
    <div className="w-full min-h-screen">
      <div className="p-0 sm:p-0 md:p-0 xl:p-0 h-full flex flex-col justify-start">
        <h1 className="text-darkGreen dark:text-blue-400 text-3xl lg:text-4xl pb-3 border-b-2 border-darkGreen/20 dark:border-gray-600 w-full sm:w-3/4 lg:w-1/2 font-inter font-semibold transition-colors duration-300 mb-6 px-4 pt-6">
          Mi Asistencia
        </h1>
        {/* Header de mes y filtros */}
        <div className="w-full max-w-4xl flex flex-col gap-4 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 w-full">
            <h2 className="text-darkGreen dark:text-blue-400 font-inter font-semibold text-xl sm:text-2xl md:text-3xl ml-0 sm:ml-6">
              Calendario
            </h2>
            <div className="relative w-full sm:w-72 h-10 mr-0 sm:mr-6">
              <button
                className="font-inter font-normal h-8 w-full sm:w-48 pl-2 pr-10 text-sm rounded-lg border-2 border-darkGreen/20 dark:border-gray-600 bg-white dark:bg-gray-800 text-darkBlue dark:text-white focus:outline-none focus:border-slate-300 flex items-center justify-between"
                onClick={toggleDropdown}
                type="button"
              >
                <span className="truncate">{getFilterText()}</span>
                <IoIosArrowDown className="text-darkBlue dark:text-blue-400 cursor-pointer flex-shrink-0 ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-12 right-0 w-full sm:w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-20">
                  <ul className="text-sm">
                    <li
                      className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleFilterChange('Inasistencia')}
                    >
                      <span className="text-red-500 mr-2 flex-shrink-0">❌</span>
                      <span className="truncate">Inasistencia</span>
                    </li>
                    <li
                      className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleFilterChange('Retardo')}
                    >
                      <span className="text-yellow-500 mr-2 flex-shrink-0">🟡</span>
                      <span className="truncate">Retardo</span>
                    </li>
                    <li
                      className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleFilterChange('Justificacion')}
                    >
                      <span className="text-blue-500 mr-2 flex-shrink-0">🟦</span>
                      <span className="truncate">Justificación</span>
                    </li>
                    <li
                      className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
        </div>
        {/* Calendario ScheduleX expandido y alineado a la izquierda (max-w-7xl) */}
        <div className="flex-1 w-full flex flex-col items-start justify-center px-4 pb-6">
          <div className="w-full max-w-7xl h-full border-2 border-darkGreen/20 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex flex-col">
            <div className="flex-1 w-full h-full flex flex-col">
              <ScheduleXCalendar calendarApp={calendar} className="flex-1 w-full h-full !min-h-0 !min-w-0" style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
      {/* Inyectar estilos CSS personalizados */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
    </div>
  );
}