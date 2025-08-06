'use client'

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { FaTrashAlt, FaEye, FaUserPlus } from "react-icons/fa"
import { toast } from "react-toastify"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import { addChecklist, fetchAllChecklists, deleteChecklist } from "@services/checkListService"
import { addEvaluation } from "@slice/evaluationSlice"
import { AppDispatch } from "@/redux/store"

// Interfaces para tipado
interface ChecklistData {
  trimester?: string
  component?: string
  remarks?: string
  [key: string]: any
}

interface Checklist {
  id: string
  state: boolean
  remarks?: string
  trimester?: string
  component?: string
  [key: string]: any
}

interface ApiResponse {
  code: string
  message?: string
  id?: string
  data?: Checklist[]
}

export default function CoordinadorChecklistView() {
  const dispatch = useDispatch<AppDispatch>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("todos")
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [checklistToDelete, setChecklistToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Cargar checklists al montar el componente
  useEffect(() => {
    loadChecklists()
  }, [])

  const loadChecklists = async (): Promise<void> => {
    try {
      setLoading(true)
      const response: ApiResponse = await fetchAllChecklists(0, 100) // Cargar todos los checklists
      if (response.code === "200" && response.data) {
        setChecklists(response.data)
      }
    } catch (error) {
      console.error("Error loading checklists:", error)
      toast.error("Error al cargar las listas de chequeo")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChecklist = async (checklistData: ChecklistData): Promise<void> => {
    try {
      const response: ApiResponse = await addChecklist(checklistData)
      console.log("API Response:", response); // Debug log
      
      if (response.code === "200") {
        // La respuesta tiene el ID directamente en response.id
        const newChecklistId = response.id;
        console.log("Checklist created with ID:", newChecklistId); // Debug log
        
        if (newChecklistId) {
          // Crear automáticamente una evaluación para esta lista de chequeo usando Redux
          try {
            console.log("Attempting to create evaluation for checklist:", newChecklistId); // Debug log
            
            const evaluationInput = {
              observations: "", // Iniciar como string vacío
              recommendations: "", // Iniciar como string vacío
              valueJudgment: "", // Iniciar como string vacío
              checklistId: parseInt(newChecklistId) // Asegurar que sea un número entero
            };

            console.log('Creating evaluation with input:', evaluationInput); // Debug log
            
            const evaluationResponse = await dispatch(addEvaluation(evaluationInput)).unwrap();
            console.log("Evaluation creation response:", evaluationResponse); // Debug log
            toast.success("Lista de chequeo creada exitosamente con evaluación asignada")
          } catch (evaluationError: any) {
            console.error("Error creating evaluation:", evaluationError);
            console.error("Evaluation error details:", evaluationError.message);
            // Aún así mostrar éxito de la lista, pero avisar del error de evaluación
            toast.success("Lista de chequeo creada exitosamente")
            toast.error("Error al crear la evaluación: " + (evaluationError.message || "Error desconocido"))
          }
        } else {
          console.warn("No se pudo obtener el ID de la lista creada:", response);
          toast.success("Lista de chequeo creada exitosamente")
          toast.warning("No se pudo crear la evaluación automáticamente")
        }
        
        // Recargar la lista para mostrar el nuevo checklist
        await loadChecklists()
        setModalOpen(false)
      } else {
        toast.error(response.message || "Error al crear la lista de chequeo")
      }
    } catch (error) {
      console.error("Error creating checklist:", error)
      toast.error("Error al crear la lista de chequeo")
    }
  }

  const handleDeleteChecklist = async (): Promise<void> => {
    if (!checklistToDelete) return
    
    try {
      const response: ApiResponse = await deleteChecklist(checklistToDelete)
      if (response.code === "200") {
        toast.success("Lista de chequeo eliminada exitosamente")
        // Recargar la lista
        await loadChecklists()
      } else {
        toast.error(response.message || "Error al eliminar la lista de chequeo")
      }
    } catch (error) {
      console.error("Error deleting checklist:", error)
      toast.error("Error al eliminar la lista de chequeo")
    } finally {
      setConfirmModalOpen(false)
      setChecklistToDelete(null)
    }
  }

  const handleToggleState = async (checklistId: string, currentState: boolean): Promise<void> => {
    try {
      // Aquí harías la llamada al API para actualizar el estado
      // Por ahora simularemos el cambio de estado
      const updatedChecklists = checklists.map(checklist =>
        checklist.id === checklistId 
          ? { ...checklist, state: !currentState }
          : checklist
      )
      setChecklists(updatedChecklists)
      
      toast.success(`Lista de chequeo ${!currentState ? 'activada' : 'desactivada'} exitosamente`)
    } catch (error) {
      console.error("Error updating checklist state:", error)
      toast.error("Error al actualizar el estado de la lista de chequeo")
    }
  }

  const handleCloseModal = (): void => setModalOpen(false)

  const handleOpenConfirmModal = (checklistId: string): void => {
    setChecklistToDelete(checklistId)
    setConfirmModalOpen(true)
  }

  const handleViewChecklist = (checklistId: string): void => {
    // Aquí puedes implementar la navegación a la vista detallada del checklist
    toast.info(`Ver detalles del checklist ${checklistId}`)
  }

  const handleAssignChecklist = (checklistId: string): void => {
    // Aquí puedes implementar la funcionalidad de asignación
    toast.info(`Asignar checklist ${checklistId}`)
  }

  // Filtrar checklists por trimestre seleccionado y ordenar por ID descendente (más recientes primero)
  // Nota: Si trimester no está disponible o se selecciona "todos", mostrar todos los checklists
  const filteredChecklists = checklists
    .filter((checklist) => {
      if (selectedTrimestre === "todos") {
        return true; // Mostrar todos los checklists
      }
      return !checklist.trimester || checklist.trimester === selectedTrimestre;
    })
    .sort((a, b) => parseInt(b.id) - parseInt(a.id)) // Ordenar por ID descendente (más recientes primero)

  return (
    <>
      <PageTitle>Listas de Chequeo Trimestrales</PageTitle>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="trimestre-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por trimestre:
          </label>
          <select
            id="trimestre-select"
            value={selectedTrimestre}
            onChange={(e) => setSelectedTrimestre(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
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
          onClick={() => setModalOpen(true)}
          className="bg-[#00324d] text-white px-4 py-2 rounded hover:bg-[#40b003] transition-colors"
        >
          Crear Lista de Chequeo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00324d]"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando listas de chequeo...</span>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Trimestre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Componente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Observaciones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredChecklists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {selectedTrimestre === "todos" 
                      ? "No hay listas de chequeo disponibles" 
                      : `No hay listas de chequeo para el trimestre ${selectedTrimestre}`
                    }
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((checklist) => (
                  <tr key={checklist.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {checklist.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {checklist.trimester ? `${checklist.trimester}° Trimestre` : 'No especificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {checklist.component || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={() => handleToggleState(checklist.id, checklist.state)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          checklist.state
                            ? 'bg-green-600 focus:ring-green-500'
                            : 'bg-gray-200 focus:ring-gray-500'
                        }`}
                        title={checklist.state ? 'Desactivar lista' : 'Activar lista'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                            checklist.state ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`ml-2 text-xs font-medium ${
                        checklist.state 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {checklist.state ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {checklist.remarks || 'Sin observaciones'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewChecklist(checklist.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver detalles"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleAssignChecklist(checklist.id)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Asignar"
                        >
                          <FaUserPlus />
                        </button>
                        <button 
                          onClick={() => handleOpenConfirmModal(checklist.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de creación */}
      <CrearListaChequeo 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        onCreate={handleCreateChecklist} 
      />

      {/* Modal de confirmación para eliminar */}
      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar esta lista de chequeo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
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
