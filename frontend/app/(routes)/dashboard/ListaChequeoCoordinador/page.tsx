'use client'

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
import { toast } from "react-toastify"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import { 
  fetchChecklists, 
  fetchChecklistById, 
  addChecklist, 
  updateChecklist, 
  updateChecklistState,
  deleteChecklist 
} from "@slice/checklistSlice"
import { addEvaluation } from "@slice/evaluationSlice"
import { AppDispatch, RootState } from "@/redux/store"

// Interfaces para tipado
interface ChecklistItem {
  id?: string
  code?: string
  indicator: string
  active?: boolean
}

interface ChecklistData {
  trimester?: string
  component?: string
  remarks?: string
  items?: ChecklistItem[]
  [key: string]: any
}

interface Checklist {
  id: string
  state: boolean
  remarks?: string
  trimester?: string
  component?: string
  items?: ChecklistItem[]
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
  const { data: checklists, loading, error } = useSelector((state: RootState) => state.checklist)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("todos")
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [checklistToDelete, setChecklistToDelete] = useState<string | null>(null)
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Cargar checklists al montar el componente
  useEffect(() => {
    loadChecklists()
  }, [])

  const loadChecklists = async (): Promise<void> => {
    try {
      console.log('🔄 Loading checklists with force refresh...'); // Debug log
      const result = await dispatch(fetchChecklists({ page: 0, size: 100 })).unwrap()
      console.log('loadChecklists Redux result:', result) // Debug log
      if (result?.data) {
        console.log('loadChecklists data count:', result.data.length) // Debug log
        console.log('First checklist sample:', result.data[0]) // Debug log
        if (result.data[0] && result.data[0].items) {
          console.log('First checklist items:', result.data[0].items) // Debug log
        }
        console.log('✅ Checklists loaded successfully'); // Debug log
      }
    } catch (error) {
      console.error("❌ Error loading checklists:", error)
      toast.error("Error al cargar las listas de chequeo")
    }
  }

  const transformItems = (items: ChecklistItem[]) => {
    return items.map((item, index) => ({
      ...(item.id && { id: item.id }), // ← Preservar ID si existe
      code: item.code || `IND-${index + 1}`,
      indicator: item.indicator,
      active: item.active !== undefined ? item.active : true
    }));
  };

