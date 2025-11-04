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

  const datos = {
    centro: "Centro de Servicios Financieros",
    fecha: "05/02/2024 - 05/05/2024",
    jornada: "Diurna",
    ficha: "2835109",
    team: "Team Scrum Alfa",
    proyecto: "Sistema de Reservas Spyki Hair",
    instructor: "Juan Pérez",
    evaluando: "Equipo de desarrollo",
    listaSeleccionada: "Ninguna",
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-[#00111f] min-h-screen text-gray-900 dark:text-white">
      <PageTitle>Lista de Chequeo - Instructor</PageTitle>

      {/* 🔹 Tarjetas separadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[
          { bg: "bg-white dark:bg-green-700", title: datos.centro, content: `Fecha: ${datos.fecha}` },
          { bg: "bg-white dark:bg-green-600", title: `Jornada: ${datos.jornada}`, content: `Ficha N°: ${datos.ficha}` },
          { bg: "bg-white dark:bg-green-500", title: datos.team, content: `Proyecto: ${datos.proyecto}\nEvaluando: ${datos.evaluando}` },
          { bg: "bg-white dark:bg-green-400", title: datos.instructor, content: `Lista Seleccionada: ${datos.listaSeleccionada}` },
        ].map((card, idx) => (
          <div key={idx} className={`${card.bg} text-gray-900 dark:text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform`}>
            <p className="font-bold text-lg">{card.title}</p>
            <p className="text-sm mt-2 whitespace-pre-line">{card.content}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Filtros y botones */}
      <div className="mt-8 bg-white dark:bg-[#002033] rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {[
            { label: "Todos los Trimestres", color: "bg-blue-600 hover:bg-blue-700" },
            { label: "Seleccionar Lista de Chequeo", color: "bg-blue-500 hover:bg-blue-600" },
            { label: "Vista Previa y Guardar", color: "bg-green-600 hover:bg-green-700" },
            { label: "PDF", color: "bg-red-600 hover:bg-red-700" },
          ].map((btn, idx) => (
            <button
              key={idx}
              className={`${btn.color} text-white font-semibold py-2 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="text-center md:text-left mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
          <span>Activas: <b>0</b></span> | <span>Filtradas: <b>0</b></span>
        </div>
      </div>
    </div>
  );
};

export default InstructorChecklistContainer;




