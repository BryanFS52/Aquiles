"use client"

import React from 'react';
import Image from "next/image";
import { GrAttachment } from "react-icons/gr";
import persona from "@public/img/persona.jpg";

interface JustificationData {
  id: string | number;
  documento: string;
  aprendiz: string;
  absenceDate: string;
  justificationDate: string;
  archivoAdjunto?: string;
  archivoMime?: string;
  justificationStatus: string;
  justificationStatusId?: string;
  justificationType?: string | { id?: string; name?: string }; // Puede ser string o objeto
  description?: string;
  ficha?: string;
  attendanceId?: string;
  estado?: string;
  state?: boolean;
  // Posibles variaciones adicionales de los campos
  motivo?: string;
  razon?: string;
  observaciones?: string;
  tipoJustificacion?: string;
  typeJustification?: string;
  // Campos adicionales que podrían estar disponibles
  comentarios?: string;
  notas?: string;
  details?: string;
  justificationReason?: string;
  reasonDescription?: string;
  codigoTipo?: string;
  nombreTipo?: string;
}

interface ModalJustificationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  justificationData: JustificationData | null;
}

const ModalJustificationDetails: React.FC<ModalJustificationDetailsProps> = ({ 
  isOpen, 
  onClose, 
  justificationData
}) => {
  if (!isOpen || !justificationData) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Aceptado":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Denegado":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "En proceso":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Función para obtener el tipo de justificación de múltiples fuentes
  const getJustificationType = (data: JustificationData): string | null => {
    // @ts-ignore - Para acceso a campos anidados durante debugging
    const type = data.justificationType?.name ||  // Campo anidado del GraphQL
                 data.justificationType || 
                 data.tipoJustificacion || 
                 data.typeJustification || 
                 data.nombreTipo ||
                 data.codigoTipo ||
                 null;
    
    // Mapeo de tipos para mostrar etiquetas más amigables
    const typeMapping: { [key: string]: string } = {
      'MEDICA': 'Cita Médica',
      'MEDICAL': 'Cita Médica',
      'CALAMIDAD': 'Calamidad Doméstica',
      'CALAMITY': 'Calamidad Doméstica',
      'TRANSPORTE': 'Problemas de Transporte',
      'TRANSPORT': 'Problemas de Transporte',
      'PERSONAL': 'Asunto Personal',
      'FAMILIAR': 'Asunto Familiar',
      'FAMILY': 'Asunto Familiar',
      'ENFERMEDAD': 'Enfermedad',
      'ILLNESS': 'Enfermedad',
      'ACCIDENTE': 'Accidente',
      'ACCIDENT': 'Accidente',
      'OTRO': 'Otro',
      'OTHER': 'Otro',
      'EMERGENCIA': 'Emergencia',
      'EMERGENCY': 'Emergencia',
    };
    
    if (!type || type.trim() === '' || type === 'Tipo no disponible') return null;
    
    return typeMapping[type.toUpperCase()] || type;
  };

  // Función para obtener la descripción de múltiples fuentes
  const getDescription = (data: JustificationData): string | null => {
    const desc = data.description || 
                 data.motivo || 
                 data.razon || 
                 data.observaciones || 
                 data.comentarios ||
                 data.notas ||
                 data.details ||
                 data.justificationReason ||
                 data.reasonDescription ||
                 null;
    
    return desc && desc.trim() !== '' && desc !== 'Sin descripción' ? desc : null;
  };

  const handleDownload = (justificationData: JustificationData) => {
    try {
      if (!justificationData.archivoAdjunto) {
        alert('No hay archivo disponible para descargar');
        return;
      }
      
      // Decodificar base64
      const base64Data = justificationData.archivoAdjunto;
      const mimeType = justificationData.archivoMime || 'application/pdf';
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Función para obtener extensión según tipo MIME
      const getFileExtension = (mime: string) => {
        const extensions: { [key: string]: string } = {
          'application/pdf': 'pdf',
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/png': 'png',
          'image/gif': 'gif',
          'application/zip': 'zip',
          'text/plain': 'txt',
          'application/msword': 'doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
        };
        return extensions[mime.toLowerCase()] || 'bin';
      };
      
      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `justificacion_${justificationData.id}.${getFileExtension(mimeType)}`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('❌ Error en descarga:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al procesar el archivo para descarga: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Detalles de Justificación
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Información completa de la justificación de asistencia
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-light transition-colors duration-200"
          >
            ×
          </button>
        </div>

        {/* Información del Aprendiz */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            Información del Aprendiz
          </h3>
          
          <div className="flex items-start space-x-6">
            {/* Foto del aprendiz */}
            <div className="flex-shrink-0">
              <Image
                src={persona}
                alt="Foto del aprendiz"
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg"
              />
            </div>

            {/* Datos del aprendiz */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Nombre Completo
                </label>
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {justificationData.aprendiz}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Documento
                </label>
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {justificationData.documento}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Ficha
                </label>
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {justificationData.ficha || 'No disponible'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de Justificación - Solo mostrar si existe */}
        {getJustificationType(justificationData) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  Tipo de Justificación
                </h3>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                  {getJustificationType(justificationData)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información de la Justificación */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            Detalles de la Justificación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Fecha de Ausencia
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(justificationData.absenceDate)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Fecha de Justificación
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(justificationData.justificationDate)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Estado Actual
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(justificationData.justificationStatus)}`}>
                  {justificationData.justificationStatus}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Archivo de Evidencia
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                {justificationData.archivoAdjunto ? (
                  <button
                    onClick={() => handleDownload(justificationData)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <GrAttachment className="w-5 h-5" />
                    <span className="font-medium">
                      Descargar Archivo de Evidencia
                    </span>
                  </button>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-3">
                    No hay archivo disponible
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Descripción de la justificación si existe */}
        {getDescription(justificationData) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
              Descripción de la Justificación
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
              <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                {getDescription(justificationData)}
              </p>
            </div>
          </div>
        )}

        {/* Botón de cerrar */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalJustificationDetails;