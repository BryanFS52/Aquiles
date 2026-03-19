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
  statusFilter?: "all" | "Aprobada" | "Pendiente" | "Rechazada";
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
  "5": [
    {
      id: "j27",
      aprendiz: "Camilo Andrés Vega",
      documento: "4041424344",
      fechaAusencia: "2025-10-15",
      fechaJustificacion: "2025-10-16",
      tipo: "Cita Médica",
      estado: "Aprobada",
      motivo: "Consulta cardiológica programada con especialista",
    },
    {
      id: "j28",
      aprendiz: "María José Quintero",
      documento: "4546474849",
      fechaAusencia: "2025-10-12",
      fechaJustificacion: "2025-10-13",
      tipo: "Enfermedad",
      estado: "Pendiente",
      motivo: "Síntomas virales, esperando resultado de exámenes",
    },
    {
      id: "j29",
      aprendiz: "Nicolás Herrera Ruiz",
      documento: "5051525354",
      fechaAusencia: "2025-10-08",
      fechaJustificacion: "2025-10-10",
      tipo: "Asunto Personal",
      estado: "Rechazada",
      motivo: "Justificación tardía y sin documentación de soporte",
    },
    {
      id: "j30",
      aprendiz: "Paola Andrea Jiménez",
      documento: "5556575859",
      fechaAusencia: "2025-10-05",
      fechaJustificacion: "2025-10-06",
      tipo: "Calamidad Doméstica",
      estado: "Aprobada",
      motivo: "Robo en la vivienda, diligencias con la policía",
    },
  ],
  "6": [
    {
      id: "j31",
      aprendiz: "Roberto Carlos Medina",
      documento: "6061626364",
      fechaAusencia: "2025-10-20",
      fechaJustificacion: "2025-10-21",
      tipo: "Problemas de Transporte",
      estado: "Aprobada",
      motivo: "Accidente de tránsito que bloqueó la vía principal",
    },
    {
      id: "j32",
      aprendiz: "Diana Lorena Sánchez",
      documento: "6566676869",
      fechaAusencia: "2025-10-18",
      fechaJustificacion: "2025-10-19",
      tipo: "Cita Médica",
      estado: "Pendiente",
      motivo: "Control dermatológico por condición crónica",
    },
    {
      id: "j33",
      aprendiz: "Fernando Javier Ospina",
      documento: "7071727374",
      fechaAusencia: "2025-10-14",
      fechaJustificacion: "2025-10-15",
      tipo: "Asunto Familiar",
      estado: "Aprobada",
      motivo: "Funeral de familiar cercano, adjunta esquela",
    },
  ],
  "7": [
    {
      id: "j34",
      aprendiz: "Andrea Carolina Paz",
      documento: "7576777879",
      fechaAusencia: "2025-10-22",
      fechaJustificacion: "2025-10-23",
      tipo: "Enfermedad",
      estado: "Aprobada",
      motivo: "Infección estomacal aguda, incapacidad médica",
    },
    {
      id: "j35",
      aprendiz: "Manuel Eduardo Restrepo",
      documento: "8081828384",
      fechaAusencia: "2025-10-17",
      fechaJustificacion: "2025-10-18",
      tipo: "Asunto Personal",
      estado: "Pendiente",
      motivo: "Diligencias bancarias urgentes por fraude",
    },
    {
      id: "j36",
      aprendiz: "Claudia Patricia Álvarez",
      documento: "8586878889",
      fechaAusencia: "2025-10-11",
      fechaJustificacion: "2025-10-12",
      tipo: "Cita Médica",
      estado: "Rechazada",
      motivo: "Cita médica no prioritaria que pudo reagendarse",
    },
  ],
  "8": [
    {
      id: "j37",
      aprendiz: "Jorge Luis Vargas",
      documento: "9091929394",
      fechaAusencia: "2025-10-19",
      fechaJustificacion: "2025-10-20",
      tipo: "Problemas de Transporte",
      estado: "Aprobada",
      motivo: "Paro de transportadores en la región",
    },
    {
      id: "j38",
      aprendiz: "Liliana Marcela Torres",
      documento: "9596979899",
      fechaAusencia: "2025-10-13",
      fechaJustificacion: "2025-10-14",
      tipo: "Calamidad Doméstica",
      estado: "Pendiente",
      motivo: "Incendio en el sector, evacuación preventiva",
    },
  ],
  "9": [
    {
      id: "j39",
      aprendiz: "Andrés Mauricio León",
      documento: "1001011121",
      fechaAusencia: "2025-10-16",
      fechaJustificacion: "2025-10-17",
      tipo: "Asunto Familiar",
      estado: "Aprobada",
      motivo: "Nacimiento de hijo, acompañamiento en hospital",
    },
    {
      id: "j40",
      aprendiz: "Patricia Elena Rosales",
      documento: "1314151617",
      fechaAusencia: "2025-10-09",
      fechaJustificacion: "2025-10-10",
      tipo: "Enfermedad",
      estado: "Pendiente",
      motivo: "Dolor de cabeza intenso, esperando cita neurológica",
    },
    {
      id: "j41",
      aprendiz: "Carlos Alberto Duarte",
      documento: "1819202122",
      fechaAusencia: "2025-10-04",
      fechaJustificacion: "2025-10-05",
      tipo: "Cita Médica",
      estado: "Rechazada",
      motivo: "Cita de control que pudo programarse en horario libre",
    },
  ],
  "10": [
    {
      id: "j42",
      aprendiz: "Gloria Esperanza Muñoz",
      documento: "2324252627",
      fechaAusencia: "2025-10-21",
      fechaJustificacion: "2025-10-22",
      tipo: "Problemas de Transporte",
      estado: "Aprobada",
      motivo: "Daño en puente vehicular, vía cerrada por reparaciones",
    },
    {
      id: "j43",
      aprendiz: "Héctor Fabián Cárdenas",
      documento: "2829303132",
      fechaAusencia: "2025-10-14",
      fechaJustificacion: "2025-10-15",
      tipo: "Asunto Personal",
      estado: "Pendiente",
      motivo: "Trámites legales por divorcio, cita con abogado",
    },
    {
      id: "j44",
      aprendiz: "Sandra Milena Gaitán",
      documento: "3334353637",
      fechaAusencia: "2025-10-07",
      fechaJustificacion: "2025-10-08",
      tipo: "Calamidad Doméstica",
      estado: "Aprobada",
      motivo: "Daño eléctrico en la vivienda, gestión con empresa de energía",
    },
    {
      id: "j45",
      aprendiz: "Oscar Reinaldo Bermúdez",
      documento: "3839404142",
      fechaAusencia: "2025-10-01",
      fechaJustificacion: "2025-10-02",
      tipo: "Enfermedad",
      estado: "Aprobada",
      motivo: "Intoxicación alimentaria, certificado médico adjunto",
    },
  ],
};

const JustificationCoordinatorModal: React.FC<JustificationCoordinatorModalProps> = ({
  isOpen,
  onClose,
  fichaData,
  statusFilter = "all",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const itemsPerPage = 3;

  const allJustifications = justificationsData[fichaData.id] || [];
  
  // Filtrar justificaciones por estado
  const filteredJustifications = statusFilter === "all"
    ? allJustifications
    : allJustifications.filter(j => j.estado === statusFilter);
  
  // Calcular paginación
  const totalPages = Math.ceil(filteredJustifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJustifications = filteredJustifications.slice(startIndex, endIndex);

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

  // Resetear página al cambiar de ficha o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [fichaData.id, statusFilter]);

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
                {statusFilter === "all"
                  ? "Justificaciones enviadas"
                  : `Justificaciones ${statusFilter}s`}
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-500">{filteredJustifications.length}</span>
                {statusFilter !== "all" && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">de {allJustifications.length} total</span>
                )}
              </div>
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
