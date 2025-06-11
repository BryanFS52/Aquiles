"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoSearch } from "react-icons/go";
import { GrAttachment } from "react-icons/gr";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import persona from "@public/img/persona.jpg";
import PageTitle from "@components/UI/pageTitle";
import {
  fetchJustifications,
  setSelectedFiltro,
  setSearchTerm,
  nextPage,
  previousPage,
  downloadFile,
  clearError,
  selectJustifications,
  selectFilteredJustifications,
  selectJustificationLoading,
  selectJustificationError,
  selectCurrentPage,
  selectTotalPages,
  selectTotalItems,
  selectItemsPerPage,
  selectSelectedFiltro,
  selectSearchTerm
} from "@slice/justificationSlice";

export default function JustificacionesInstructor() {
  const dispatch = useDispatch();

  // Selectors
  const justificaciones = useSelector(selectJustifications);
  const filteredJustificaciones = useSelector(selectFilteredJustifications);
  const loading = useSelector(selectJustificationLoading);
  const error = useSelector(selectJustificationError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const totalItems = useSelector(selectTotalItems);
  const itemsPerPage = useSelector(selectItemsPerPage);
  const selectedFiltro = useSelector(selectSelectedFiltro);
  const searchTerm = useSelector(selectSearchTerm);

  // Función helper para obtener extensión del archivo según mimeType
  const getExtensionFromMime = (mimeType) => {
    try {
      const map = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "application/pdf": "pdf",
        "image/gif": "gif",
        "application/zip": "zip",
      };
      return map[mimeType] || "bin";
    } catch (error) {
      console.error("Error al obtener extensión de archivo:", error);
      return "bin";
    }
  };

  // Función para cargar justificaciones
  const loadJustifications = async (page, size) => {
    try {
      dispatch(fetchJustifications({ page, size }));
    } catch (error) {
      console.error("Error al cargar justificaciones:", error);
    }
  };

  // Efectos
  useEffect(() => {
    loadJustifications(currentPage, itemsPerPage);
  }, [dispatch, currentPage, itemsPerPage]);


  // Handlers
  const handleFiltroChange = async (filtro) => {
    try {
      dispatch(setSelectedFiltro(filtro));
    } catch (error) {
      console.error("Error al cambiar filtro:", error);
    }
  };

  const handleSearchChange = async (term) => {
    try {
      dispatch(setSearchTerm(term));
    } catch (error) {
      console.error("Error al cambiar término de búsqueda:", error);
    }
  };

  const handleReloadJustifications = async () => {
    try {
      dispatch(fetchJustifications({ page: currentPage, size: itemsPerPage }));
    } catch (error) {
      console.error("Error al recargar justificaciones:", error);
    }
  };

  const handlePreviousPage = async () => {
    try {
      dispatch(previousPage());
    } catch (error) {
      console.error("Error al ir a página anterior:", error);
    }
  };

  const handleNextPage = async () => {
    try {
      dispatch(nextPage());
    } catch (error) {
      console.error("Error al ir a página siguiente:", error);
      // mostrar feedback al usuario
      showFeedback("error", "navegar", "página siguiente");
    }
  };

  const handleDownloadFile = async (justificacion) => {
    try {
      if (!justificacion) {
        throw new Error("Justificación no encontrada");
      }

      if (!justificacion.archivoAdjunto) {
        throw new Error("No hay archivo adjunto para descargar");
      }

      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const extension = getExtensionFromMime(mimeType);
      const fileName = `justificacion_${justificacion.id}.${extension}`;

      dispatch(downloadFile({
        base64Data: justificacion.archivoAdjunto,
        fileName: fileName,
        mimeType: mimeType
      }));

      // mostrar feedback de éxito
      showFeedback("success", "descargado", fileName);
    } catch (error) {
      console.error("Error al descargar archivo:", error);
      // Mostrar feedback de error
      showFeedback("error", "descargar", "archivo");
    }
  };

  const handleClearError = async () => {
    try {
      dispatch(clearError());
    } catch (error) {
      console.error("Error al limpiar error:", error);
    }
  };

  // Los datos a mostrar dependen de si hay filtros activos
  const getDataToShow = () => {
    try {
      return selectedFiltro && searchTerm ? filteredJustificaciones : justificaciones;
    } catch (error) {
      console.error("Error al obtener datos a mostrar:", error);
      return [];
    }
  };

  const dataToShow = getDataToShow();

  return (
    <div className="space-y-6">
      {/* Title */}
      <PageTitle>Justificaciones de aprendices</PageTitle>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3">
          <select
            onChange={(e) => handleFiltroChange(e.target.value)}
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            disabled={!selectedFiltro}
          />
          <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Reload Button */}
      <div className="flex justify-start">
        <button
          onClick={handleReloadJustifications}
          className="px-6 py-3 bg-gradient-to-r from-lime-600 to-lime-500  hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Recargar Justificaciones"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-red-600 dark:text-red-400">
              {typeof error === 'string' ? error : error.message || 'Error desconocido'}
            </p>
            <button
              onClick={handleClearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              ✕
            </button>
          </div>
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
                {dataToShow.length > 0 ? (
                  dataToShow.map((justificacion) => (
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
                            onClick={() => handleDownloadFile(justificacion)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {selectedFiltro && searchTerm
                        ? "No se encontraron resultados para la búsqueda"
                        : "No hay justificaciones disponibles"
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
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
                disabled={currentPage === totalPages || loading}
              >
                Siguiente
                <IoIosArrowForward className="ml-2" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando justificaciones...</span>
        </div>
      )}
    </div>
  );
}
