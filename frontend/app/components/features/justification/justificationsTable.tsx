"use client"

import Image from "next/image";
import { GrAttachment } from "react-icons/gr";
import persona from "@public/img/persona.jpg";
import { Check, X } from "lucide-react";

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
            <th className="px-6 py-4 font-medium">Fecha de Justificación</th>
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
              <td className="px-6 py-4">{justificacion.fecha}</td>
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
                    justificacion.estado === "Activo"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {justificacion.estado}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(justificacion.id, "Aceptado")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                      justificacion.estado === "Aceptado"
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                    }`}
                    disabled={justificacion.estado === "Aceptado"}
                    title="Aceptar justificación"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(justificacion.id, "Denegado")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                      justificacion.estado === "Denegado"
                        ? "bg-red-500 text-white cursor-default"
                        : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                    }`}
                    disabled={justificacion.estado === "Denegado"}
                    title="Denegar justificación"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}