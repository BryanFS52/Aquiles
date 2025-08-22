// Ejemplos de uso del JustificationStatus Slice

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  fetchAllJustificationStatuses,
  fetchJustificationStatusById,
  addJustificationStatus,
  updateJustificationStatus,
  deleteJustificationStatus,
  clearError,
  clearCurrentJustificationStatus,
  setCurrentPage
} from '../redux/slices/justificationStatusSlice';

// Ejemplo de componente que usa el slice
export const JustificationStatusExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Seleccionar datos del estado
  const {
    justificationStatuses,
    currentJustificationStatus,
    loading,
    error,
    totalPages,
    totalItems,
    currentPage
  } = useSelector((state: RootState) => state.justificationStatus);

  // IMPORTANTE: El fetch debe ir en la página padre, NO en el componente de tabla
  // Obtener todos los estados de justificación
  const handleFetchAll = () => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 10 }));
  };

  // Obtener un estado por ID
  const handleFetchById = (id: string) => {
    dispatch(fetchJustificationStatusById(id));
  };

  // Agregar nuevo estado
  const handleAdd = () => {
    const newStatus = {
      name: "Nuevo Estado",
      state: true
    };
    dispatch(addJustificationStatus(newStatus));
  };

  // Actualizar estado existente
  const handleUpdate = (id: string) => {
    const updatedStatus = {
      id,
      name: "Estado Actualizado",
      state: false
    };
    dispatch(updateJustificationStatus({ id, input: updatedStatus }));
  };

  // Eliminar estado
  const handleDelete = (id: string) => {
    dispatch(deleteJustificationStatus(id));
  };

  // Limpiar errores
  const handleClearError = () => {
    dispatch(clearError());
  };

  // Cambiar página
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchAllJustificationStatuses({ page, size: 10 }));
  };

  return (
    <div>
      <h2>Estados de Justificación</h2>
      
      {/* Mostrar loading */}
      {loading && <p>Cargando...</p>}
      
      {/* Mostrar errores */}
      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={handleClearError}>Limpiar Error</button>
        </div>
      )}
      
      {/* Botones de acción */}
      <div>
        <button onClick={handleFetchAll}>Obtener Todos</button>
        <button onClick={handleAdd}>Agregar Nuevo</button>
      </div>
      
      {/* Lista de estados */}
      <div>
        {justificationStatuses.map((status) => (
          <div key={status.id}>
            <p>ID: {status.id}</p>
            <p>Nombre: {status.name}</p>
            <p>Estado: {status.state ? 'Activo' : 'Inactivo'}</p>
            <button onClick={() => handleFetchById(status.id)}>Ver Detalles</button>
            <button onClick={() => handleUpdate(status.id)}>Actualizar</button>
            <button onClick={() => handleDelete(status.id)}>Eliminar</button>
          </div>
        ))}
      </div>
      
      {/* Paginación */}
      <div>
        <p>Página {currentPage + 1} de {totalPages}</p>
        <p>Total de elementos: {totalItems}</p>
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Anterior
        </button>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Siguiente
        </button>
      </div>
      
      {/* Estado actual seleccionado */}
      {currentJustificationStatus && (
        <div>
          <h3>Estado Seleccionado:</h3>
          <p>ID: {currentJustificationStatus.id}</p>
          <p>Nombre: {currentJustificationStatus.name}</p>
          <p>Estado: {currentJustificationStatus.state ? 'Activo' : 'Inactivo'}</p>
          <button onClick={() => dispatch(clearCurrentJustificationStatus())}>
            Limpiar Selección
          </button>
        </div>
      )}
    </div>
  );
};

// Ejemplo de hook customizado para usar el slice
export const useJustificationStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const justificationStatus = useSelector((state: RootState) => state.justificationStatus);

  const actions = {
    fetchAll: (page = 0, size = 10) => 
      dispatch(fetchAllJustificationStatuses({ page, size })),
    fetchById: (id: string) => 
      dispatch(fetchJustificationStatusById(id)),
    add: (data: { name: string; state: boolean }) => 
      dispatch(addJustificationStatus(data)),
    update: (id: string, data: { name: string; state: boolean }) => 
      dispatch(updateJustificationStatus({ id, input: { ...data, id } })),
    delete: (id: string) => 
      dispatch(deleteJustificationStatus(id)),
    clearError: () => 
      dispatch(clearError()),
    clearCurrent: () => 
      dispatch(clearCurrentJustificationStatus()),
    setPage: (page: number) => 
      dispatch(setCurrentPage(page))
  };

  return {
    ...justificationStatus,
    actions
  };
};
