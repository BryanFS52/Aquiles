"use client";

import type { DataTableColumn } from "@components/UI/DataTable/types";
import React, { useState, useEffect } from "react";
import { PiStudentFill } from "react-icons/pi";
import { ImMail4 } from "react-icons/im";
import { Card } from "@components/UI/Card";
import { toast } from "react-toastify";
import ModalCorreo from "@components/Modals/modalCorreo";
import PageTitle from "@components/UI/pageTitle";
import DataTable from "@components/UI/DataTable";
import StatCard from "./StatCard";
import "react-toastify/dist/ReactToastify.css";

// --------------------
// Tipos
// --------------------
interface Student {
  documentNumber: string;
  fullName: string;
  email: string;
  isPresent: boolean;
  date: string;
}

interface SelectedStudent {
  email: string;
  studentName: string;
  date: string;
}

// --------------------
// Mock Data
// --------------------
const mockStudents: Student[] = [
  {
    documentNumber: "1001",
    fullName: "Juan Pérez",
    email: "juan.perez@example.com",
    isPresent: true,
    date: "2025-09-15",
  },
  {
    documentNumber: "1002",
    fullName: "María Gómez",
    email: "maria.gomez@example.com",
    isPresent: false,
    date: "2025-09-15",
  },
  {
    documentNumber: "1003",
    fullName: "Carlos Ramírez",
    email: "carlos.ramirez@example.com",
    isPresent: true,
    date: "2025-09-15",
  },
];

// --------------------
// Componente Principal
// --------------------
export const AprendicesListContainer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SelectedStudent | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Simula la llamada al servicio
    const fetchStudents = async () => {
      try {
        // En el futuro aquí iría getAllApprentices()
        setStudents(mockStudents);
      } catch (error) {
        console.error("Error al obtener la lista de aprendices:", error);
      }
    };

    fetchStudents();
  }, []);

  const toggleModal = (student: SelectedStudent) => {
    setSelectedStudent(student);
    setIsModalOpen(!isModalOpen);
  };

  const handleSendEmail = async () => {
    if (!selectedStudent) return;

    const { email, studentName, date } = selectedStudent;

    try {
      // En el futuro aquí iría sendEmailAbsence()
      console.log("Mock enviar correo a:", email, studentName, date);
      toast.success("Correo enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error("Hubo un error al enviar el correo");
    } finally {
      setIsModalOpen(false);
    }
  };

  const totalStudents = students.length;
  const presentStudents = students.filter((s) => s.isPresent).length;
  const absentStudents = students.filter((s) => !s.isPresent).length;

  // Definición de las columnas para DataTable
  const tableColumns: DataTableColumn<Student>[] = [
    {
      key: "documentNumber",
      header: "Número de Documento",
      className: "text-center",
    },
    {
      key: "fullName",
      header: "Nombres y Apellidos",
      className: "text-center",
    },
    {
      key: "isPresent",
      header: "Estado",
      className: "text-center",
      render: (student) => (
        <span
          className={`font-semibold ${
            student.isPresent
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {student.isPresent ? "✓ Presente" : "✗ Ausente"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-center",
      render: (student) => (
        <div className="flex justify-center">
          {!student.isPresent && (
            <button
              onClick={() =>
                toggleModal({
                  email: student.email,
                  studentName: student.fullName,
                  date: student.date,
                })
              }
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
              title="Enviar correo de ausencia"
            >
              <ImMail4 className="w-5 h-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleSaveAttendance = async () => {
    try {
      const attendanceData = students.map((s) => ({
        documentNumber: s.documentNumber,
        isPresent: s.isPresent,
        date: s.date,
      }));

      // En el futuro aquí iría updateAttendance()
      console.log("Mock guardar asistencia:", attendanceData);

      toast.success("Asistencia guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la asistencia:", error);
      toast.error("Hubo un error al guardar la asistencia");
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle>
        Lista de Asistencia
      </PageTitle>

      {/* Estadísticas con Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
                icon={PiStudentFill}
                color="blue"
                value={totalStudents}
                label="Aprendices de la ficha"
            />

            <StatCard
                icon={PiStudentFill}
                color="green"
                value={presentStudents}
                label="Aprendices en clase"
            />

            <StatCard
                icon={PiStudentFill}
                color="red"
                value={absentStudents}
                label="Aprendices que fallaron"
                className="sm:col-span-2 lg:col-span-1"
            />
        </div>

      {/* Tabla con DataTable */}
      <Card
        body={
          <div className="space-y-4">
            <DataTable
              columns={tableColumns}
              data={students}
              pageSize={10}
              filterPlaceholder="Buscar aprendices..."
              filterFunction={(student, filter) =>
                student.fullName.toLowerCase().includes(filter.toLowerCase()) ||
                student.documentNumber.includes(filter)
              }
            />
            
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Guardar Asistencia
              </button>
            </div>
          </div>
        }
      />

      {/* Modal */}
      <ModalCorreo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
}

export default AprendicesListContainer;