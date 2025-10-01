'use client'

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { fetchAttendanceAndCompetenceByStudent } from '@slice/attendanceSlice';
import { useLoader } from "@context/LoaderContext";
import { TEMPORAL_APRENDIZ_ID } from "@/temporaryCredential";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import AsistenciaAprendizCalendar from "./AsistenciaAprendizCalendar";
import AsistenciaAprendizModal from "./AsistenciaAprendizModal";

const AsistenciaAprendizContainer: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'Asistencia' | 'Inasistencia' | 'Retardo' | 'Justificacion'>('all');
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

  const { studentAttendances, studentAttendances: { loading, error } } = useSelector((state: RootState) => state.attendances);

  // Cargar asistencias del estudiante al montar el componente
  useEffect(() => {
    dispatch(fetchAttendanceAndCompetenceByStudent({ id: TEMPORAL_APRENDIZ_ID }));
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
  const mapAttendanceStateToEventType = useCallback((status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Presente': 'Asistencia',
      'Asistencia': 'Asistencia',
      'Inasistencia': 'Inasistencia',
      'Ausente': 'Inasistencia',
      'Retardo': 'Retardo',
      'Justificacion': 'Justificacion',
      'Justificado': 'Justificacion'
    };
    return statusMap[status] || 'Asistencia';
  }, []);

  // Función para obtener eventos filtrados y formatearlos para FullCalendar
  const getFilteredEvents = useCallback(() => {
    if (!studentAttendances.data || studentAttendances.data.length === 0) {
      return [];
    }

    const calendarEvents = studentAttendances.data
      .filter((attendance: any) => attendance.attendanceDate)
      .map((attendance: any, index: number) => {
        const status = attendance.attendanceState?.status || 'Presente';
        const eventType = mapAttendanceStateToEventType(status);
        const competenceName = attendance.competenceQuarter?.competence?.name || '';

        const uniqueId = `${attendance.id}-${index}`;

        return {
          id: uniqueId,
          title: status,
          start: attendance.attendanceDate!,
          end: attendance.attendanceDate!,
          type: eventType,
          className: eventType.toLowerCase(),
          extendedProps: {
            type: eventType,
            attendanceId: attendance.id,
            originalStatus: status,
            competenceName: competenceName,
            competenceQuarterId: attendance.competenceQuarter?.id || ''
          }
        };
      });

    const filteredEvents = filter === 'all' ? calendarEvents : calendarEvents.filter((event: any) => event.type === filter);

    return filteredEvents;
  }, [studentAttendances.data, filter, mapAttendanceStateToEventType]);

  // Función para manejar el cambio de filtro
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  // Funciones para manejar el modal
  const handleEventClick = (eventData: any) => {
    setSelectedEvent({
      id: eventData.event.id,
      title: eventData.event.title,
      date: eventData.event.startStr,
      attendanceId: eventData.event.extendedProps.attendanceId,
      competenceName: eventData.event.extendedProps.competenceName,
      competenceQuarterId: eventData.event.extendedProps.competenceQuarterId
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleGoToJustifications = () => {
    closeModal();
    router.push('./justificacionesAprendiz');
  };

  // Early return para empty state (sin loading)
  if (!loading && (!studentAttendances.data || studentAttendances.data.length === 0)) {
    return <EmptyState message="No hay registros de asistencia disponibles" />;
  }

  return (
    <div className="w-full min-h-screen">
      <div className="p-0 sm:p-0 md:p-0 xl:p-0 h-full flex flex-col justify-start">
        <PageTitle>Mi Asistencia</PageTitle>

        <AsistenciaAprendizCalendar
          events={getFilteredEvents()}
          filter={filter}
          onFilterChange={handleFilterChange}
          onEventClick={handleEventClick}
        />

        <AsistenciaAprendizModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedEvent={selectedEvent}
          onGoToJustifications={handleGoToJustifications}
        />
      </div>
    </div>
  );
};

export default AsistenciaAprendizContainer;