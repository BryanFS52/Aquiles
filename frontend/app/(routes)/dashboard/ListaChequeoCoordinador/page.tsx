'use client'

import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
import { toast } from "react-toastify"
import { AppDispatch, RootState } from "@redux/store"
import { addEvaluation } from "@slice/evaluationSlice"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import checklistEnhancementService from "@services/checklistEnhancementService"
import {
  fetchChecklists,
  fetchChecklistById,
  addChecklist,
  updateChecklist,
  updateChecklistState,
  deleteChecklist
} from "@slice/checklistSlice"

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
  trainingProjectId?: number
  trainingProjectName?: string
  studySheets?: string
  items?: ChecklistItem[]
  [key: string]: any
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
  const [enrichedChecklists, setEnrichedChecklists] = useState<any[]>([])
  const [enrichmentLoading, setEnrichmentLoading] = useState<boolean>(false)
  
  
  const loadChecklists = useCallback(async (): Promise<void> => {
    try {
      console.log("🔄 Loading checklists with force refresh...") // Debug log
      const result = await dispatch(
        fetchChecklists({ page: 0, size: 100 })
      ).unwrap()
      
      console.log('loadChecklists Redux result:', result) // Debug log
      
      if (result?.data) {
        console.log('loadChecklists data count:', result.data.length) // Debug log
        console.log('First checklist sample:', result.data[0]) // Debug log
        
        // Enriquecer los checklists con información adicional
        setEnrichmentLoading(true)
        try {
          const enriched = await checklistEnhancementService.enrichChecklists(result.data)
          console.log('✅ Checklists enriched:', enriched.length) // Debug log
          setEnrichedChecklists(enriched)
        } catch (enrichmentError) {
          console.warn('⚠️ Error enriching checklists, using basic data:', enrichmentError)
          setEnrichedChecklists(result.data)
        } finally {
          setEnrichmentLoading(false)
        }
        
        console.log('✅ Checklists loaded successfully'); // Debug log
      }
    } catch (error) {
      console.error("❌ Error loading checklists:", error)
      toast.error("Error al cargar las listas de chequeo")
      setEnrichmentLoading(false)
    }
  }, [dispatch])
  
  // Cargar checklists al montar el componente
  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);
  
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
        
        // ← Log específico para trimester y component
        console.log('🔍 FIELD VALUES COMPARISON:');
        console.log('  trimester - original:', editingChecklist.trimester, ', incoming:', checklistData.trimester);
        console.log('  component - original:', editingChecklist.component, ', incoming:', checklistData.component);

        // ← Procesar items eliminados si los hay
        if (checklistData.deletedItemIds && checklistData.deletedItemIds.length > 0) {
          console.log('🗑️ PROCESSING DELETED ITEMS:', checklistData.deletedItemIds);
        }

        const updateData = {
          state: editingChecklist.state !== undefined ? editingChecklist.state : true,
          remarks: checklistData.remarks || "Sin observaciones",
          trimester: checklistData.trimester !== undefined ? checklistData.trimester : (editingChecklist.trimester || "1"),
          component: checklistData.component !== undefined ? checklistData.component : (editingChecklist.component || ""),
          evaluationCriteria: editingChecklist.evaluationCriteria || false,
          instructorSignature: editingChecklist.instructorSignature || JSON.stringify({}),
          studySheets: checklistData.studySheets || editingChecklist.studySheets || null,
          trainingProjectId: checklistData.trainingProjectId || (editingChecklist as any).trainingProjectId || null,
          evaluations: editingChecklist.evaluations || null,
          associatedJuries: editingChecklist.associatedJuries || null,
          items: checklistData.items ? transformItems(checklistData.items) : [],
          // ← Agregar items eliminados para el backend
          ...(checklistData.deletedItemIds && checklistData.deletedItemIds.length > 0 && { 
            deletedItemIds: checklistData.deletedItemIds 
          })
        };

        console.log('Final updateData being sent:', updateData);
        console.log('🎯 FINAL VALUES BEING SENT:');
        console.log('  trimester:', updateData.trimester, '(type:', typeof updateData.trimester, ')');
        console.log('  component:', updateData.component, '(type:', typeof updateData.component, ')');
        console.log('🎯 DETAILED UPDATEDATA ITEMS:');
        updateData.items.forEach((item: any, index: number) => {
          console.log(`  UpdateData Item ${index + 1}: id=${item.id || 'NO_ID'}, code="${item.code}", indicator="${item.indicator}", active=${item.active}`);
        });
        
        // ← Log adicional para items eliminados
        if (updateData.deletedItemIds && updateData.deletedItemIds.length > 0) {
          console.log('🗑️ ITEMS TO DELETE BEING SENT TO BACKEND:', updateData.deletedItemIds);
        }

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
              updatedChecklistInState.items.forEach((item: any, index: number) => {
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
          instructorSignature: JSON.stringify({}),
          studySheets: checklistData.studySheets || null,
          trainingProjectId: checklistData.trainingProjectId || null,
          evaluations: null,
          associatedJuries: null,
          items: checklistData.items ? transformItems(checklistData.items) : []
        };

        const result = await dispatch(addChecklist(newChecklistData)).unwrap();
        console.log("Create result:", result); // Debug log

        if (result && result.code === "200") {
          const newChecklistId = result.id;
          console.log("✅ Checklist created successfully with ID:", newChecklistId); // Debug log

          if (newChecklistId) {
            // Crear automáticamente una evaluación para esta lista de chequeo usando Redux
            try {
              const evaluationInput = {
                observations: "", // Valores vacíos iniciales
                recommendations: "", // El instructor los completará después
                valueJudgment: "PENDIENTE", // Estado inicial
                checklistId: parseInt(newChecklistId) // Asegurar que es un número entero
              };

              console.log('=== CREATING AUTOMATIC EVALUATION ===');
              console.log('📝 New Checklist ID:', newChecklistId, '(Type:', typeof newChecklistId, ')');
              console.log('🔢 Parsed Checklist ID:', parseInt(newChecklistId), '(Type:', typeof parseInt(newChecklistId), ')');
              console.log('📋 Evaluation Input:', evaluationInput);
              console.log('🔗 This will create a 1:1 relationship in the database');

              const evaluationResponse = await dispatch(addEvaluation(evaluationInput)).unwrap();
              console.log("🎯 Evaluation creation response:", evaluationResponse);

              if (evaluationResponse && evaluationResponse.code === "200") {
                console.log("✅ SUCCESS: Evaluation created with ID:", evaluationResponse.id);
                console.log("🔗 SUCCESS: Evaluation linked to Checklist ID:", newChecklistId);
                console.log("📊 Database now has: Checklist", newChecklistId, "↔ Evaluation", evaluationResponse.id);
                
                // Verificar que la relación se estableció correctamente
                try {
                  const { verifyChecklistEvaluationLink } = await import('@services/checkListService');
                  console.log("🔍 Verifying the database relationship...");
                  
                  // Pequeña pausa para que la DB se actualice
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  const isLinked = await verifyChecklistEvaluationLink(parseInt(newChecklistId));
                  
                  if (isLinked) {
                    console.log("✅ VERIFICATION SUCCESS: Relationship confirmed in database");
                    toast.success("🎉 Lista de chequeo creada exitosamente")
                    toast.success("✅ Evaluación asociada creada y vinculada correctamente")
                  } else {
                    console.log("⚠️ VERIFICATION WARNING: Evaluation created but relationship not confirmed");
                    toast.success("Lista de chequeo creada exitosamente")
                    toast.warning("⚠️ Evaluación creada pero la verificación de vínculo falló")
                  }
                } catch (verificationError) {
                  console.warn("⚠️ Could not verify relationship:", verificationError);
                  toast.success("🎉 Lista de chequeo creada exitosamente")
                  toast.success("✅ Evaluación asociada creada automáticamente")
                }
                
                // Pequeña pausa para mostrar ambos toasts
                await new Promise(resolve => setTimeout(resolve, 1000));
                
              } else {
                console.log("❌ PARTIAL SUCCESS: Checklist created but evaluation failed:", evaluationResponse);
                toast.success("Lista de chequeo creada exitosamente")
                toast.warning("⚠️ Evaluación no pudo crearse automáticamente: " + (evaluationResponse?.message || "Error desconocido"))
              }
            } catch (evaluationError: any) {
              console.error("❌ ERROR creating evaluation:", evaluationError);
              console.error("Error details:", {
                message: evaluationError.message,
                stack: evaluationError.stack,
                graphQLErrors: evaluationError.graphQLErrors,
                networkError: evaluationError.networkError
              });
              
              toast.success("Lista de chequeo creada exitosamente")
              toast.error("❌ Error al crear la evaluación automática: " + (evaluationError.message || "Error desconocido"))
            }
          } else {
            console.warn("⚠️ WARNING: Checklist created but ID not returned:", result);
            toast.success("Lista de chequeo creada exitosamente")
            toast.warning("⚠️ No se pudo crear la evaluación automáticamente (ID no disponible)")
          }

          // Recargar la lista para mostrar el nuevo checklist
          console.log("🔄 Reloading checklists to show new data...");
          await loadChecklists()
          setModalOpen(false)
          console.log("✅ Creation process completed");
        } else {
          console.log("❌ FAILED: Checklist creation failed:", result);
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

  // Función auxiliar para formatear las fichas
  const getFormattedStudySheets = (studySheets: string): string => {
    if (!studySheets) return 'Sin fichas asociadas'
    
    const sheetIds = studySheets.split(',')
    if (sheetIds.length === 1) {
      return `Ficha ${sheetIds[0]}`
    }
    return `${sheetIds.length} fichas asociadas`
  }

  // Usar checklists enriquecidos si están disponibles, sino usar los datos de Redux
  const checklistsToUse = enrichedChecklists.length > 0 ? enrichedChecklists : checklists;
  
  // Normalizar id a string para evitar exclusión por tipo
  const normalizedChecklists = checklistsToUse.map(c => ({
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
            className="px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-full focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
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
          className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-6 py-3 rounded-full hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          + Crear Lista de Chequeo
        </button>
      </div>

      {(loading || enrichmentLoading) ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 dark:border-shadowBlue"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {enrichmentLoading ? "Cargando información de proyectos y fichas..." : "Cargando listas de chequeo..."}
          </span>
        </div>
      ) : (
        <div className="mt-6 overflow-visible">
          {filteredChecklists.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {selectedTrimestre === "todos"
                    ? "No hay listas de chequeo disponibles"
                    : `No hay listas de chequeo para el trimestre ${selectedTrimestre}`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pb-8 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {filteredChecklists.map((checklist) => {
                  // Debug log para cada checklist en el render
                  console.log(`Rendering checklist ${checklist.id}:`, checklist);
                  console.log(`Checklist ${checklist.id} items:`, checklist.items);

                  // Verificación de seguridad adicional
                  if (!checklist || !checklist.id) {
                    console.error("Attempting to render invalid checklist:", checklist);
                    return null; // No renderizar checklist inválido
                  }

                  return (
                    <div
                      key={`checklist-${checklist.id}`}
                      className="group relative transform transition-all duration-300 hover:scale-105 hover:z-10"
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-2xl hover:shadow-lime-200 dark:hover:shadow-shadowBlue/30 overflow-hidden">
                        {/* Header de la tarjeta */}
                        <div className="bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-white">
                                {checklist.trimester ? `${checklist.trimester}° Trimestre` : 'No especificado'}
                              </h3>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(checklist)}
                                className="text-white hover:text-yellow-300 transition-colors p-2 rounded-full hover:bg-white/10"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenConfirmModal(checklist.id)}
                                className="text-white hover:text-red-300 transition-colors p-2 rounded-full hover:bg-white/10"
                                title="Eliminar"
                              >
                                <FaTrashAlt className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="p-6 space-y-4">
                          {/* Proyecto Formativo */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-blue-400 uppercase tracking-wide">
                              Proyecto Formativo
                            </span>
                            <p className="text-sm text-darkBlue dark:text-white mt-1 font-medium">
                              {(checklist as any).trainingProjectName || (
                                <span className="text-gray-500 italic">Sin proyecto asociado</span>
                              )}
                            </p>
                          </div>

                          {/* Componente */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-blue-400 uppercase tracking-wide">
                              Componente
                            </span>
                            <p className="text-sm text-darkBlue dark:text-white mt-1 font-medium">
                              {checklist.component || 'N/A'}
                            </p>
                          </div>

                          {/* Fichas asociadas */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-blue-400 uppercase tracking-wide">
                              Fichas Asociadas
                            </span>
                            <div className="mt-1">
                              {(checklist as any).studySheets ? (
                                (checklist as any).formattedStudySheets ? (
                                  <div className="text-xs text-darkBlue dark:text-white">
                                    {(checklist as any).formattedStudySheets}
                                  </div>
                                ) : (
                                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/20 dark:to-blue-600/20 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-300 dark:border-blue-500/30">
                                    {getFormattedStudySheets((checklist as any).studySheets)}
                                  </span>
                                )
                              ) : (
                                <span className="text-gray-500 italic text-sm">Sin fichas asociadas</span>
                              )}
                            </div>
                          </div>

                          {/* Indicadores */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-blue-400 uppercase tracking-wide">
                              Indicadores
                            </span>
                            <div className="mt-1">
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-lime-100 to-lime-200 dark:from-shadowBlue/20 dark:to-darkBlue/20 text-lime-800 dark:text-blue-300 rounded-full text-xs font-bold border border-lime-300 dark:border-shadowBlue/30">
                                {checklist.items ? checklist.items.length : 0} indicadores
                              </span>
                            </div>
                          </div>

                          {/* Estado */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-blue-400 uppercase tracking-wide">
                              Estado
                            </span>
                            <div className="mt-2 flex items-center">
                              <button
                                onClick={() => handleToggleState(checklist.id, checklist.state)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${checklist.state
                                  ? 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-blue-600 dark:to-blue-500 focus:ring-lime-500 dark:focus:ring-blue-500'
                                  : 'bg-gray-200 dark:bg-gray-600 focus:ring-gray-500'
                                  }`}
                                title={checklist.state ? 'Desactivar lista' : 'Activar lista'}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-lg ${checklist.state ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                              <span className={`ml-3 text-xs font-bold ${checklist.state
                                ? 'text-lime-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {checklist.state ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </div>

                          {/* Observaciones */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-blue-400 uppercase tracking-wide">
                              Competencia
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                              {checklist.remarks || 'Sin observaciones'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
