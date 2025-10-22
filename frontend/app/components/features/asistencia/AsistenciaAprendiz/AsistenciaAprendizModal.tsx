import React from "react";
import Modal from "@components/UI/Modal";

interface SelectedEvent {
  id: string;
  title: string;
  date: string;
  attendanceId: number;
  competenceName?: string;
  competenceQuarterId?: string;
}

interface AsistenciaAprendizModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: SelectedEvent | null;
  onGoToJustifications: () => void;
}

const AsistenciaAprendizModal: React.FC<AsistenciaAprendizModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  onGoToJustifications
}) => {
  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Presente':
      case 'Asistencia':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Inasistencia':
      case 'Ausente':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Retardo':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Justificacion':
      case 'Justificado':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!selectedEvent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Asistencia"
      size="md"
    >
      <div className="space-y-6">
        {/* Información del evento */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-600">Fecha</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-gray-600">Estado</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedEvent.title)}`}>
              {selectedEvent.title}
            </span>
          </div>

          {/* Mostrar información de competencia si está disponible */}
          {selectedEvent.competenceName && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm font-medium text-gray-600">Competencia</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {selectedEvent.competenceName}
              </span>
            </div>
          )}
        </div>

        {/* Descripción adicional */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Información</h4>
              <p className="text-sm font-semibold text-black">
                {selectedEvent.title === 'Inasistencia' || selectedEvent.title === 'Ausente'
                  ? 'Este es tu registro de inasistencia para el día seleccionado. Si necesitas justificar esta ausencia, puedes acceder a la página de justificaciones.'
                  : `Este es tu registro de asistencia para el día seleccionado${selectedEvent.competenceName ? ` en la competencia "${selectedEvent.competenceName}"` : ''}. El registro es informativo y no requiere acciones adicionales.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cerrar
          </button>
          {/* Solo mostrar botón de justificaciones si el estado es "Inasistencia" o "Ausente" */}
          {(selectedEvent.title === 'Ausente' || selectedEvent.title === 'Inasistencia') && (
            <button
              onClick={onGoToJustifications}
              className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r  from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 rounded-lg font-medium transition-all duration-200 focus:ring-lime-500/50 active:scale-95 flex items-center justify-center gap-2 min-w-[180px]"
            >
              Ir a Justificaciones
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AsistenciaAprendizModal;