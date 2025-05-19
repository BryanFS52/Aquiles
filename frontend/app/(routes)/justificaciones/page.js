"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@components/header";
import { Sidebar } from "@components/Sidebar";
import { GoSearch } from "react-icons/go";
import { GrAttachment } from "react-icons/gr";
import Image from "next/image";
import persona from "@public/img/persona.jpg";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import justificationService from "@services/justificationService"; // importa tu servicio

export default function JustificacionesInstructor() {
  const [selectedFiltro, setSelectedFiltro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [justificaciones, setJustificaciones] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga las justificaciones del backend paginadas
  useEffect(() => {
    async function fetchJustifications() {
      setLoading(true);
      setError(null);
      try {
        const response = await justificationService.getAllJustifications(currentPage, itemsPerPage);
        if (response?.code === "200" || response?.code === 200) {
          setJustificaciones(
            response.data.map((j) => ({
              id: j.id,
              programa: j.justificationType?.name || "Sin programa", // si quieres mapear a algún campo
              ficha: j.notificationId || "N/A", // o algún campo que identifique ficha
              documento: j.documentNumber,
              aprendiz: j.name,
              fecha: new Date(j.justificationDate).toLocaleDateString("es-CO"),
              estado: j.state ? "Activo" : "Inactivo",
              archivoAdjunto: j.justificationFile,
            }))
          );
          setTotalItems(response.totalItems);
        } else {
          setError(response.message || "Error cargando justificaciones");
          setJustificaciones([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError(err.message || "Error de conexión");
        setJustificaciones([]);
        setTotalItems(0);
      }
      setLoading(false);
    }

    fetchJustifications();
  }, [currentPage]);

  const downloadBase64File = (base64Data, fileName) => {
    const linkSource = `data:application/pdf;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };



  // Filtrado sobre datos cargados (client side)
  const filteredJustificaciones = useMemo(() => {
    if (!searchTerm || !selectedFiltro) return justificaciones;

    return justificaciones.filter((j) => {
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
  }, [selectedFiltro, searchTerm, justificaciones]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Aquí no haces paginación manual porque ya la hace el backend
  // Solo muestras filteredJustificaciones directamente

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 0, totalPages));
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

          {loading && <p>Cargando justificaciones...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
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
                    {filteredJustificaciones.map((justificacion) => (
                      console.log(justificacion),
                      <tr
                        key={justificacion.id}
                        className="border-b hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3">{justificacion.programa}</td>
                        <td className="px-4 py-3">{justificacion.ficha}</td>
                        <td className="px-4 py-3">
                          <Image
                            src={persona}
                            alt="Persona"
                            className="w-10 h-9 rounded-full"
                          />
                        </td>
                        <td className="px-4 py-3">{justificacion.documento}</td>
                        <td className="px-4 py-3">{justificacion.aprendiz}</td>
                        <td className="px-4 py-3">{justificacion.fecha}</td>
                        <td className="px-4 py-3">
                          {justificacion.archivoAdjunto ? (
                            <GrAttachment
                              className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() =>
                                downloadBase64File(justificacion.archivoAdjunto, `justificacion_${justificacion.id}.pdf`)
                              }
                            />


                          ) : (
                            <span className="text-gray-400">No hay archivo</span>
                          )}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
