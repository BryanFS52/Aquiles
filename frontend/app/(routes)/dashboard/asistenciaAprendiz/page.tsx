'use client'

import { useState, useEffect, useCallback } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { EventClickArg } from '@fullcalendar/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { fetchAttendanceAndCompetenceByStudent } from '@slice/attendanceSlice';
import { Attendance } from '@graphql/generated';
import { useLoader } from "@context/LoaderContext";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import Modal from "@components/UI/Modal";

// Tipos TypeScript

type FilterType = 'all' | 'Asistencia' | 'Inasistencia' | 'Retardo' | 'Justificacion';

// Estilos CSS personalizados para FullCalendar
const customStyles = `
  /* Personalización general del calendario */
  .fc {
    font-family: 'Inter', sans-serif;
    width: 100% !important;
    min-width: 900px !important; /* Asegurar ancho mínimo en desktop */
  }
  
  /* Hacer el calendario más ancho */
  .fc-view-harness {
    width: 100% !important;
    min-width: 100% !important;
  }
  
  .fc-view {
    width: 100% !important;
    min-width: 100% !important;
  }
  
  .fc-scrollgrid {
    width: 100% !important;
    min-width: 100% !important;
  }
  
  .fc-scrollgrid-sync-table {
    width: 100% !important;
  }
  
  /* Hacer las columnas de días más anchas en desktop */
  .fc-daygrid-day {
    min-width: 120px !important; /* Aumentar ancho mínimo de los días */
    width: auto !important;
  }
  
  .fc-col-header-cell {
    min-width: 120px !important; /* Hacer headers más anchos */
    width: auto !important;
  }
  
  /* Agrandar las cuadrículas para acomodar múltiples eventos */
  .fc-daygrid-day {
    height: 160px !important; /* Aumentada para acomodar múltiples eventos */
    padding: 0 !important;
    position: relative !important;
    overflow: visible !important; /* Cambiar a visible para que se vean múltiples eventos */
  }
  
  .fc-daygrid-day-frame {
    height: 160px !important; /* Aumentada para acomodar múltiples eventos */
    padding: 40px 0 0 0 !important; /* Padding superior para crear espacio */
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: visible !important; /* Permitir que los eventos se vean */
  }
  
  .fc-daygrid-day-top {
    padding: 8px !important;
    position: relative !important;
    z-index: 2 !important;
  }
  
  /* Número del día - estilo principal */
  .fc-daygrid-day-number {
    padding: 6px 8px !important;
    font-weight: 600 !important;
    color: #374151 !important;
    font-size: 0.875rem !important;
    text-decoration: none !important;
    position: absolute !important;
    top: -32px !important; /* Ajustado para el nuevo padding */
    right: 8px !important;
    z-index: 10 !important;
    border-radius: 6px !important;
    background: rgba(255, 255, 255, 0.95) !important;
    min-width: 28px !important;
    height: 28px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.2s ease !important;
  }
  
  /* Mostrar los eventos originales como bloques individuales */
        .fc-daygrid-day-events {
          display: flex !important;
          flex-direction: column !important;
          gap: 1px !important;
          padding: 1px !important;
          overflow: visible !important;
          height: auto !important;
          z-index: 1 !important;
          position: relative !important;
        }  .fc-daygrid-event-harness {
    margin: 3px 2px !important; /* Mejor espaciado entre eventos */
  }
  
  .fc-daygrid-event {
    margin: 3px 0 !important; /* Mejor espaciado vertical */
    padding: 5px 7px !important; /* Padding mejorado para legibilidad */
    font-size: 0.75rem !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
    text-align: center !important;
    height: auto !important;
    display: block !important;
    min-height: 24px !important; /* Altura mínima un poco más generosa */
    line-height: 1.2 !important;
    border: 1px solid !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }

  /* Hover effect para eventos */
  .fc-daygrid-event:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }

  /* Estilos especiales para días con múltiples eventos */
  .fc-daygrid-day:has(.fc-daygrid-event + .fc-daygrid-event) .fc-daygrid-event {
    margin: 2px 0 !important; /* Mejor espaciado para múltiples eventos */
    padding: 3px 5px !important;
    font-size: 0.7rem !important;
    min-height: 20px !important;
  }

  /* Espaciado mejorado entre eventos múltiples */
  .fc-daygrid-event + .fc-daygrid-event {
    margin-top: 3px !important; /* Más espacio entre eventos consecutivos */
  }
  
  /* Asegurar que los eventos se muestren uno debajo del otro */
  .fc-daygrid-day-events {
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important; /* Espacio entre eventos */
  }
  
  /* Forzar que todos los eventos sean visibles */
  .fc-daygrid-event-harness {
    display: block !important;
    position: relative !important;
    z-index: 1 !important;
  }
  
  /* Evitar que eventos se oculten detrás de otros */
  .fc-daygrid-event {
    position: relative !important;
    z-index: 2 !important;
    display: block !important;
    width: 100% !important;
    box-sizing: border-box !important;
    margin-bottom: 1px !important;
    height: 18px !important;
    line-height: 18px !important;
    font-size: 10px !important;
    text-align: center !important;
    color: white !important;
    border-radius: 4px !important;
    border: none !important;
    padding: 0 4px !important;
    overflow: hidden !important;
  }

  /* Estilo específico para múltiples eventos en el mismo día */
  .fc-daygrid-event:nth-child(2) {
    margin-top: -2px !important;
    position: relative !important;
    top: -1px !important;
  }
  
  /* Espaciado y estructura de los días */
  
  /* Estilos para eventos de asistencia */
  .fc-event.asistencia,
  .fc-daygrid-event.asistencia {
    background-color: #22c55e !important;
    border-color: #16a34a !important;
    color: white !important;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3) !important;
  }
  
  /* Estilos para eventos de inasistencia */
  .fc-event.inasistencia,
  .fc-daygrid-event.inasistencia {
    background-color: #ef4444 !important;
    border-color: #dc2626 !important;
    color: white !important;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3) !important;
  }
  
  /* Estilos para eventos de retardo */
  .fc-event.retardo,
  .fc-daygrid-event.retardo {
    background-color: #fbbf24 !important;
    border-color: #f59e0b !important;
    color: white !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
  }
  
  /* Estilos para eventos de justificación */
  .fc-event.justificacion,
  .fc-daygrid-event.justificacion {
    background-color: #f97316 !important;
    border-color: #ea580c !important;
    color: white !important;
    box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3) !important;
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
  
  /* Estilo especial para el día actual */
  .fc-day-today .fc-daygrid-day-number {
    background: #3b82f6 !important;
    color: white !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3) !important;
  }
  
  /* Hover effect para números de días */
  .fc-daygrid-day-number:hover {
    background: rgba(59, 130, 246, 0.1) !important;
    transform: scale(1.05) !important;
  }
  
  .fc-day-today .fc-daygrid-day-number:hover {
    background: #2563eb !important;
    transform: scale(1.05) !important;
  }
  
  /* Responsive con cuadrículas optimizadas para móvil */
  @media (max-width: 768px) {
    .fc {
      min-width: 100% !important; /* Permitir que se ajuste al ancho completo */
      width: 100% !important;
      font-size: 12px !important; /* Reducir tamaño base de fuente */
    }
    
    /* Eliminar scroll horizontal */
    .fc .fc-view-harness {
      overflow-x: hidden !important;
    }
    
    .fc-daygrid-day {
      min-width: auto !important; /* Permitir que se ajuste dinámicamente */
      width: calc(100% / 7) !important; /* Dividir equitativamente entre 7 días */
    }
    
    .fc-col-header-cell {
      min-width: auto !important;
      width: calc(100% / 7) !important;
    }
    
    /* Reorganizar toolbar en móvil */
    .fc-toolbar {
      flex-direction: column !important;
      gap: 0.75rem !important;
      margin-bottom: 1rem !important;
      padding: 0.5rem !important;
    }
    
    .fc-toolbar-chunk {
      display: flex !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
      gap: 0.5rem !important;
    }
    
    .fc-toolbar-title {
      font-size: 1.1rem !important;
      margin: 0 !important;
      text-align: center !important;
      order: -1 !important; /* Poner título arriba */
      width: 100% !important;
      margin-bottom: 0.5rem !important;
    }
    
    .fc-button {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.75rem !important;
      min-height: 36px !important;
      min-width: 60px !important;
    }
    
    .fc-button-group {
      gap: 0.25rem !important;
    }
    
    /* Cuadrículas optimizadas en móvil */
    .fc-daygrid-day {
      height: 80px !important; /* Reducir altura para mejor visibilidad */
      padding: 0 !important;
    }
    
    .fc-daygrid-day-frame {
      height: 80px !important;
      padding: 24px 0 0 0 !important;
      display: flex !important;
      flex-direction: column !important;
    }

    .fc-daygrid-day-events {
      margin-top: 0 !important;
      top: 0 !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
      padding: 2px !important;
      gap: 1px !important;
    }
    
    .fc-daygrid-day-number {
      font-size: 0.7rem !important;
      padding: 2px 4px !important;
      min-width: 20px !important;
      height: 20px !important;
      top: 2px !important;
      right: 2px !important;
      position: absolute !important;
      z-index: 10 !important;
    }
    
    /* Eventos más pequeños y legibles en móvil */
    .fc-daygrid-event {
      margin: 1px 0 !important;
      padding: 2px 4px !important;
      font-size: 0.65rem !important;
      min-height: 16px !important;
      line-height: 1.1 !important;
      border-radius: 3px !important;
      height: auto !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    
    .fc-daygrid-event-harness {
      margin: 1px !important;
    }
    
    /* Headers de días más pequeños */
    .fc-col-header-cell {
      padding: 0.25rem 0.125rem !important;
    }
    
    .fc-col-header-cell-cushion {
      font-size: 0.7rem !important;
      padding: 0.25rem 0.125rem !important;
      text-align: center !important;
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
      padding: 0.25rem !important;
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
    
    /* Mejorar scroll en vistas de tiempo */
    .fc-scroller {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    
    /* Ocultar algunos elementos no esenciales en móvil */
    .fc-timegrid-axis {
      width: 35px !important;
    }
    
    .fc-timegrid-axis-cushion {
      font-size: 0.6rem !important;
      padding: 0.125rem !important;
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
      height: 120px !important;
    }
    
    .fc-daygrid-day-frame {
      height: 120px !important;
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

  /* Móvil extra pequeño - optimizado para pantallas muy pequeñas */
  @media (max-width: 480px) {
    .fc {
      font-size: 11px !important;
    }
    
    .fc-toolbar {
      padding: 0.25rem !important;
      gap: 0.5rem !important;
    }
    
    .fc-toolbar-title {
      font-size: 1rem !important;
      font-weight: 600 !important;
    }
    
    .fc-button {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.7rem !important;
      min-height: 32px !important;
      min-width: 50px !important;
    }
    
    /* Cuadrículas muy compactas */
    .fc-daygrid-day {
      height: 70px !important;
    }
    
    .fc-daygrid-day-frame {
      height: 70px !important;
      padding: 20px 0 0 0 !important;
    }

    .fc-daygrid-day-events {
      padding: 1px !important;
      gap: 0.5px !important;
    }
    
    .fc-daygrid-day-number {
      font-size: 0.65rem !important;
      padding: 1px 3px !important;
      min-width: 18px !important;
      height: 18px !important;
      top: 1px !important;
      right: 1px !important;
      border-radius: 4px !important;
    }
    
    /* Eventos muy pequeños pero legibles */
    .fc-daygrid-event {
      margin: 0.5px 0 !important;
      padding: 1px 3px !important;
      font-size: 0.6rem !important;
      min-height: 14px !important;
      line-height: 1 !important;
      border-radius: 2px !important;
      font-weight: 600 !important;
    }
    
    .fc-daygrid-event-harness {
      margin: 0.5px !important;
    }
    
    .fc-col-header-cell-cushion {
      font-size: 0.65rem !important;
      padding: 0.2rem 0.1rem !important;
      text-align: center !important;
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
      font-size: 0.55rem !important;
      min-height: 16px !important;
    }
    
    .fc-view-week .fc-event-time {
      font-size: 0.5rem !important;
    }
    
    .fc-view-week .fc-event-title {
      font-size: 0.55rem !important;
      margin-top: 0px !important;
    }
    
    .fc-view-week .fc-timegrid-slot-label {
      font-size: 0.5rem !important;
      padding: 0.05rem !important;
    }
    
    .fc-view-week .fc-col-header-cell-cushion {
      font-size: 0.55rem !important;
      padding: 0.1rem !important;
    }
    
    .fc-view-week .fc-timegrid-slot {
      height: 25px !important;
    }
    
    /* Optimizaciones adicionales para pantallas muy pequeñas */
    .fc-timegrid-axis {
      width: 30px !important;
    }
    
    .fc-timegrid-axis-cushion {
      font-size: 0.55rem !important;
      padding: 0.1rem !important;
    }
    
    /* Mejorar legibilidad en todos los eventos */
    .fc-daygrid-event, .fc-timegrid-event {
      text-shadow: none !important;
      font-weight: 600 !important;
    }
  }

  /* Estilos adicionales para mejorar la experiencia móvil */
  @media (max-width: 768px) {
    /* Prevenir zoom en inputs en iOS */
    .fc input, .fc select, .fc textarea {
      font-size: 16px !important;
    }
    
    /* Mejorar tap targets para móvil */
    .fc-button, .fc-daygrid-event {
      min-height: 44px !important;
      touch-action: manipulation !important;
    }
    
    .fc-daygrid-day-number {
      touch-action: manipulation !important;
    }
    
    /* Eliminar efectos hover en táctil */
    @media (hover: none) and (pointer: coarse) {
      .fc-button:hover,
      .fc-daygrid-event:hover,
      .fc-daygrid-day-number:hover {
        transform: none !important;
        box-shadow: inherit !important;
        background-color: inherit !important;
      }
    }
    
    /* Mejorar scroll suave */
    .fc-scroller {
      -webkit-overflow-scrolling: touch !important;
      scroll-behavior: smooth !important;
    }
  }

  /* Optimizaciones adicionales para pantallas ultra pequeñas */
  @media (max-width: 360px) {
    .fc {
      font-size: 10px !important;
    }
    
    .fc-toolbar-title {
      font-size: 0.9rem !important;
    }
    
    .fc-button {
      padding: 0.2rem 0.4rem !important;
      font-size: 0.65rem !important;
      min-width: 45px !important;
    }
    
    .fc-daygrid-day {
      height: 60px !important;
    }
    
    .fc-daygrid-day-frame {
      height: 60px !important;
      padding: 16px 0 0 0 !important;
    }
    
    .fc-daygrid-event {
      font-size: 0.55rem !important;
      min-height: 12px !important;
      padding: 1px 2px !important;
    }
    
    .fc-daygrid-day-number {
      font-size: 0.6rem !important;
      min-width: 16px !important;
      height: 16px !important;
    }
    
    .fc-col-header-cell-cushion {
      font-size: 0.6rem !important;
      padding: 0.1rem !important;
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

  // Estados para el modal de detalle de asistencia
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    date: string;
    attendanceId: number;
    competenceName?: string;
    competenceQuarterId?: string;
  } | null>(null);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();

  // Seleccionar datos del estado de Redux
  const { studentAttendances, studentAttendances: { loading, error } } = useSelector((state: RootState) => state.attendances);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cargar asistencias del estudiante al montar el componente
  useEffect(() => {
    const studentId = 1; // ID hardcodeado como solicitas
    dispatch(fetchAttendanceAndCompetenceByStudent({ id: studentId }));
  }, [dispatch]);

  // Manejar el loader basado en el estado de loading
  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);

  // Función para mapear el estado de la asistencia a un tipo de evento del calendario
  const mapAttendanceStateToEventType = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Presente': 'Asistencia',
      'Asistencia': 'Asistencia',
      'Inasistencia': 'Inasistencia',
      'Ausente': 'Inasistencia', // Mapear "Ausente" a "Inasistencia"
      'Retardo': 'Retardo',
      'Justificacion': 'Justificacion',
      'Justificado': 'Justificacion'
    };
    return statusMap[status] || 'Asistencia';
  };

  // Función para obtener eventos filtrados y formatearlos para FullCalendar
  const getFilteredEvents = useCallback(() => {
    if (!studentAttendances.data || studentAttendances.data.length === 0) {
      return [];
    }

    // Transformar cada asistencia a un evento individual del calendario
    const calendarEvents = studentAttendances.data
      .filter((attendance: any) => attendance.attendanceDate) // Filtrar eventos con fecha válida
      .map((attendance: any, index: number) => {
        const status = attendance.attendanceState?.status || 'Presente';
        const eventType = mapAttendanceStateToEventType(status);
        const competenceName = attendance.competenceQuarter?.competence?.name || '';

        // Crear un ID único combinando el ID original con el índice para evitar duplicados
        const uniqueId = `${attendance.id}-${index}`;

        return {
          id: uniqueId,
          title: status, // Usar el status original para mejor diferenciación
          start: attendance.attendanceDate!,
          end: attendance.attendanceDate!,
          type: eventType,
          className: eventType.toLowerCase(),
          extendedProps: {
            type: eventType,
            attendanceId: attendance.id,
            originalStatus: status, // Agregar el status original
            competenceName: competenceName, // Agregar el nombre de la competencia
            competenceQuarterId: attendance.competenceQuarter?.id || ''
          }
        };
      });

    // Filtrar eventos según el filtro seleccionado
    const filteredEvents = filter === 'all' ? calendarEvents : calendarEvents.filter((event: any) => event.type === filter);

    // Debug: Log para verificar eventos
    console.log('Total events created:', calendarEvents.length);
    console.log('Sample event with competence:', calendarEvents[0]);
    console.log('Filtered events:', filteredEvents.length);

    return filteredEvents;
  }, [studentAttendances.data, filter, mapAttendanceStateToEventType]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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

  // Funciones para manejar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleGoToJustifications = () => {
    closeModal();
    router.push('./justificacionesAprendiz');
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Presente':
      case 'Asistencia':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Inasistencia':
      case 'Ausente':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Retardo':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Justificacion':
      case 'Justificado':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Configuración de FullCalendar
  const calendarConfig = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: isMobile ? 'dayGridMonth,timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: getFilteredEvents(),
    height: 'auto',
    aspectRatio: isMobile ? 1.0 : 2.0,
    contentHeight: isMobile ? 'auto' : 700,
    eventClick: (info: EventClickArg) => {
      // Obtener información del evento específico
      const attendanceId = info.event.extendedProps.attendanceId;
      const eventTitle = info.event.title;
      const eventDate = info.event.startStr;
      const competenceName = info.event.extendedProps.competenceName;
      const competenceQuarterId = info.event.extendedProps.competenceQuarterId;

      // Establecer los datos del evento seleccionado y abrir el modal
      setSelectedEvent({
        id: info.event.id,
        title: eventTitle,
        date: eventDate,
        attendanceId: attendanceId,
        competenceName: competenceName,
        competenceQuarterId: competenceQuarterId
      });
      setIsModalOpen(true);
    },
    locale: 'es',
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    titleFormat: { year: 'numeric' as const, month: 'long' as const },
    dayHeaderFormat: { weekday: isMobile ? 'narrow' as const : 'short' as const },
    eventDisplay: 'block' as const, // Cambiar a 'block' para mejor visualización de múltiples eventos
    displayEventTime: false, // Ocultar tiempo para eventos de día completo
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
    fixedWeekCount: false,
    showNonCurrentDates: true,
    nowIndicator: true,
    dayMaxEvents: false, // Permitir mostrar todos los eventos
    dayMaxEventRows: false, // No limitar las filas de eventos
    moreLinkClick: 'popover',
    eventOrder: 'start,title', // Ordenar eventos por hora de inicio y título
    weekends: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
      startTime: '08:00',
      endTime: '17:00',
    },
    // Configuración responsiva adicional
    windowResizeDelay: 100,
    stickyHeaderDates: true,
    eventDidMount: (info: any) => {
      // Aplicar estilos específicos según el tipo de evento
      const eventType = info.event.extendedProps.type?.toLowerCase();
      if (eventType) {
        info.el.classList.add(eventType);

        // Aplicar colores directamente para asegurar la visualización
        const colors: Record<string, { background: string; border: string }> = {
          asistencia: { background: '#10b981', border: '#059669' },
          inasistencia: { background: '#ef4444', border: '#dc2626' },
          retardo: { background: '#f59e0b', border: '#d97706' },
          justificacion: { background: '#f97316', border: '#ea580c' }
        };

        const color = colors[eventType];
        if (color) {
          info.el.style.backgroundColor = color.background;
          info.el.style.borderColor = color.border;

          // Aplicar también a elementos internos del evento
          const fcEventMain = info.el.querySelector('.fc-event-main');
          if (fcEventMain) {
            fcEventMain.style.backgroundColor = color.background;
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

  // Early return para empty state (sin loading)
  if (!loading && (!studentAttendances.data || studentAttendances.data.length === 0)) {
    return <EmptyState message="No hay registros de asistencia disponibles" />;
  }

  return (
    <div className="w-full min-h-screen">
      <div className="p-0 sm:p-0 md:p-0 xl:p-0 h-full flex flex-col justify-start">
        <PageTitle>Mi Asistencia</PageTitle>

        {/* Header de mes y filtros */}
        <div className="w-full flex flex-col gap-4 px-1 sm:px-4">
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
                <div className="absolute top-12 left-0 right-0 sm:right-auto sm:w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50">
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
        <div className="flex-1 w-full flex flex-col items-center justify-center px-1 sm:px-4 pb-4 sm:pb-6">
          <div className="w-full max-w-none h-full rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-1 sm:p-6">
            <div className="w-full overflow-x-auto">
              <FullCalendar {...calendarConfig} />
            </div>
          </div>
        </div>

      </div>

      {/* Modal de detalle de asistencia */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Detalle de Asistencia"
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Información del evento */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-600">Fecha</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium text-gray-600">Estado</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedEvent.title)}`}>
                  {selectedEvent.title}
                </span>
              </div>

              {/* Mostrar información de competencia si está disponible */}
              {selectedEvent.competenceName && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-medium text-gray-600">Competencia</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedEvent.competenceName}
                  </span>
                </div>
              )}
            </div>

            {/* Descripción adicional */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Información</h4>
                  <p className="text-sm font-semibold text-black">
                    {selectedEvent.title === 'Inasistencia' || selectedEvent.title === 'Ausente'
                      ? 'Este es tu registro de inasistencia para el día seleccionado. Si necesitas justificar esta ausencia, puedes acceder a la página de justificaciones.'
                      : `Este es tu registro de asistencia para el día seleccionado${selectedEvent.competenceName ? ` en la competencia "${selectedEvent.competenceName}"` : ''}. El registro es informativo y no requiere acciones adicionales.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cerrar
              </button>
              {/* Solo mostrar botón de justificaciones si el estado es "Inasistencia" o "Ausente" */}
              {(selectedEvent.title === 'Ausente' || selectedEvent.title === 'Inasistencia') && (
                <button
                  onClick={handleGoToJustifications}
                  className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Ir a Justificaciones
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Inyectar estilos CSS personalizados */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
    </div>
  );
}