  const handleCreateChecklist = async (checklistData: ChecklistData): Promise<void> => {
    try {
      if (isEditing && editingChecklist) {
        // Actualizar checklist existente
        console.log('=== UPDATING CHECKLIST ===');
        console.log('Updating checklist with ID:', editingChecklist.id);
        console.log('Original editingChecklist:', editingChecklist);
        console.log('Incoming checklistData:', checklistData);
        
        const updateData = {
          state: editingChecklist.state !== undefined ? editingChecklist.state : true,
          remarks: checklistData.remarks || "Sin observaciones",
          trimester: checklistData.trimester || "1",
          component: checklistData.component || "",
          evaluationCriteria: editingChecklist.evaluationCriteria || false,
          instructorSignature: editingChecklist.instructorSignature || "No signature",
          studySheets: editingChecklist.studySheets || null,
          evaluations: editingChecklist.evaluations || null,
          associatedJuries: editingChecklist.associatedJuries || null,
          items: checklistData.items ? transformItems(checklistData.items) : []
        };
        
        console.log('Final updateData being sent:', updateData);
        console.log('🎯 DETAILED UPDATEDATA ITEMS:');
        updateData.items.forEach((item, index) => {
          console.log(`  UpdateData Item ${index + 1}: id=${item.id || 'NO_ID'}, code="${item.code}", indicator="${item.indicator}", active=${item.active}`);
        });
        
        const result = await dispatch(updateChecklist({ 
          id: parseInt(editingChecklist.id), 
          input: updateData 
        })).unwrap();
        
        console.log("Update result:", result); // Debug log
        
        if (result && result.code === "200") {
          console.log("✅ Update successful, refreshing specific checklist data..."); // Debug log
          toast.success("Lista de chequeo actualizada exitosamente");
          
          // Pequeño delay para asegurar que la DB se actualice
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Primero recargar el checklist específico por ID para forzar una actualización
          console.log("📡 Fetching updated checklist by ID...");
          await dispatch(fetchChecklistById({ id: parseInt(editingChecklist.id) })).unwrap();
          
          // Luego recargar toda la lista para asegurar consistencia
          console.log("📡 Reloading full checklist data...");
          await loadChecklists();
          
          // Cerrar el modal
          handleCloseModal();
          
          console.log("✅ Data refreshed and modal closed"); // Debug log
          console.log("📊 Final checklist data after update:"); // Debug log
          
          // Buscar el checklist actualizado en los datos actuales
          const updatedChecklistInState = normalizedChecklists.find(c => c.id === editingChecklist.id);
          console.log("Updated checklist in state:", updatedChecklistInState); // Debug log
          if (updatedChecklistInState) {
            console.log("Updated checklist items:", updatedChecklistInState.items); // Debug log
            console.log("🔍 DETAILED FINAL ITEMS AFTER UPDATE:"); // Debug log
            if (updatedChecklistInState.items) {
              updatedChecklistInState.items.forEach((item, index) => {
                if (item) {
                  console.log(`  Final Item ${index + 1}: id=${item.id}, indicator="${item.indicator}", active=${item.active}`); // Debug log
                }
              });
            }
          }
        } else {
          console.log("❌ Update failed:", result); // Debug log
          toast.error(result?.message || "Error al actualizar la lista de chequeo");
        }
      } else {
        // Crear nuevo checklist
        const newChecklistData = {
          state: true,
          remarks: checklistData.remarks || "Sin observaciones",
          trimester: checklistData.trimester || "1",
          component: checklistData.component || "",
          evaluationCriteria: false,
          instructorSignature: "No signature",
          studySheets: null,
          evaluations: null,
          associatedJuries: null,
          items: checklistData.items ? transformItems(checklistData.items) : []
        };
        
        const result = await dispatch(addChecklist(newChecklistData)).unwrap();
        console.log("Create result:", result); // Debug log
        
        if (result && result.code === "200") {
          const newChecklistId = result.id;
          console.log("Checklist created with ID:", newChecklistId); // Debug log
          
          if (newChecklistId) {
            // Crear automáticamente una evaluación para esta lista de chequeo usando Redux
            try {
              const evaluationInput = {
                observations: "", 
                recommendations: "", 
                valueJudgment: "PENDIENTE", 
                checklistId: parseInt(newChecklistId) // Asegurar que es un número
              };

              console.log('=== CREATING EVALUATION ===');
              console.log('Checklist ID:', newChecklistId);
              console.log('Checklist ID type:', typeof newChecklistId);
              console.log('Parsed Checklist ID:', parseInt(newChecklistId));
              console.log('Creating evaluation with input:', evaluationInput);
              
              const evaluationResponse = await dispatch(addEvaluation(evaluationInput)).unwrap();
              console.log("Evaluation creation response:", evaluationResponse);
              
              if (evaluationResponse && evaluationResponse.code === "200") {
                console.log("✅ Evaluation created successfully with ID:", evaluationResponse.id);
                toast.success("Lista de chequeo creada exitosamente con evaluación asignada")
              } else {
                console.log("❌ Evaluation creation failed:", evaluationResponse);
                toast.success("Lista de chequeo creada exitosamente")
                toast.error("Error al crear la evaluación: " + (evaluationResponse?.message || "Error desconocido"))
              }
            } catch (evaluationError: any) {
              console.error("❌ Error creating evaluation:", evaluationError);
              console.error("Error stack:", evaluationError);
              toast.success("Lista de chequeo creada exitosamente")
              toast.error("Error al crear la evaluación: " + (evaluationError.message || "Error desconocido"))
            }
          } else {
            console.warn("No se pudo obtener el ID de la lista creada:", result);
            toast.success("Lista de chequeo creada exitosamente")
            toast.warning("No se pudo crear la evaluación automáticamente")
          }
          
          // Recargar la lista para mostrar el nuevo checklist
          await loadChecklists()
          setModalOpen(false)
        } else {
          toast.error(result?.message || "Error al crear la lista de chequeo")
        }
      }
    } catch (error: any) {
      console.error("Error with checklist operation:", error)
      toast.error(isEditing ? "Error al actualizar la lista de chequeo" : "Error al crear la lista de chequeo")
    }
  }

  const handleDeleteChecklist = async (): Promise<void> => {
    if (!checklistToDelete) return
    
    try {
      await dispatch(deleteChecklist(checklistToDelete)).unwrap()
      toast.success("Lista de chequeo eliminada exitosamente")
      // Recargar la lista
      await loadChecklists()
    } catch (error: any) {
      console.error("Error deleting checklist:", error)
      toast.error("Error al eliminar la lista de chequeo")
    } finally {
      setConfirmModalOpen(false)
      setChecklistToDelete(null)
    }
  }

