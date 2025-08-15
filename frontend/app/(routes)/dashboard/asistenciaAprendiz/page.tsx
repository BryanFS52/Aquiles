'use client'

import { useState, useEffect, useCallback } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg } from '@fullcalendar/core'
import { allEvents } from '@data/allEvents';
import PageTitle from "@components/UI/pageTitle";

// Tipos TypeScript
interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  type: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  className: string;
  extendedProps: {
    type: string;
  };
}

type FilterType = 'all' | 'Asistencia' | 'Inasistencia' | 'Retardo' | 'Justificacion';

// Estilos CSS personalizados para FullCalendar
const customStyles = `
  /* Personalización general del calendario */
  .fc {
    font-family: 'Inter', sans-serif;
  }
  
  /* Agrandar las cuadrículas significativamente */
  .fc-daygrid-day {
    min-height: 150px !important;
    padding: 0 !important;
    position: relative !important;
  }
  
  .fc-daygrid-day-frame {
    min-height: 150px !important;
    padding: 0 !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
  }
  
  .fc-daygrid-day-top {
    padding: 8px !important;
    position: relative !important;
    z-index: 2 !important;
  }
  
    .fc-daygrid-day-number {
    padding: 8px 12px !important;
    font-weight: 700 !important;
    color: #374151 !important;
    font-size: 1rem !important;
    text-decoration: none !important;
    position: absolute !important;
    top: 8px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 2 !important;
    border-radius: 8px !important;
    width: auto !important;
    height: auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: none !important;
    text-align: center !important;
    line-height: 1.2 !important;
    background: transparent !important;
  }
  
  /* Ocultar los eventos originales ya que aparecen en el número */
  .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-events {
    display: none !important;
  }
  
  .fc-daygrid-event-harness {
    margin: 1px 2px !important;
  }
  
  .fc-daygrid-event {
    margin: 1px 0 !important;
    padding: 2px 6px !important;
    font-size: 0.75rem !important;
    border-radius: 4px !important;
    font-weight: 500 !important;
    text-align: left !important;
    height: auto !important;
    display: block !important;
    min-height: 20px !important;
    line-height: 1.2 !important;
  }
  
  /* El número del día con texto del evento en el mismo cuadrado */
  .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number {
    position: absolute !important;
    top: 8px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 3 !important;
    border-radius: 8px !important;
    width: 80px !important;
    height: 60px !important;
    padding: 8px 12px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
    text-align: center !important;
    line-height: 1.2 !important;
  }
  
  /* Agregar el texto del evento después del número */
  .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number::after {
    content: attr(data-event-text) !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    margin-top: 3px !important;
    opacity: 0.95 !important;
  }
  
  /* Estilos para eventos de asistencia - sin fondo completo */
  .fc-event.asistencia {
    background-color: #22c55e !important;
    border-color: #16a34a !important;
    color: white !important;
    box-shadow: 0 1px 3px rgba(34, 197, 94, 0.3) !important;
  }
  
  /* Estilos para eventos de inasistencia - sin fondo completo */
  .fc-event.inasistencia {
    background-color: #ef4444 !important;
    border-color: #dc2626 !important;
    color: white !important;
    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.3) !important;
  }
  
  /* Estilos para eventos de retardo - sin fondo completo */
  .fc-event.retardo {
    background-color: #fbbf24 !important;
    border-color: #ffc405 !important;
    color: white !important;
    box-shadow: 0 1px 3px rgba(251, 191, 36, 0.3) !important;
  }
  
  /* Estilos para eventos de justificación - sin fondo completo */
  .fc-event.justificacion {
    background-color: #ff7417 !important;
    border-color: #e65a00 !important;
    color: white !important;
    box-shadow: 0 1px 3px rgba(255, 116, 23, 0.3) !important;
  }
  
  /* ===== ESTILOS PARA VISTA DE SEMANA Y DÍA ===== */
  
  /* Vista de semana - eventos en timeline */
  .fc-timegrid-event.asistencia {
    background-color: #22c55e !important;
    border-color: #16a34a !important;
    color: white !important;
  }
  
  .fc-timegrid-event.inasistencia {
    background-color: #ef4444 !important;
    border-color: #dc2626 !important;
    color: white !important;
  }
  
  .fc-timegrid-event.retardo {
    background-color: #fbbf24 !important;
    border-color: #ffc405 !important;
    color: white !important;
  }
  
  .fc-timegrid-event.justificacion {
    background-color: #ff7417 !important;
    border-color: #e65a00 !important;
    color: white !important;
  }
  
  /* Vista de lista - eventos en lista */
  .fc-list-event.asistencia .fc-list-event-dot {
    background-color: #22c55e !important;
    border-color: #16a34a !important;
  }
  
  .fc-list-event.inasistencia .fc-list-event-dot {
    background-color: #ef4444 !important;
    border-color: #dc2626 !important;
  }
  
  .fc-list-event.retardo .fc-list-event-dot {
    background-color: #fbbf24 !important;
    border-color: #ffc405 !important;
  }
  
  .fc-list-event.justificacion .fc-list-event-dot {
    background-color: #ff7417 !important;
    border-color: #e65a00 !important;
  }
  
  /* Títulos de eventos en todas las vistas */
  .fc-event-title {
    font-weight: 600 !important;
    font-size: 0.875rem !important;
  }
  
  /* Tiempo de eventos en vista de semana/día */
  .fc-event-time {
    font-weight: 500 !important;
    font-size: 0.75rem !important;
  }
  
  /* Mejorar legibilidad en vista de día */
  .fc-timegrid-event .fc-event-main {
    padding: 4px 6px !important;
  }
  
  /* Estilos para eventos de día completo en vista de semana */
  .fc-timegrid-event.fc-event-mirror {
    opacity: 0.8 !important;
  }
  
  /* ===== ESTILOS ESPECÍFICOS POR VISTA ===== */
  
  /* Vista de Mes - mantener estilos actuales */
  .fc-view-month .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-events {
    display: none !important;
  }
  
  /* Vista de Semana - mostrar eventos normalmente */
  .fc-view-week .fc-timegrid-event {
    border-radius: 4px !important;
    padding: 2px 4px !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
  }
  
  .fc-view-week .fc-event-time {
    display: block !important;
    font-weight: 500 !important;
  }
  
  .fc-view-week .fc-event-title {
    display: block !important;
    margin-top: 2px !important;
  }
  
  /* Vista de Día - eventos más grandes */
  .fc-view-day .fc-timegrid-event {
    border-radius: 6px !important;
    padding: 6px 8px !important;
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    min-height: 30px !important;
  }
  
  .fc-view-day .fc-event-time {
    display: block !important;
    font-weight: 600 !important;
    font-size: 0.75rem !important;
  }
  
  .fc-view-day .fc-event-title {
    display: block !important;
    margin-top: 4px !important;
    font-size: 0.875rem !important;
  }
  
  /* Headers de tiempo en vista de semana/día */
  .fc-timegrid-slot-label {
    font-size: 0.75rem !important;
    color: #6b7280 !important;
  }
  
  /* Líneas de cuadrícula más suaves */
  .fc-timegrid-slot {
    border-color: #f3f4f6 !important;
  }
  
  .fc-timegrid-slot-minor {
    border-color: #f9fafb !important;
  }
  
  /* Indicador de hora actual */
  .fc-timegrid-now-indicator-line {
    border-color: #ef4444 !important;
    border-width: 2px !important;
  }
  
  .fc-timegrid-now-indicator-arrow {
    border-left-color: #ef4444 !important;
    border-width: 6px !important;
  }
  
  .fc-toolbar-title {
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    color: #1f2937;
    text-transform: capitalize !important;
  }
  
  .fc-button {
    background-color: #f3f4f6 !important;
    border-color: #d1d5db !important;
    color: #374151 !important;
    border-radius: 6px !important;
    padding: 0.5rem 1rem !important;
  }
  
  .fc-button:hover {
    background-color: #e5e7eb !important;
    border-color: #9ca3af !important;
  }
  
  .fc-button-active {
    background-color: #3b82f6 !important;
    border-color: #3b82f6 !important;
    color: white !important;
  }
  
  .fc-day-today {
    background-color: #f0f9ff !important;
  }
  
  .fc-day-today .fc-daygrid-day-number {
    background: #3b82f6 !important;
    color: white !important;
  }
  
  /* Número del día en celdas con eventos - estilo como día actual */
  .fc-daygrid-day:has(.fc-daygrid-event.asistencia) .fc-daygrid-day-number {
    background: #22c55e !important;
    color: white !important;
    border: none !important;
  }
  
  .fc-daygrid-day:has(.fc-daygrid-event.inasistencia) .fc-daygrid-day-number {
    background: #ef4444 !important;
    color: white !important;
    border: none !important;
  }
  
  .fc-daygrid-day:has(.fc-daygrid-event.retardo) .fc-daygrid-day-number {
    background: #fbbf24 !important;
    color: white !important;
    border: none !important;
  }
  
  .fc-daygrid-day:has(.fc-daygrid-event.justificacion) .fc-daygrid-day-number {
    background: #ff7417 !important;
    color: white !important;
    border: none !important;
  }

  /* Responsive con cuadrículas grandes */
  @media (max-width: 768px) {
    .fc-toolbar {
      flex-direction: column !important;
      gap: 0.5rem !important;
      margin-bottom: 1rem !important;
    }
    
    .fc-toolbar-chunk {
      display: flex !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
      gap: 0.25rem !important;
    }
    
    .fc-toolbar-title {
      font-size: 1.1rem !important;
      margin: 0 !important;
      text-align: center !important;
    }
    
    .fc-button {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.75rem !important;
      min-height: 32px !important;
    }
    
    .fc-button-group {
      gap: 0.125rem !important;
    }
    
    /* Cuadrículas más pequeñas en móvil */
    .fc-daygrid-day {
      min-height: 80px !important;
    }
    
    .fc-daygrid-day-frame {
      min-height: 80px !important;
    }
    
    .fc-daygrid-day-number {
      font-size: 0.75rem !important;
      padding: 4px 6px !important;
      width: auto !important;
      height: auto !important;
      background: transparent !important;
      box-shadow: none !important;
      top: 4px !important;
    }
    
    .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number {
      width: 50px !important;
      height: 35px !important;
      padding: 4px 6px !important;
      font-size: 0.7rem !important;
      top: 4px !important;
    }
    
    .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number::after {
      font-size: 0.55rem !important;
      margin-top: 1px !important;
    }
    
    /* Headers de días más pequeños */
    .fc-col-header-cell {
      padding: 0.25rem !important;
    }
    
    .fc-col-header-cell-cushion {
      font-size: 0.75rem !important;
      padding: 0.25rem !important;
    }
    
    /* Vista de día en móvil */
    .fc-view-day .fc-timegrid-event {
      border-radius: 4px !important;
      padding: 4px 6px !important;
      font-size: 0.7rem !important;
      min-height: 25px !important;
    }
    
    .fc-view-day .fc-event-time {
      font-size: 0.65rem !important;
    }
    
    .fc-view-day .fc-event-title {
      font-size: 0.7rem !important;
      margin-top: 2px !important;
    }
    
    .fc-timegrid-slot-label {
      font-size: 0.65rem !important;
    }
    
    /* Vista de semana en móvil */
    .fc-view-week .fc-timegrid-event {
      border-radius: 3px !important;
      padding: 2px 3px !important;
      font-size: 0.65rem !important;
      min-height: 20px !important;
    }
    
    .fc-view-week .fc-event-time {
      font-size: 0.6rem !important;
    }
    
    .fc-view-week .fc-event-title {
      font-size: 0.65rem !important;
      margin-top: 1px !important;
    }
    
    .fc-view-week .fc-timegrid-slot-label {
      font-size: 0.6rem !important;
    }
    
    .fc-view-week .fc-col-header-cell-cushion {
      font-size: 0.65rem !important;
      padding: 0.2rem !important;
    }
  }

  /* Tablet responsive */
  @media (min-width: 769px) and (max-width: 1024px) {
    .fc-toolbar-title {
      font-size: 1.35rem !important;
    }
    
    .fc-button {
      padding: 0.4rem 0.8rem !important;
      font-size: 0.85rem !important;
    }
    
    .fc-daygrid-day {
      min-height: 120px !important;
    }
    
    .fc-daygrid-day-frame {
      min-height: 120px !important;
    }
    
    .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number {
      width: 70px !important;
      height: 55px !important;
      font-size: 0.9rem !important;
    }
    
    .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number::after {
      font-size: 0.7rem !important;
    }
  }

  /* Móvil extra pequeño */
  @media (max-width: 480px) {
    .fc-toolbar-title {
      font-size: 1rem !important;
    }
    
    .fc-button {
      padding: 0.2rem 0.4rem !important;
      font-size: 0.7rem !important;
      min-height: 28px !important;
    }
    
    .fc-daygrid-day {
      min-height: 60px !important;
    }
    
    .fc-daygrid-day-frame {
      min-height: 60px !important;
    }
    
    .fc-daygrid-day-number {
      font-size: 0.7rem !important;
      padding: 2px 4px !important;
      top: 2px !important;
    }
    
    .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number {
      width: 40px !important;
      height: 28px !important;
      padding: 2px 4px !important;
      font-size: 0.65rem !important;
      top: 2px !important;
    }
    
    .fc-daygrid-day:has(.fc-daygrid-event) .fc-daygrid-day-number::after {
      font-size: 0.5rem !important;
      margin-top: 1px !important;
    }
    
    .fc-col-header-cell-cushion {
      font-size: 0.7rem !important;
      padding: 0.15rem !important;
    }
    
    /* Vista de día en móvil extra pequeño */
    .fc-view-day .fc-timegrid-event {
      border-radius: 3px !important;
      padding: 3px 4px !important;
      font-size: 0.65rem !important;
      min-height: 22px !important;
    }
    
    .fc-view-day .fc-event-time {
      font-size: 0.6rem !important;
    }
    
    .fc-view-day .fc-event-title {
      font-size: 0.65rem !important;
      margin-top: 1px !important;
    }
    
    .fc-timegrid-slot-label {
      font-size: 0.6rem !important;
      padding: 0.1rem !important;
    }
    
    .fc-timegrid-slot {
      height: 30px !important;
    }
    
    /* Vista de semana en móvil extra pequeño */
    .fc-view-week .fc-timegrid-event {
      border-radius: 2px !important;
      padding: 1px 2px !important;
      font-size: 0.6rem !important;
      min-height: 18px !important;
    }
    
    .fc-view-week .fc-event-time {
      font-size: 0.55rem !important;
    }
    
    .fc-view-week .fc-event-title {
      font-size: 0.6rem !important;
      margin-top: 0px !important;
    }
    
    .fc-view-week .fc-timegrid-slot-label {
      font-size: 0.55rem !important;
      padding: 0.05rem !important;
    }
    
    .fc-view-week .fc-col-header-cell-cushion {
      font-size: 0.6rem !important;
      padding: 0.1rem !important;
    }
    
    .fc-view-week .fc-timegrid-slot {
      height: 25px !important;
    }
  }

  /* Dark mode support */
  .dark .fc {
    background-color: #1f2937;
    color: white;
  }
  
  .dark .fc-toolbar-title {
    color: white !important;
  }
  
  .dark .fc-button {
    background-color: #374151 !important;
    border-color: #4b5563 !important;
    color: white !important;
  }
  
  .dark .fc-button:hover {
    background-color: #4b5563 !important;
  }
  
  .dark .fc-day-today {
    background-color: #1e3a8a !important;
  }
  
  .dark .fc-daygrid-day {
    border-color: #374151 !important;
  }
  
  .dark .fc-daygrid-day-number {
    background: transparent !important;
    color: #e5e7eb !important;
    box-shadow: none !important;
  }
  
  .dark .fc-day-today .fc-daygrid-day-number {
    background: #3b82f6 !important;
    color: white !important;
  }
`;

