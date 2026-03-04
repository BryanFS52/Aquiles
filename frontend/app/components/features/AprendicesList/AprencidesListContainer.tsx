"use client";

import type { DataTableColumn } from "@components/UI/DataTable/types";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudentList } from "@slice/olympo/studentSlice";
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
// Componente Principal
// --------------------
export const AprendicesListContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: studentsData, loading, error } = useSelector((state: RootState) => state.student);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SelectedStudent | null>(null);

  useEffect(() => {
    dispatch(fetchStudentList({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Error desconocido';
      toast.error(`Error al cargar estudiantes: ${errorMessage}`);
    }
  }, [error]);

  // Mapear datos de Redux al formato de la tabla
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>({});

  const students: Student[] = useMemo(() => {
    if (!studentsData || studentsData.length === 0) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    return studentsData.map((student) => {
      const docNumber = student.person?.document || 'N/A';
      return {
        documentNumber: docNumber,
        fullName: `${student.person?.name || ''} ${student.person?.lastname || ''}`.trim(),
        email: student.person?.email || '',
        isPresent: attendanceStatus[docNumber] !== undefined ? attendanceStatus[docNumber] : true,
        date: today,
      };
    });
  }, [studentsData, attendanceStatus]);

  const toggleAttendance = (documentNumber: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [documentNumber]: !(prev[documentNumber] !== undefined ? prev[documentNumber] : true)
    }));
  };

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
        <button
          onClick={() => toggleAttendance(student.documentNumber)}
          className={`font-semibold px-3 py-1 rounded-lg transition-colors ${
            student.isPresent
              ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
              : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          }`}
        >
          {student.isPresent ? "✓ Presente" : "✗ Ausente"}
        </button>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

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