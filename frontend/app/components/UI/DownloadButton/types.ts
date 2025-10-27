export interface DownloadButtonProps {
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

export type FileVariant = "icon" | "button" | "link";
export type IconSize = "sm" | "md" | "lg";