  const handleToggleState = async (checklistId: string, currentState: boolean | null | undefined): Promise<void> => {
    try {
      const newState = !currentState;
      await dispatch(updateChecklistState({ id: checklistId, state: newState })).unwrap();
      toast.success(`Lista de chequeo ${newState ? 'activada' : 'desactivada'} exitosamente`)
    } catch (error: any) {
      console.error("Error updating checklist state:", error)
      toast.error("Error al actualizar el estado de la lista de chequeo")
    }
  }

  const handleCloseModal = (): void => {
    console.log("handleCloseModal called, isEditing:", isEditing) // Debug log
    
    setModalOpen(false)
    setIsEditing(false)
    setEditingChecklist(null)
    
    // Limpiar cualquier cache o estado temporal
    console.log("Modal closed, states cleared") // Debug log
  }

  const handleOpenCreateModal = (): void => {
    setIsEditing(false)
    setEditingChecklist(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = async (checklist: any): Promise<void> => {
    try {
      console.log("Opening edit modal for checklist:", checklist.id) // Debug log
      
      // Obtener el checklist completo con todos sus items/indicadores usando Redux
      await dispatch(fetchChecklistById({ id: parseInt(checklist.id) })).unwrap();
      
      // Buscar el checklist transformado en el estado de Redux
      const updatedChecklist = checklists.find(item => item.id === checklist.id);
      console.log("Updated checklist from Redux state:", updatedChecklist) // Debug log
      
      if (updatedChecklist) {
        console.log("=== OPENING EDIT MODAL ==="); // Debug log
        console.log("Checklist items being passed to modal:", updatedChecklist.items) // Debug log
        console.log("🔍 DETAILED ITEMS BEING PASSED TO MODAL:"); // Debug log
        if (updatedChecklist.items) {
          updatedChecklist.items.forEach((item, index) => {
            if (item) {
              console.log(`  Item ${index + 1}: id=${item.id}, indicator="${item.indicator}", active=${item.active}`); // Debug log
            }
          });
        }
        setIsEditing(true)
        setEditingChecklist(updatedChecklist as any)
        setModalOpen(true)
        console.log("Edit modal opened successfully"); // Debug log
        console.log("=== END OPENING EDIT MODAL ==="); // Debug log
      } else {
        console.log("Checklist not found in Redux state after fetch") // Debug log
        toast.error("Error al obtener los detalles del checklist")
      }
    } catch (error: any) {
      console.error("Error fetching checklist details:", error)
      toast.error("Error al cargar los detalles del checklist")
    }
  }

  const handleOpenConfirmModal = (checklistId: string): void => {
    setChecklistToDelete(checklistId)
    setConfirmModalOpen(true)
  }

  // Normalizar id a string para evitar exclusión por tipo
  const normalizedChecklists = checklists.map(c => ({
    ...c,
    id: c.id != null ? c.id.toString() : ''
  }));

  const filteredChecklists = normalizedChecklists
    .filter((checklist) => {
      // Filtrar checklists inválidos
      if (!checklist || checklist.id == null || checklist.id === '') {
        console.warn("Filtering out invalid checklist:", checklist); // Debug log
        return false;
      }
      
      if (selectedTrimestre === "todos") {
        return true; // Mostrar todos los checklists válidos
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
          onClick={handleOpenCreateModal}
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
                  Indicadores
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
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {selectedTrimestre === "todos" 
                      ? "No hay listas de chequeo disponibles" 
                      : `No hay listas de chequeo para el trimestre ${selectedTrimestre}`
                    }
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((checklist) => {
                  // Debug log para cada checklist en el render
                  console.log(`Rendering checklist ${checklist.id}:`, checklist);
                  console.log(`Checklist ${checklist.id} items:`, checklist.items);
                  
                  // Verificación de seguridad adicional
                  if (!checklist || !checklist.id) {
                    console.error("Attempting to render invalid checklist:", checklist);
                    return null; // No renderizar checklist inválido
                  }
                  
                  return (
                    <tr key={`checklist-${checklist.id}`}>
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
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                        {checklist.items ? checklist.items.length : 0} indicadores
                      </span>
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
                          onClick={() => handleOpenEditModal(checklist)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <FaEdit />
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de creación/edición */}
      <CrearListaChequeo 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        onCreate={handleCreateChecklist}
        editingData={editingChecklist || undefined}
        isEditing={isEditing}
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
