"use client";

import { useState, useMemo } from "react";
import { GoSearch } from "react-icons/go";
import { GrAttachment } from "react-icons/gr";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import persona from "@public/img/persona.jpg";
import PageTitle from "@components/UI/pageTitle";
import justificationService from "@services/justificationService";


export default function JustificacionesInstructor() {
  const [selectedFiltro, setSelectedFiltro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [justificaciones, setJustificaciones] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener el MIMETYPE base64
  function getMimeTypeFromBase64(base64) {
    if (!base64) return "application/octet-stream";

    const signatures = {
      "iVBORw0KGgo": "image/png",
      "/9j/": "image/jpeg",
      "JVBERi0": "application/pdf",
      "R0lGODdh": "image/gif",
      "R0lGODlh": "image/gif",
      "UEsDBBQ": "application/zip",
    };

    const prefix = base64.substring(0, 20);

    for (const sig in signatures) {
      if (prefix.startsWith(sig)) {
        return signatures[sig];
      }
    }

    return "application/octet-stream";
  }

  // Obtener extensión según mimeType
  function getExtensionFromMime(mimeType) {
    const map = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "application/pdf": "pdf",
      "image/gif": "gif",
      "application/zip": "zip",
    };
    return map[mimeType] || "bin";
  }

  // Función para obtener justificaciones 
  const fetchJustifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await justificationService.getAllJustifications(currentPage, itemsPerPage);
      if (response?.code === "200" || response?.code === 200) {
        setJustificaciones(
          response.data.map((j) => ({
            id: j.id,
            programa: j.justificationType?.name || "Sin programa",
            ficha: j.notificationId || "N/A",
            documento: j.documentNumber,
            aprendiz: j.name,
            fecha: new Date(j.justificationDate).toLocaleDateString("es-CO"),
            estado: j.state ? "Activo" : "Inactivo",
            archivoAdjunto: j.justificationFile,
            archivoMime: j.fileType || getMimeTypeFromBase64(j.justificationFile),
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
  };

  // Descargar archivo base64
  const downloadBase64File = (base64Data, fileName, mimeType = "application/octet-stream") => {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  // Filtrado client-side
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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Title */}

      <PageTitle>Justificaciones de aprendices</PageTitle>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3">
          <select
            onChange={(e) => setSelectedFiltro(e.target.value)}
            value={selectedFiltro}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
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
            className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            disabled={!selectedFiltro}
          />
          <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Reload Button */}
      <div className="flex justify-start">
        <button
          onClick={fetchJustifications}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Recargar Justificaciones"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
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
                {filteredJustificaciones.map((justificacion) => (
                  <tr
                    key={justificacion.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {justificacion.programa}
                    </td>
                    <td className="px-6 py-4">{justificacion.ficha}</td>
                    <td className="px-6 py-4">
                      <Image
                        src={persona}
                        alt="Persona"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">{justificacion.documento}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {justificacion.aprendiz}
                    </td>
                    <td className="px-6 py-4">{justificacion.fecha}</td>
                    <td className="px-6 py-4">
                      {justificacion.archivoAdjunto ? (
                        <GrAttachment
                          title={`Descargar archivo (${justificacion.archivoMime || "desconocido"})`}
                          className="w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            const mimeType = justificacion.archivoMime || "application/octet-stream";
                            const extension = getExtensionFromMime(mimeType);
                            downloadBase64File(
                              justificacion.archivoAdjunto,
                              `justificacion_${justificacion.id}.${extension}`,
                              mimeType
                            );
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No hay archivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${justificacion.estado === "Activo"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                        {justificacion.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <IoIosArrowBack className="mr-2" />
              Anterior
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages} ({totalItems} registros)
            </span>

            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
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
  );
} 