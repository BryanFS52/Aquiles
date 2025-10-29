"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Modal from "../UI/Modal";
import StatCard from "../features/JustificacionesCoordinador/StatCard";
import JustificationList from "../features/JustificacionesCoordinador/justificationList";
import Paginator from "../UI/Paginator/Paginator";

interface FichaData {
  id: string;
  numeroFicha: string;
  totalAprendices: number;
  justificacionesPendientes: number;
  justificacionesAprobadas: number;
  justificacionesRechazadas: number;
}

interface JustificationCoordinatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fichaData: FichaData;
}

// Datos quemados de justificaciones
const justificationsData: Record<string, any[]> = {
  "1": [
    {
      id: "j1",
      aprendiz: "Juan Carlos Pérez",
      documento: "1234567890",
      fechaAusencia: "2025-10-20",
      fechaJustificacion: "2025-10-21",
      tipo: "Cita Médica",
      estado: "Pendiente",
      motivo: "Consulta médica de control preventivo programada",
    },
    {
      id: "j2",
      aprendiz: "María Fernanda López",
      documento: "9876543210",
      fechaAusencia: "2025-10-18",
      fechaJustificacion: "2025-10-19",
      tipo: "Calamidad Doméstica",
      estado: "Aprobada",
      motivo: "Emergencia familiar, se adjunta certificado médico del familiar",
    },
    {
      id: "j3",
      aprendiz: "Carlos Andrés Gómez",
      documento: "5551234567",
      fechaAusencia: "2025-10-15",
      fechaJustificacion: "2025-10-18",
      tipo: "Problemas de Transporte",
      estado: "Rechazada",
      motivo: "Problemas con el transporte público, sin evidencia adjunta",
    },
    {
      id: "j4",
      aprendiz: "Ana María Rodríguez",
      documento: "7778889990",
      fechaAusencia: "2025-10-22",
      fechaJustificacion: "2025-10-23",
      tipo: "Asunto Personal",
      estado: "Pendiente",
      motivo: "Trámite personal urgente en notaría",
    },
    {
      id: "j5",
      aprendiz: "Pedro José Martínez",
      documento: "3334445556",
      fechaAusencia: "2025-10-10",
      fechaJustificacion: "2025-10-11",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Cita con especialista, se adjunta comprobante médico",
    },
    {
      id: "j12",
      aprendiz: "Sofía Valentina Cruz",
      documento: "1122334455",
      fechaAusencia: "2025-10-09",
      fechaJustificacion: "2025-10-10",
      tipo: "Enfermedad",
      estado: "Aprobada",
      motivo: "Incapacidad médica por resfriado común",
    },
    {
      id: "j13",
      aprendiz: "Miguel Ángel Reyes",
      documento: "2233445566",
      fechaAusencia: "2025-10-08",
      fechaJustificacion: "2025-10-09",
      tipo: "Asunto Familiar",
      estado: "Pendiente",
      motivo: "Acompañamiento a familiar en hospital",
    },
    {
      id: "j14",
      aprendiz: "Carolina Díaz Mendoza",
      documento: "3344556677",
      fechaAusencia: "2025-10-07",
      fechaJustificacion: "2025-10-08",
      tipo: "Problemas de Transporte",
      estado: "Rechazada",
      motivo: "Sin evidencia de problemas de transporte",
    },
    {
      id: "j15",
      aprendiz: "Daniel Esteban Vargas",
      documento: "4455667788",
      fechaAusencia: "2025-10-06",
      fechaJustificacion: "2025-10-07",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Cita con oftalmólogo, se adjunta comprobante",
    },
    {
      id: "j16",
      aprendiz: "Isabella Rojas Torres",
      documento: "5566778899",
      fechaAusencia: "2025-10-05",
      fechaJustificacion: "2025-10-06",
      tipo: "Asunto Personal",
      estado: "Pendiente",
      motivo: "Renovación de documentos personales",
    },
  ],
  "2": [
    {
      id: "j6",
      aprendiz: "Laura Sofía García",
      documento: "2223334445",
      fechaAusencia: "2025-10-19",
      fechaJustificacion: "2025-10-20",
      tipo: "Enfermedad",
      estado: "Aprobada",
      motivo: "Incapacidad médica por gripe, adjunto certificado",
    },
    {
      id: "j7",
      aprendiz: "Diego Fernando Silva",
      documento: "6667778889",
      fechaAusencia: "2025-10-25",
      fechaJustificacion: "2025-10-26",
      tipo: "Asunto Familiar",
      estado: "Pendiente",
      motivo: "Compromiso familiar importante",
    },
    {
      id: "j17",
      aprendiz: "Ricardo Javier Moreno",
      documento: "6677889900",
      fechaAusencia: "2025-10-04",
      fechaJustificacion: "2025-10-05",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Control médico post-operatorio",
    },
    {
      id: "j18",
      aprendiz: "Natalia Fernández Ruiz",
      documento: "7788990011",
      fechaAusencia: "2025-10-03",
      fechaJustificacion: "2025-10-04",
      tipo: "Calamidad Doméstica",
      estado: "Pendiente",
      motivo: "Inundación en el hogar, gestión de seguros",
    },
    {
      id: "j19",
      aprendiz: "Alejandro Castro Peña",
      documento: "8899001122",
      fechaAusencia: "2025-10-02",
      fechaJustificacion: "2025-10-03",
      tipo: "Problemas de Transporte",
      estado: "Aprobada",
      motivo: "Bloqueo vial por manifestaciones, se adjunta evidencia",
    },
    {
      id: "j20",
      aprendiz: "Gabriela Morales Soto",
      documento: "9900112233",
      fechaAusencia: "2025-10-01",
      fechaJustificacion: "2025-10-02",
      tipo: "Asunto Personal",
      estado: "Aprobada",
      motivo: "Diligencias legales personales",
    },
  ],
  "3": [
    {
      id: "j8",
      aprendiz: "Valentina Torres",
      documento: "1112223334",
      fechaAusencia: "2025-10-16",
      fechaJustificacion: "2025-10-17",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Exámenes de laboratorio programados",
    },
    {
      id: "j9",
      aprendiz: "Santiago Ramírez",
      documento: "4445556667",
      fechaAusencia: "2025-10-23",
      fechaJustificacion: "2025-10-24",
      tipo: "Problemas de Transporte",
      estado: "Pendiente",
      motivo: "Paro de transporte en la zona",
    },
    {
      id: "j10",
      aprendiz: "Camila Herrera",
      documento: "8889990001",
      fechaAusencia: "2025-10-12",
      fechaJustificacion: "2025-10-14",
      tipo: "Asunto Personal",
      estado: "Rechazada",
      motivo: "Justificación tardía sin soporte válido",
    },
    {
      id: "j21",
      aprendiz: "Mateo Andrés Suárez",
      documento: "1011121314",
      fechaAusencia: "2025-09-30",
      fechaJustificacion: "2025-10-01",
      tipo: "Enfermedad",
      estado: "Aprobada",
      motivo: "Dolor de estómago agudo, certificado médico adjunto",
    },
    {
      id: "j22",
      aprendiz: "Lucía Daniela Ríos",
      documento: "1516171819",
      fechaAusencia: "2025-09-29",
      fechaJustificacion: "2025-09-30",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Control prenatal programado",
    },
    {
      id: "j23",
      aprendiz: "Emilio José Paredes",
      documento: "2021222324",
      fechaAusencia: "2025-09-28",
      fechaJustificacion: "2025-09-29",
      tipo: "Asunto Familiar",
      estado: "Pendiente",
      motivo: "Acompañamiento a padre en cita médica",
    },
    {
      id: "j24",
      aprendiz: "Juliana Marín Ortiz",
      documento: "2526272829",
      fechaAusencia: "2025-09-27",
      fechaJustificacion: "2025-09-28",
      tipo: "Problemas de Transporte",
      estado: "Rechazada",
      motivo: "No presenta evidencia suficiente",
    },
  ],
  "4": [
    {
      id: "j11",
      aprendiz: "Andrés Felipe Castro",
      documento: "5556667778",
      fechaAusencia: "2025-10-21",
      fechaJustificacion: "2025-10-22",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Cita odontológica de urgencia",
    },
    {
      id: "j25",
      aprendiz: "Victoria Salazar Gómez",
      documento: "3031323334",
      fechaAusencia: "2025-09-26",
      fechaJustificacion: "2025-09-27",
      tipo: "Asunto Personal",
      estado: "Pendiente",
      motivo: "Gestión de papeles de vehículo",
    },
    {
      id: "j26",
      aprendiz: "Sebastián Ortega Luna",
      documento: "3536373839",
      fechaAusencia: "2025-09-25",
      fechaJustificacion: "2025-09-26",
      tipo: "Calamidad Doméstica",
      estado: "Aprobada",
      motivo: "Daño en tubería del hogar, adjunta factura del plomero",
    },
  ],
};

