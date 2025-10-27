'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from '@/redux/store';
import { fetchChecklists } from '@redux/slices/checklistSlice';
import PageTitle from "@components/UI/pageTitle";

export const InstructorChecklistContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchChecklists({ page: 0, size: 5 }));
  }, [dispatch]);

  // 🔹 Datos estáticos
  const datos = {
    centro: "Centro de Servicios Financieros",
    fecha: "05/02/2024 - 05/05/2024",
    jornada: "Diurna",
    ficha: "2835109",
    team: "Team Scrum Alfa",
    proyecto: "Sistema de Reservas Spyki Hair",
    instructor: "Juan Pérez",
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-[#00111f] min-h-screen text-gray-900 dark:text-white">
     <PageTitle>
        Lista de Chequeo - Instructor
     </PageTitle>

      {/* 🔹 Cuadro principal */}
      <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 dark:bg-[#002033]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#001a33] text-left">
              <th className="p-3 border-b border-gray-200 dark:border-gray-700">Centro de Formación</th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-700">Datos de Formación</th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-700">Team Scrum</th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-700">Instructor Calificador</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="p-4 border-b border-gray-100 dark:border-gray-700">
                <p className="font-semibold">{datos.centro}</p>
                <p className="text-sm">Fecha: {datos.fecha}</p>
              </td>
              <td className="p-4 border-b border-gray-100 dark:border-gray-700">
                <p>Jornada: {datos.jornada}</p>
                <p>Ficha N°: {datos.ficha}</p>
              </td>
              <td className="p-4 border-b border-gray-100 dark:border-gray-700">
                <p className="font-semibold">{datos.team}</p>
                <p className="text-sm">Proyecto: {datos.proyecto}</p>
                <p className="text-xs italic">Evaluando: Equipo de desarrollo</p>
              </td>
              <td className="p-4 border-b border-gray-100 dark:border-gray-700">
                <p>{datos.instructor}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lista Seleccionada: Ninguna lista seleccionada
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔹 Filtros y botones */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-800 dark:bg-[#002033]">
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-[#003366] hover:bg-[#004080] text-white font-semibold py-2 px-4 rounded-lg transition">
            Todos los Trimestres
          </button>
          <button className="bg-[#004d80] hover:bg-[#005c99] text-white font-semibold py-2 px-4 rounded-lg transition">
            Seleccionar Lista de Chequeo
          </button>
          <button className="bg-[#00804d] hover:bg-[#00995c] text-white font-semibold py-2 px-4 rounded-lg transition">
            Vista Previa y Guardar
          </button>
          <button className="bg-[#990000] hover:bg-[#b30000] text-white font-semibold py-2 px-4 rounded-lg transition">
            PDF
          </button>
          <button className="bg-[#336699] hover:bg-[#3d7ab3] text-white font-semibold py-2 px-4 rounded-lg transition">
            Excel
          </button>
        </div>

        <div className="text-center mt-4 text-sm">
          <b>Activas: 0</b> | <b>Filtradas: 0</b>
        </div>
      </div>
    </div>
  );
};

export default InstructorChecklistContainer;