export default function AsistenciaAprendiz() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
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

  // Función para obtener eventos filtrados y formatearlos para FullCalendar
  const getFilteredEvents = useCallback(() => {
    const filteredEvents = filter === 'all' ? allEvents : allEvents.filter(event => event.type === filter);

    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      className: event.type.toLowerCase(),
      extendedProps: {
        type: event.type
      }
    }));
  }, [filter]);

  // Función para manejar el cambio de filtro
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setIsDropdownOpen(false);
  };

  // Obtener texto del filtro actual
  const getFilterText = () => {
    switch (filter) {
      case 'Asistencia': return 'Asistencias';
      case 'Inasistencia': return 'Inasistencias';
      case 'Retardo': return 'Retardos';
      case 'Justificacion': return 'Justificaciones';
      default: return 'Todos';
    }
  };

  // Configuración de FullCalendar
  const calendarConfig = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: isMobile ? 'dayGridMonth,timeGridWeek,timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: getFilteredEvents(),
    height: 'auto',
    aspectRatio: isMobile ? 1.0 : 1.5,
    contentHeight: isMobile ? 'auto' : 600,
    eventClick: (info: EventClickArg) => {
      router.push('/justificacionesAprendiz');
    },
    locale: 'es',
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    titleFormat: { year: 'numeric' as const, month: 'long' as const },
    dayHeaderFormat: { weekday: 'short' as const },
    eventDisplay: 'auto' as const,
    displayEventTime: true,
    displayEventEnd: false,
    eventTimeFormat: {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      hour12: false
    },
    slotLabelFormat: {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      hour12: false
    },
    allDaySlot: false,
    slotMinTime: '07:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:30:00',
    slotLabelInterval: '01:00:00',
    expandRows: true,
    eventBackgroundColor: 'transparent',
    eventBorderColor: 'transparent',
    fixedWeekCount: false,
    showNonCurrentDates: true,
    nowIndicator: true,
    dayMaxEvents: false,
    moreLinkClick: 'popover',
    weekends: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
      startTime: '08:00',
      endTime: '17:00',
    },
    eventDidMount: (info: any) => {
      // Aplicar estilos específicos según el tipo de evento
      const eventType = info.event.extendedProps.type?.toLowerCase();
      if (eventType) {
        info.el.classList.add(eventType);
      }
    },
    dayCellDidMount: (info: any) => {
      // Solo para vista de mes - encontrar eventos para este día
      if (info.view.type === 'dayGridMonth') {
        const dayEvents = getFilteredEvents().filter(event =>
          event.start.split('T')[0] === info.date.toISOString().split('T')[0]
        );

        if (dayEvents.length > 0) {
          const dayNumber = info.el.querySelector('.fc-daygrid-day-number');
          if (dayNumber) {
            // Agregar el texto del primer evento
            const eventText = dayEvents[0].title;
            dayNumber.setAttribute('data-event-text', eventText);
          }
        }
      }
    },
    viewDidMount: (info: any) => {
      // Ajustar estilos según la vista actual
      const viewType = info.view.type;
      const calendarEl = info.el;

      // Remover clases anteriores
      calendarEl.classList.remove('fc-view-month', 'fc-view-week', 'fc-view-day');

      // Agregar clase específica para la vista
      switch (viewType) {
        case 'dayGridMonth':
          calendarEl.classList.add('fc-view-month');
          break;
        case 'timeGridWeek':
          calendarEl.classList.add('fc-view-week');
          break;
        case 'timeGridDay':
          calendarEl.classList.add('fc-view-day');
          break;
      }
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="p-0 sm:p-0 md:p-0 xl:p-0 h-full flex flex-col justify-start">
        <PageTitle>Mi Asistencia</PageTitle>

        {/* Header de mes y filtros */}
        <div className="w-full flex flex-col gap-4 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 w-full">
            <div className="relative w-full sm:w-auto">
              <button
                className="font-inter font-normal h-10 w-full sm:w-48 px-3 pr-10 text-sm rounded-lg border-2 border-darkGreen/20 dark:border-gray-600 bg-white dark:bg-gray-800 text-darkBlue dark:text-white focus:outline-none focus:border-slate-300 flex items-center justify-between"
                onClick={toggleDropdown}
                type="button"
              >
                <span className="truncate">{getFilterText()}</span>
                <IoIosArrowDown className="text-darkBlue dark:text-blue-400 cursor-pointer flex-shrink-0 ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-12 left-0 right-0 sm:right-auto sm:w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-20">
                  <ul className="text-sm">
                    <li
                      className="font-inter flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleFilterChange('Asistencia')}
                    >
                      <span className="text-green-500 mr-2 flex-shrink-0">✅</span>
                      <span className="truncate">Asistencia</span>
                    </li>
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
            <div className="mb-4 px-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center">
                  <span className="text-green-500 mr-1">✅</span>
                  <span>Asistencia</span>
                </div>
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
              </div>
              <div className="mt-3 flex justify-center">
                <div className="flex items-center">
                  <span className="mr-1">📅</span>
                  <span>Todos</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendario FullCalendar */}
        <div className="flex-1 w-full flex flex-col items-center justify-center px-2 sm:px-4 pb-4 sm:pb-6">
          <div className="w-full max-w-7xl h-full rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-2 sm:p-4">
            <FullCalendar {...calendarConfig} />
          </div>
        </div>
      </div>

      {/* Inyectar estilos CSS personalizados */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
    </div>
  );
}