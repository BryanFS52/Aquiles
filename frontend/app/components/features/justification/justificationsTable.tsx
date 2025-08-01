"use client"

import Image from "next/image";
import { useSelector } from "react-redux";
import { GrAttachment } from "react-icons/gr";
import persona from "@public/img/persona.jpg";
import { RootState } from "@/redux/store";

// Recibe props para reutilizar la tabla y evitar dependencias globales
interface JustificationTableProps {
  filteredData: any[];
  handleDownloadFile: (justificacion: any) => void;
  handleStatusChange: (justificacionId: string, newStatus: string) => void;
}

export default function JustificationTable({
  filteredData,
  handleDownloadFile,
  handleStatusChange,
}: JustificationTableProps) {
  // Obtener los estados de justificación del store
  const { justificationStatuses, loading: loadingStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  const handleSelectChange = (justificacionId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatusId = event.target.value;
    console.log("🔄 handleSelectChange llamado:", {
      justificacionId,
      newStatusId,
      justificationStatuses
    });
    if (newStatusId) {
      handleStatusChange(justificacionId, newStatusId);
    }
  };

  // Función para obtener el nombre del estado basado en el valor actual
  const getCurrentStatusName = (justificacion: any) => {
    // Usar directamente el campo estado que ya está mapeado correctamente
    const statusName = justificacion.estado || "Desconocido";
    console.log("🔍 getCurrentStatusName para ID:", justificacion.id, {
      estado: justificacion.estado,
      state: justificacion.state,
      statusName
    });
    return statusName;
  };

  // Función para obtener el valor actual para el select
  const getCurrentSelectValue = (justificacion: any) => {
    // Usar el campo estado para buscar el ID correspondiente
    const matchingStatus = justificationStatuses.find(s => 
      s.name.toLowerCase() === (justificacion.estado || "").toLowerCase()
    );
    const selectValue = matchingStatus ? matchingStatus.id : "";
    console.log("🔍 getCurrentSelectValue para ID:", justificacion.id, {
      estado: justificacion.estado,
      matchingStatus,
      selectValue
    });
    return selectValue;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
          <tr>
            <th className="px-6 py-4 font-medium">Programa</th>
            <th className="px-6 py-4 font-medium">Ficha</th>
            <th className="px-6 py-4 font-medium">Foto</th>
            <th className="px-6 py-4 font-medium">Documento</th>
            <th className="px-6 py-4 font-medium">Aprendiz</th>
            <th className="px-6 py-4 font-medium">Fecha de ausencia</th>
            <th className="px-6 py-4 font-medium">Fecha de justificacion</th>
            <th className="px-6 py-4 font-medium">Archivo Adjunto</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredData.map((justificacion: any) => (
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
              <td className="px-6 py-4">{justificacion.absenceDate}</td>
              <td className="px-6 py-4">{justificacion.justificationDate}</td>
              <td className="px-6 py-4">
                {justificacion.archivoAdjunto ? (
                  <GrAttachment
                    title={`Descargar archivo (${justificacion.archivoMime || "desconocido"})`}
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
                    onClick={() => handleDownloadFile(justificacion)}
                  />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    No hay archivo
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    getCurrentStatusName(justificacion) === "Activo" || getCurrentStatusName(justificacion) === "Aceptado"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : getCurrentStatusName(justificacion) === "Denegado" || getCurrentStatusName(justificacion) === "Rechazado"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {getCurrentStatusName(justificacion)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <select
                    value={getCurrentSelectValue(justificacion)}
                    onChange={(e) => handleSelectChange(justificacion.id, e)}
                    disabled={loadingStatuses}
                    title="Cambiar estado de la justificación"
                    className="px-3 py-2 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 min-w-[120px]"
                  >
                    <option value="">Seleccionar estado...</option>
                    {justificationStatuses
                      .filter(status => status.state) // Solo mostrar estados activos
                      .map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                  </select>
                  {loadingStatuses && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Cargando...
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}