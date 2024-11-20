"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/Sidebar";
import { GoSearch } from "react-icons/go";
import { GrAttachment } from "react-icons/gr";
import Image from "next/image";
import persona from "../../../public/img/persona.jpg";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function JustificacionesInstructor() {
  const [selectedFiltro, setSelectedFiltro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Datos de ejemplo
  const fichas = [
    { id: "25785784", nombre: "Análisis y Desarrollo de Software" },
    { id: "25724865", nombre: "Desarrollo de Software" },
    // Agrega más fichas según sea necesario
  ];

  const justificaciones = [
    {
      id: 1,
      programa: "Análisis y Desarrollo de Software",
      ficha: "25785784",
      documento: "1015896552",
      aprendiz: "Luisa Fernanda Gómez",
      fecha: "12/02/2024",
      estado: "Activo",
    },
    {
      id: 2,
      programa: "Análisis y Desarrollo de Software",
      ficha: "25724865",
      documento: "1015896553",
      aprendiz: "Jorge Mario Pineda García",
      fecha: "12/03/2024",
      estado: "Activo",
    },
    // Add more justificaciones to test pagination
    {
      id: 3,
      programa: "Desarrollo de Software",
      ficha: "25724865",
      documento: "1015896554",
      aprendiz: "Ana María López",
      fecha: "13/03/2024",
      estado: "Activo",
    },
    {
      id: 4,
      programa: "Análisis y Desarrollo de Software",
      ficha: "25785784",
      documento: "1015896555",
      aprendiz: "Carlos Andrés Rodríguez",
      fecha: "14/03/2024",
      estado: "Activo",
    },
    {
      id: 5,
      programa: "Desarrollo de Software",
      ficha: "25724865",
      documento: "1015896556",
      aprendiz: "María José Hernández",
      fecha: "15/03/2024",
      estado: "Activo",
    },
    {
      id: 6,
      programa: "Análisis y Desarrollo de Software",
      ficha: "25785784",
      documento: "1015896557",
      aprendiz: "Juan Pablo Martínez",
      fecha: "16/03/2024",
      estado: "Activo",
    },
    {
      id: 7,
      programa: "Desarrollo de Software",
      ficha: "25724865",
      documento: "1015896558",
      aprendiz: "Laura Sofía Pérez",
      fecha: "17/03/2024",
      estado: "Activo",
    },
  ];

  const filteredJustificaciones = useMemo(() => {
    return justificaciones.filter((j) => {
      if (!selectedFiltro || !searchTerm) return true;

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
  }, [selectedFiltro, searchTerm]);

  const totalPages = Math.ceil(filteredJustificaciones.length / itemsPerPage);

  const paginatedJustificaciones = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJustificaciones.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJustificaciones, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 bg-gray-100">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Justificaciones de Aprendices
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <select
                onChange={(e) => setSelectedFiltro(e.target.value)}
                value={selectedFiltro}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Filtrar por...</option>
                <option value="programa">Programa</option>
                <option value="ficha">Ficha</option>
                <option value="documento">Documento</option>
                <option value="aprendiz">Aprendiz</option>
                <option value="fecha">Fecha de Justificación</option>
              </select>
            </div>

            <div className="relative w-full md:w-2/3">
              <input
                type="search"
                placeholder={`Buscar por ${selectedFiltro || "..."}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded"
                disabled={!selectedFiltro}
              />
              <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Tabla */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg">
              <thead className="text-xs uppercase bg-gray-50 text-gray-600">
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
                {paginatedJustificaciones.map((justificacion) => (
                  <tr key={justificacion.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3">{justificacion.programa}</td>
                    <td className="px-4 py-3">{justificacion.ficha}</td>
                    <td className="px-4 py-3">
                      <Image src={persona} alt="Persona" className="w-10 h-9 rounded-full" />
                    </td>
                    <td className="px-4 py-3">{justificacion.documento}</td>
                    <td className="px-4 py-3">{justificacion.aprendiz}</td>
                    <td className="px-4 py-3">{justificacion.fecha}</td>
                    <td className="px-4 py-3">
                      <GrAttachment className="w-5 h-5 text-[#01b001] hover:text-[#00324d] transition-colors duration-300" />
                    </td>
                    <td className="px-4 py-3">{justificacion.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 lg:pt-6">
            <button
              className="flex items-center p-2 border border-gray-300 rounded"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <IoIosArrowBack className="mr-2" />
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="flex items-center p-2 border border-gray-300 rounded"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <IoIosArrowForward className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}