const JustificationCoordinatorModal: React.FC<JustificationCoordinatorModalProps> = ({
  isOpen,
  onClose,
  fichaData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const itemsPerPage = 3;

  const allJustifications = justificationsData[fichaData.id] || [];
  
  // Calcular paginación
  const totalPages = Math.ceil(allJustifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJustifications = allJustifications.slice(startIndex, endIndex);

  // Detectar modo oscuro
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Resetear página al cambiar de ficha
  useEffect(() => {
    setCurrentPage(1);
  }, [fichaData.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ficha ${fichaData.numeroFicha}`}
      size="xxxl"
      className="max-h-[90vh]"
    >
      <div className="flex flex-col max-h-[75vh]">
        {/* Contenido con scroll */}
        <div className="overflow-y-auto flex-1">
          {/* Estadísticas */}
          {/*<div className="mb-8">
            {/* <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Estadísticas de la Ficha
            </h3> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> */}
            {/* <StatCard
              icon={FaUsers}
              label="Total Aprendices"
              value={fichaData.totalAprendices}
              bgColor="bg-blue-500"
              iconColor="text-white"
              textColor="text-white"
            />
            <StatCard
              icon={FaClock}
              label="Pendientes"
              value={fichaData.justificacionesPendientes}
              bgColor="bg-yellow-500"
              iconColor="text-white"
              textColor="text-white"
            />
            <StatCard
              icon={FaCheckCircle}
              label="Aprobadas"
              value={fichaData.justificacionesAprobadas}
              bgColor="bg-green-500"
              iconColor="text-white"
              textColor="text-white"
            />
            <StatCard
              icon={FaTimesCircle}
              label="Rechazadas"
              value={fichaData.justificacionesRechazadas}
              bgColor="bg-red-500"
              iconColor="text-white"
              textColor="text-white"
            />
          </div>
        </div> */}

          {/* Lista de Justificaciones */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Justificaciones Enviadas
              </h3>
              <span className="font-bold text-blue-500">{allJustifications.length}</span>
            </div>
            <JustificationList justifications={currentJustifications} />
          </div>
        </div>

        {/* Paginador */}
        {totalPages > 1 && (
          <Paginator
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </Modal>
  );
};

export default JustificationCoordinatorModal;
