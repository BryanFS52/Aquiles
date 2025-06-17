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
  // ...otros registros...
    {
    programa: "Software",
    ficha: "31876265148",
    foto: persona,
    documento: "1031812585",
    aprendiz: "Juvencio Pedro Hernandez Diaz",
    fecha: "12/02/2025",
    archivo: true,
    estado: "Activo",
  },  {
    programa: "Análisis",
    ficha: "3187232862",
    foto: persona,
    documento: "1023841452",
    aprendiz: "Juana Luisa Rocha Bermudes",
    fecha: "12/05/2024",
    archivo: true,
    estado: "Activo",
  },  {
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
    <>
      <PageTitle>Justificaciones de Aprendices</PageTitle>
      <JustificationFilters
        filterOptions={filterOptions}
        loading={loading}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
      />

      {/* Tabla de resultados */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg">
          <thead className="text-xs uppercase bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Programa</th>
              <th className="px-4 py-3">Ficha</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Aprendiz</th>
              <th className="px-4 py-3">Fecha de Justificación</th>
              <th className="px-4 py-3">Archivo Adjunto</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredJustificaciones.map((j, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3">{j.programa}</td>
                <td className="px-4 py-3">{j.ficha}</td>
                <td className="px-4 py-3">
                  <Image src={j.foto} alt="Persona" className="w-10 h-9 rounded-full" />
                </td>
                <td className="px-4 py-3">{j.documento}</td>
                <td className="px-4 py-3">{j.aprendiz}</td>
                <td className="px-4 py-3">{j.fecha}</td>
                <td className="px-4 py-3">
                  <GrAttachment className="w-5 h-5 text-[#01b001] hover:text-[#00324d] transition-colors duration-300" />
                </td>
                <td className="px-4 py-3">{j.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación y otros componentes */}
    </>
  );
}