'use client'

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@redux/store"
import { fetchChecklists, addChecklist, updateChecklist, deleteChecklist } from "@redux/slices/checklistSlice"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import { toast } from "react-toastify"

/**
 * Vista de Listas de Chequeo - ROL: COORDINADOR
 * 
 * RESPONSABILIDADES:
 * ==================
 * 1. Crear listas de chequeo con indicadores (técnicos/actitudinales)
 * 2. Asociar listas a fichas de formación (studySheets)
 * 3. Definir trimestre, componente y proyecto formativo
 * 4. Activar/Desactivar listas
 * 5. Editar/Eliminar listas creadas
 * 
 * CAMPOS QUE SE LLENAN AQUÍ:
 * - state (activo/inactivo)
 * - trimester
 * - component
 * - studySheets (fichas asociadas)
 * - trainingProjectId
 * - items (indicadores)
 * 
 * CAMPOS QUE SE LLENAN EN LA VISTA DEL INSTRUCTOR:
 * - instructorSignature (firma digital)
 * - evaluationCriteria (cumplimiento de criterios)
 * - remarks (observaciones finales)
 * - evaluations (relación 1:1 con evaluación)
 */
export default function CoordinadorChecklistView() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: checklists, loading, error } = useSelector((state: RootState) => state.checklist)

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedTrimestre, setSelectedTrimestre] = useState("todos")
  const [isEditing, setIsEditing] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null)
  const [expandedCriteria, setExpandedCriteria] = useState<{ [key: string]: boolean }>({})

  // Cargar listas al montar el componente
  useEffect(() => {
    dispatch(fetchChecklists({ page: 0, size: 100 }))
  }, [dispatch])

  // Comentado para evitar dobles notificaciones - los errores se manejan en cada función
  // useEffect(() => {
  //   if (error) {
  //     toast.error(`Error: ${error}`)
  //   }
  // }, [error])

  const handleCloseModal = () => {
    setModalOpen(false)
    setIsEditing(false)
    setSelectedChecklist(null)
  }

  const handleOpenCreateModal = () => {
    setIsEditing(false)
    setSelectedChecklist(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (checklist: any) => {
    setIsEditing(true)
    setSelectedChecklist(checklist)
    setModalOpen(true)
  }

  const handleOpenConfirmModal = (checklist: any) => {
    setSelectedChecklist(checklist)
    setConfirmModalOpen(true)
  }

  const handleDeleteChecklist = async () => {
    if (selectedChecklist) {
      try {
        await dispatch(deleteChecklist(selectedChecklist.id)).unwrap()
        toast.success("Lista de chequeo eliminada exitosamente")
        // Recargar listas
        dispatch(fetchChecklists({ page: 0, size: 100 }))
      } catch (err: any) {
        // Extraer solo el mensaje limpio del error
        let errorMessage = err.message || 'Error desconocido';
        
        // Remover prefijos técnicos del mensaje
        if (errorMessage.includes('Unexpected error in deleteChecklist:')) {
          errorMessage = errorMessage.split('Unexpected error in deleteChecklist:')[1].trim();
        }
        if (errorMessage.startsWith('Error Deleting Checklist:')) {
          errorMessage = errorMessage.replace('Error Deleting Checklist:', '').trim();
        }
        
        toast.error(errorMessage);
      }
    }
    setConfirmModalOpen(false)
    setSelectedChecklist(null)
  }

  const handleSaveChecklist = async (data: any) => {
    try {
      if (isEditing) {
        // Actualizar lista existente
        const { id, ...inputData } = data // Separar id del resto de datos
        await dispatch(updateChecklist({ 
          id, 
          input: inputData 
        })).unwrap()
        toast.success("Lista de chequeo actualizada exitosamente")
      } else {
        // Crear nueva lista
        await dispatch(addChecklist(data)).unwrap()
        toast.success("Lista de chequeo creada exitosamente")
      }

      // Recargar listas
      dispatch(fetchChecklists({ page: 0, size: 100 }))
      handleCloseModal()
    } catch (err: any) {
      // Extraer solo el mensaje limpio del error
      let errorMessage = err.message || 'Error desconocido';
      
      // Remover prefijos técnicos del mensaje
      if (errorMessage.includes('Unexpected error in updateChecklist:')) {
        errorMessage = errorMessage.split('Unexpected error in updateChecklist:')[1].trim();
      }
      if (errorMessage.startsWith('Error Updating Checklist:')) {
        errorMessage = errorMessage.replace('Error Updating Checklist:', '').trim();
      }
      
      toast.error(errorMessage);
    }
  }

  // Toggle para expandir/contraer criterios
  const toggleCriteria = (checklistId: string) => {
    setExpandedCriteria(prev => ({
      ...prev,
      [checklistId]: !prev[checklistId]
    }))
  }

  const getFormattedStudySheets = (studySheets: string): string => {
    if (!studySheets) return 'Sin fichas asociadas'
    const sheetIds = studySheets.split(',')
    return `${sheetIds.length} ${sheetIds.length === 1 ? 'ficha asociada' : 'fichas asociadas'}`
  }

  // Filtrar listas según el trimestre seleccionado
  const filteredChecklists = (checklists || []).filter(
    (checklist: any) => selectedTrimestre === "todos" || checklist.trimester === selectedTrimestre
  )

  return (
    <>
      <PageTitle>Listas de Chequeo Trimestrales</PageTitle>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="trimestre-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filtrar por trimestre:
          </label>
          <select
            id="trimestre-select"
            value={selectedTrimestre}
            onChange={(e) => setSelectedTrimestre(e.target.value)}
            className="px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-full focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <option value="todos">Todos los Trimestres</option>
            <option value="1">Primer Trimestre</option>
            <option value="2">Segundo Trimestre</option>
            <option value="3">Tercer Trimestre</option>
            <option value="4">Cuarto Trimestre</option>
            <option value="5">Quinto Trimestre</option>
            <option value="6">Sexto Trimestre</option>
            <option value="7">Séptimo Trimestre</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreateModal}
          disabled={loading}
          className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-6 py-3 rounded-full hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Crear Lista de Chequeo
        </button>
      </div>

      <div className="mt-6 overflow-visible">
        {loading ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Cargando listas de chequeo...
              </p>
            </div>
          </div>
        ) : filteredChecklists.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {selectedTrimestre === "todos" 
                  ? "No hay listas de chequeo disponibles. Crea tu primera lista de chequeo."
                  : `No hay listas de chequeo para el trimestre ${selectedTrimestre}`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto pb-8 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {filteredChecklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="group relative transform transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-2xl hover:shadow-lime-200 dark:hover:shadow-shadowBlue/30 overflow-hidden">
                    <div className="bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-white">
                          {checklist.trimester}° Trimestre
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(checklist)}
                            className="text-white hover:text-yellow-300 transition-colors p-2 rounded-full hover:bg-white/10"
                            title="Editar"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenConfirmModal(checklist)}
                            className="text-white hover:text-red-300 transition-colors p-2 rounded-full hover:bg-white/10"
                            title="Eliminar"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">

                      <div>
                        <span className="text-xs font-semibold text-lime-600 uppercase tracking-wide">
                          Fichas Asociadas <br/>
                        </span>
                        <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-xs font-bold border border-gray-300 dark:border-gray-500">
                          {getFormattedStudySheets(checklist.studySheets || "")}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 uppercase tracking-wide">
                          Indicadores
                        </span>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between bg-lime-50 dark:bg-lime-900/20 rounded-lg px-3 py-2 border border-lime-200 dark:border-lime-700">
                            <span className="text-xs font-medium text-lime-700 dark:text-lime-300">
                              Técnicos
                            </span>
                            <span className="text-sm font-bold text-lime-800 dark:text-lime-200">
                              {checklist.items?.filter((item: any) => item.code?.startsWith('TEC')).length ?? 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-lime-50 dark:bg-lime-900/20 rounded-lg px-3 py-2 border border-lime-200 dark:border-lime-700">
                            <span className="text-xs font-medium text-lime-700 dark:text-lime-300">
                              Actitudinales
                            </span>
                            <span className="text-sm font-bold text-lime-800 dark:text-lime-200">
                              {checklist.items?.filter((item: any) => item.code?.startsWith('ACT')).length ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 uppercase tracking-wide">
                          Estado
                        </span>
                        <div className="mt-2 flex items-center">
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${checklist.state
                              ? 'bg-gradient-to-r from-lime-600 to-lime-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-lg ${checklist.state ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                          <span className={`ml-3 text-xs font-bold ${checklist.state
                            ? 'text-lime-600'
                            : 'text-gray-500'
                            }`}>
                            {checklist.state ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>

                      <div className="min-h-[60px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-lime-600 uppercase tracking-wide">
                            Criterios de evaluación
                          </span>
                          {checklist.remarks && checklist.remarks.length > 30 && (
                            <button
                              onClick={() => toggleCriteria(checklist.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 rounded-full shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              {expandedCriteria[checklist.id] ? (
                                <>
                                  <span>Ver menos</span>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <span>Ver más</span>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap transition-all duration-300 ${
                          !expandedCriteria[checklist.id] && checklist.remarks && checklist.remarks.length > 30
                            ? 'line-clamp-2'
                            : ''
                        }`}>
                          {checklist.remarks || 'Sin observaciones'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CrearListaChequeo
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleSaveChecklist}
        editingData={selectedChecklist}
        isEditing={isEditing}
      />

      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar esta lista de chequeo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteChecklist}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
