"use client";

import { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

interface DownloadButtonProps {
  /** Base64 string del archivo */
  fileBase64?: string | null;
  /** MIME type del archivo (ej: "application/pdf", "image/png") */
  mimeType?: string;
  /** Nombre del archivo para descargar */
  fileName?: string;
  /** ID opcional para generar un nombre de archivo único */
  fileId?: string | number;
  /** Variante del botón */
  variant?: "icon" | "button" | "link";
  /** Tamaño del ícono */
  iconSize?: "sm" | "md" | "lg";
  /** Texto del botón (solo para variant="button") */
  label?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Mostrar tooltip */
  showTooltip?: boolean;
  /** Texto del tooltip personalizado */
  tooltipText?: string;
  /** Callback cuando la descarga es exitosa */
  onDownloadSuccess?: () => void;
  /** Callback cuando hay un error */
  onDownloadError?: (error: Error) => void;
}

/**
 * Componente reutilizable para descargar archivos desde Base64
 * 
 * @example
 * // Como ícono simple
 * <DownloadButton 
 *   fileBase64={data.archivoAdjunto}
 *   mimeType="application/pdf"
 *   fileName="documento.pdf"
 * />
 * 
 * @example
 * // Como botón con texto
 * <DownloadButton 
 *   fileBase64={data.archivoAdjunto}
 *   mimeType="application/pdf"
 *   variant="button"
 *   label="Descargar PDF"
 * />
 */
export default function DownloadButton({
  fileBase64,
  mimeType = "application/pdf",
  fileName,
  fileId,
  variant = "icon",
  iconSize = "md",
  label = "Descargar",
  className = "",
  showTooltip = true,
  tooltipText,
  onDownloadSuccess,
  onDownloadError,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Función auxiliar para limpiar nombres de archivo
  const sanitizeFileName = (name: string): string => {
    return name
      .replace(/[<>:"/\\|?*]/g, '_') // Reemplazar caracteres no válidos
      .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
      .replace(/_{2,}/g, '_') // Reemplazar múltiples guiones bajos con uno solo
      .toLowerCase();
  };

  // Función para generar el nombre del archivo
  const generateFileName = (id?: string | number, mime?: string): string => {
    if (fileName) return sanitizeFileName(fileName);

    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const extension = mime ? getFileExtension(mime) : "bin";
    
    // Generar un nombre más descriptivo según el tipo de archivo
    let prefix = "documento";
    
    if (mime?.includes("pdf")) {
      prefix = "documento";
    } else if (mime?.includes("image")) {
      prefix = "imagen";
    } else if (mime?.includes("word") || mime?.includes("doc")) {
      prefix = "documento";
    } else if (mime?.includes("excel") || mime?.includes("sheet")) {
      prefix = "hoja_calculo";
    } else if (mime?.includes("zip") || mime?.includes("rar")) {
      prefix = "archivo_comprimido";
    }
    
    const suffix = id ? `_${id}` : `_${new Date().getTime()}`;
    
    return sanitizeFileName(`${prefix}_${timestamp}${suffix}.${extension}`);
  };

  // Función para obtener la extensión según el MIME type
  const getFileExtension = (mime: string): string => {
    const mimeMap: Record<string, string> = {
      "application/pdf": "pdf",
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/gif": "gif",
      "image/webp": "webp",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/vnd.ms-excel": "xls",
      "application/zip": "zip",
      "application/x-rar-compressed": "rar",
      "text/plain": "txt",
      "text/csv": "csv",
    };

    return mimeMap[mime] || "bin";
  };

  // Función principal para descargar el archivo
  const handleDownload = async () => {
    if (!fileBase64) {
      const error = new Error("No hay archivo disponible para descargar");
      toast.error(error.message);
      onDownloadError?.(error);
      return;
    }

    setIsDownloading(true);

    try {
      // Limpiar el Base64 si tiene prefijos
      let cleanBase64 = fileBase64;
      if (fileBase64.includes(',')) {
        cleanBase64 = fileBase64.split(',')[1];
      }

      // Convertir Base64 a Blob
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateFileName(fileId, mimeType);
      
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Archivo descargado correctamente");
      onDownloadSuccess?.();
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      const downloadError = error instanceof Error ? error : new Error("Error desconocido al descargar");
      toast.error("Error al descargar el archivo");
      onDownloadError?.(downloadError);
    } finally {
      setIsDownloading(false);
    }
  };

  // Si no hay archivo, mostrar mensaje
  if (!fileBase64) {
    return (
      <span className="text-gray-400 dark:text-gray-500 text-sm">
        No hay archivo
      </span>
    );
  }

  // Tamaños de íconos
  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const defaultTooltip = `Descargar archivo (${mimeType || "desconocido"})`;

  // Variante: Ícono simple (GrAttachment)
  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        title={showTooltip ? (tooltipText || defaultTooltip) : undefined}
        className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isDownloading ? (
          <FaSpinner className={`${iconSizeClasses[iconSize]} animate-spin`} />
        ) : (
          <GrAttachment className={iconSizeClasses[iconSize]} />
        )}
      </button>
    );
  }

  // Variante: Botón con texto
  if (variant === "button") {
    return (
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        title={showTooltip ? (tooltipText || defaultTooltip) : undefined}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      >
        {isDownloading ? (
          <>
            <FaSpinner className="w-4 h-4 animate-spin" />
            <span>Descargando...</span>
          </>
        ) : (
          <>
            <FaDownload className="w-4 h-4" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  // Variante: Link/texto
  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      title={showTooltip ? (tooltipText || defaultTooltip) : undefined}
      className={`inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isDownloading ? (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          <span className="text-sm">Descargando...</span>
        </>
      ) : (
        <>
          <FaDownload className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </>
      )}
    </button>
  );
}
