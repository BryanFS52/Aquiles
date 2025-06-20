"use client";

import { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import persona from "@public/img/persona.jpg";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justification/justificationsFilter";

const justificaciones = [
  {
    programa: "Análisis y Desarrollo de Software",
    ficha: "25785784",
    foto: persona,
    documento: "1015896552",
    aprendiz: "Juliana Valeria Lilian Tibocha Gutierrez",
    fecha: "12/02/2024",
    archivo: true,
    estado: "Activo",
  },
  {
    programa: "Software",
    ficha: "31876265148",
    foto: persona,
    documento: "1031812585",
    aprendiz: "Juvencio Pedro Hernandez Diaz",
    fecha: "12/02/2025",
    archivo: true,
    estado: "Activo",
  },
  {
    programa: "Análisis",
    ficha: "3187232862",
    foto: persona,
    documento: "1023841452",
    aprendiz: "Juana Luisa Rocha Bermudes",
    fecha: "12/05/2024",
    archivo: true,
    estado: "Activo",
  },
  {
    programa: "Desarrollo",
    ficha: "246825647",
    foto: persona,
    documento: "1054638436",
    aprendiz: "Gustabo Eduardo Fernandez Florian",
    fecha: "20/02/2024",
    archivo: true,
    estado: "Activo",
  },
];

export default function Options() {
  const [filterOptions, setFilterOptions] = useState({
    selectedFiltro: "todo",
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (type: string, value: string) => {
    setFilterOptions((prev) => ({ ...prev, [type]: value }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Lógica de filtrado
  const filteredJustificaciones = justificaciones.filter((j) => {
    const { selectedFiltro, searchTerm } = filterOptions;
    if (!searchTerm) return true;
    if (!selectedFiltro || selectedFiltro === "todo") {
      return (
        j.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.ficha.includes(searchTerm) ||
        j.documento.includes(searchTerm) ||
        j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.fecha.includes(searchTerm)
      );
    }
    switch (selectedFiltro) {
      case "programa":
        return j.programa.toLowerCase().includes(searchTerm.toLowerCase());
      case "ficha":
        return j.ficha.includes(searchTerm);
      case "documento":
        return j.documento.includes(searchTerm);
      case "aprendiz":
        return j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase());
      case "fecha":
        return j.fecha.includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <PageTitle>Justificaciones de Aprendices</PageTitle>
      
      <JustificationFilters
        filterOptions={filterOptions}
        loading={loading}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
      />

      {/* Tabla con estilos mejorados */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Programa</th>
              <th className="px-6 py-4 font-medium">Ficha</th>
              <th className="px-6 py-4 font-medium">Foto</th>
              <th className="px-6 py-4 font-medium">Documento</th>
              <th className="px-6 py-4 font-medium">Aprendiz</th>
              <th className="px-6 py-4 font-medium">Fecha de Justificación</th>
              <th className="px-6 py-4 font-medium">Archivo Adjunto</th>
              <th className="px-6 py-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredJustificaciones.map((j, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{j.programa}</td>
                <td className="px-6 py-4">{j.ficha}</td>
                <td className="px-6 py-4">
                  <Image 
                    src={j.foto} 
                    alt="Persona" 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                </td>
                <td className="px-6 py-4">{j.documento}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{j.aprendiz}</td>
                <td className="px-6 py-4">{j.fecha}</td>
                <td className="px-6 py-4">
                  {j.archivo ? (
                    <GrAttachment 
                      title="Descargar archivo"
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200" 
                    />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No hay archivo</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    j.estado === "Activo"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {j.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación con estilos mejorados */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          disabled={true} // Placeholder para lógica de paginación
        >
          <IoIosArrowBack className="mr-2" />
          Anterior
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {filteredJustificaciones.length} de {justificaciones.length} registros
        </span>

        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          disabled={true} // Placeholder para lógica de paginación
        >
          Siguiente
          <IoIosArrowForward className="ml-2" />
        </button>
      </div>
    </div>
  );
}