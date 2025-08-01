// Ejemplo de uso del componente JustificationTable con el nuevo select de estados

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllJustificationStatuses } from '@/redux/slices/justificationStatusSlice';
import JustificationTable from '@/components/features/justification/justificationsTable';

export const JustificationTableExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Datos de ejemplo de justificaciones
  const mockJustifications = [
    {
      id: "1",
      programa: "ADSO",
      ficha: "2558954",
      documento: "1234567890",
      aprendiz: "Juan Pérez",
      fecha: "2024-08-01",
      estado: "Pendiente",
      justificationStatusId: "1",
      archivoAdjunto: "archivo1.pdf",
      archivoMime: "application/pdf"
    },
    {
      id: "2",
      programa: "ADSO",
      ficha: "2558954",
      documento: "0987654321",
      aprendiz: "María García",
      fecha: "2024-08-02",
      estado: "Aprobado",
      justificationStatusId: "2",
      archivoAdjunto: "archivo2.pdf",
      archivoMime: "application/pdf"
    }
  ];

  // Cargar los estados de justificación al montar el componente
  useEffect(() => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 20 }));
  }, [dispatch]);

  const handleDownloadFile = (justificacion: any) => {
    console.log('Descargar archivo:', justificacion);
    // Aquí iría la lógica de descarga
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    console.log('Cambiar estado:', justificacionId, 'a', newStatusId);
    // Aquí iría la lógica para actualizar el estado
    // Por ejemplo, llamar a una API o actualizar el estado de Redux
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplo: Tabla de Justificaciones con Estados Dinámicos</h1>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Características:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Select dinámico con estados de justificación desde el backend</li>
          <li>✅ Solo muestra estados activos (state: true)</li>
          <li>✅ Actualización automática del estado visual</li>
          <li>✅ Mapeo inteligente de nombres de estado</li>
          <li>✅ Compatible con tema claro y oscuro</li>
          <li>✅ Manejo de errores y estados de carga</li>
        </ul>
      </div>

      <JustificationTable
        filteredData={mockJustifications}
        handleDownloadFile={handleDownloadFile}
        handleStatusChange={handleStatusChange}
      />

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Estados de Justificación Disponibles:</h3>
        <JustificationStatusList />
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar los estados disponibles
const JustificationStatusList = () => {
  const { justificationStatuses, loading } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando estados...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {justificationStatuses
        .filter(status => status.state)
        .map((status) => (
          <div 
            key={status.id} 
            className="p-2 bg-white dark:bg-gray-700 rounded border text-sm"
          >
            <span className="font-medium">ID:</span> {status.id} | 
            <span className="font-medium"> Nombre:</span> {status.name} |
            <span className="font-medium"> Estado:</span> 
            <span className={`ml-1 ${status.state ? 'text-green-600' : 'text-red-600'}`}>
              {status.state ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        ))}
    </div>
  );
};

export default JustificationTableExample;
