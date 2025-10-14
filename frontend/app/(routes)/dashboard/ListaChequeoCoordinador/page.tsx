'use client'

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { client, clientLAN } from '@lib/apollo-client'
import { useQuery, useMutation } from '@apollo/client'
import { FaTrashAlt, FaEdit, FaChevronDown, FaGraduationCap } from "react-icons/fa"
import {
  GET_ALL_CHECKLISTS_COORDINATOR,
  ADD_CHECKLIST,
  UPDATE_CHECKLIST,
  DELETE_CHECKLIST
} from '@graphql/checklistGraph'
import { ADD_EVALUATION } from '@graphql/evaluationsGraph'
import { GET_ALL_TRAINING_PROJECTS } from '@graphql/olympo/trainingProjectGraph'
import { GET_STUDY_SHEETS } from '@graphql/olympo/studySheetGraph'
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"

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
  // Apollo: obtener checklists
  const { data, loading, error, refetch } = useQuery(GET_ALL_CHECKLISTS_COORDINATOR, {
    variables: { page: 0, size: 100 },
    client,
    fetchPolicy: 'network-only',
  })
  
  // Cargar proyectos formativos para hacer lookup del nombre
  const { data: trainingProjectsData, loading: loadingProjects, error: errorProjects } = useQuery(GET_ALL_TRAINING_PROJECTS, {
    variables: { page: 0, size: 100 },
    client: clientLAN, // Usar clientLAN para el microservicio Olympo
    fetchPolicy: 'network-only',
  })

  // Cargar fichas de formación para hacer lookup de nombres
  const { data: studySheetsData, loading: loadingSheets, error: errorSheets } = useQuery(GET_STUDY_SHEETS, {
    variables: { page: 0, size: 100 },
    client: clientLAN, // Usar clientLAN para el microservicio Olympo
    fetchPolicy: 'network-only',
  })
  
  // Debug: ver qué datos están llegando
  useEffect(() => {
    console.log('=== DEBUG TRAINING PROJECTS ===');
    console.log('trainingProjectsData:', trainingProjectsData);
    console.log('loadingProjects:', loadingProjects);
    console.log('errorProjects:', errorProjects);
    if (trainingProjectsData?.allTrainingProjects?.data) {
      console.log('Projects found:', trainingProjectsData.allTrainingProjects.data.length);
      console.log('First project:', trainingProjectsData.allTrainingProjects.data[0]);
    }
    if (errorProjects) {
      console.error('❌ Error loading training projects:', errorProjects);
      // Verificar si es un error de conexión
      if (errorProjects.message?.includes('Failed to fetch') || errorProjects.networkError) {
        console.error('Network error with clientLAN. Check if server is running on correct port.');
      }
    }
  }, [trainingProjectsData, loadingProjects, errorProjects])

  // Debug: ver qué datos de fichas están llegando
  useEffect(() => {
    console.log('=== DEBUG STUDY SHEETS ===');
    console.log('studySheetsData:', studySheetsData);
    console.log('loadingSheets:', loadingSheets);
    console.log('errorSheets:', errorSheets);
    if (studySheetsData?.allStudySheets?.data) {
      console.log('Study sheets found:', studySheetsData.allStudySheets.data.length);
      console.log('First study sheet:', studySheetsData.allStudySheets.data[0]);
    }
    if (errorSheets) {
      console.error('❌ Error loading study sheets:', errorSheets);
    }
  }, [studySheetsData, loadingSheets, errorSheets])
  
  const [addChecklistMutation] = useMutation(ADD_CHECKLIST, { client })
  const [updateChecklistMutation] = useMutation(UPDATE_CHECKLIST, { client })
  const [deleteChecklistMutation] = useMutation(DELETE_CHECKLIST, { client })
  const [addEvaluationMutation] = useMutation(ADD_EVALUATION, { client })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("todos")
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [checklistToDelete, setChecklistToDelete] = useState<string | null>(null)
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [expandedStudySheets, setExpandedStudySheets] = useState<string | null>(null)

  // Función para obtener el nombre del proyecto formativo
  const getTrainingProjectName = useCallback((trainingProjectId: string | number | null | undefined): string => {
    console.log('=== DEBUG getTrainingProjectName ===');
    console.log('trainingProjectId:', trainingProjectId, 'Type:', typeof trainingProjectId);
    console.log('trainingProjectsData available:', !!trainingProjectsData?.allTrainingProjects?.data);
    console.log('Number of projects loaded:', trainingProjectsData?.allTrainingProjects?.data?.length || 0);
    
    if (!trainingProjectId || !trainingProjectsData?.allTrainingProjects?.data) {
      console.log('Returning default: Sin proyecto asociado');
      return 'Sin proyecto asociado'
    }
    
    const project = trainingProjectsData.allTrainingProjects.data.find(
      (p: any) => p?.id?.toString() === trainingProjectId.toString()
    )
    
    console.log('Found project:', project);
    console.log('Project name:', project?.name || 'Proyecto no encontrado');
    console.log('All available project IDs:', trainingProjectsData.allTrainingProjects.data.map((p: any) => p?.id));
    
    return project?.name || 'Proyecto no encontrado'
  }, [trainingProjectsData])

  // Función para obtener la información detallada de las fichas
  const getStudySheetDetails = useCallback((studySheetIds: string): { sheets: any[], summary: string } => {
    if (!studySheetIds || !studySheetsData?.allStudySheets?.data) {
      return { sheets: [], summary: 'Sin fichas asociadas' }
    }
    
    const sheetIds = studySheetIds.split(',').map(id => id.trim()).filter(id => id)
    if (sheetIds.length === 0) {
      return { sheets: [], summary: 'Sin fichas asociadas' }
    }
    
    const foundSheets = sheetIds.map(id => {
      const sheet = studySheetsData.allStudySheets.data.find(
        (s: any) => s?.id?.toString() === id.toString()
      )
      return sheet ? {
        id: sheet.id,
        number: sheet.number || id,
        name: sheet.program?.name || 'Programa no especificado',
        found: true
      } : {
        id,
        number: id,
        name: 'Ficha no encontrada en el sistema',
        found: false
      }
    })
    
    const validSheets = foundSheets.filter(sheet => sheet.found)
    const invalidCount = foundSheets.length - validSheets.length
    
    let summary = ''
    if (foundSheets.length === 1) {
      summary = validSheets.length === 1 ? `Ficha ${foundSheets[0].number}` : `Ficha ${foundSheets[0].number} (no encontrada)`
    } else {
      const validText = validSheets.length > 0 ? `${validSheets.length} fichas` : ''
      const invalidText = invalidCount > 0 ? `${invalidCount} no encontradas` : ''
      
      if (validText && invalidText) {
        summary = `${validText} (${invalidText})`
      } else if (validText) {
        summary = `${validText} asociadas`
      } else {
        summary = `${foundSheets.length} fichas no encontradas`
      }
    }
    
    return { sheets: foundSheets, summary }
  }, [studySheetsData])

  // Normalizar checklists desde Apollo
  const checklists: Checklist[] = data?.allChecklists?.data || []
  
  // Debug: ver los datos de los checklists
  useEffect(() => {
    console.log('=== DEBUG CHECKLISTS ===');
    console.log('Raw data:', data);
    console.log('Checklists:', checklists);
    if (checklists.length > 0) {
      console.log('First checklist:', checklists[0]);
      console.log('First checklist trainingProjectId:', (checklists[0] as any).trainingProjectId);
      console.log('All checklist trainingProjectIds:', checklists.map(c => ({ id: c.id, trainingProjectId: (c as any).trainingProjectId })));
    }
  }, [data, checklists])
  // Filtrar y ordenar checklists
  const filteredChecklists: Checklist[] = checklists
    .filter((checklist: Checklist) => {
      // Filtrar checklists inválidos
      if (!checklist || checklist.id == null || checklist.id === '') {
        return false;
      }

      if (selectedTrimestre === "todos") {
        return true; // Mostrar todos los checklists válidos
      }
      return !checklist.trimester || checklist.trimester === selectedTrimestre;
    })
    .sort((a: Checklist, b: Checklist) => parseInt(b.id) - parseInt(a.id)) // Ordenar por ID descendente (más recientes primero)

  const transformItems = (items: ChecklistItem[]) => {
    return items.map((item: ChecklistItem, index: number) => ({
      ...(item.id && { id: item.id }), // ← Preservar ID si existe
      code: item.code || `IND-${index + 1}`,
      indicator: item.indicator,
      active: item.active !== undefined ? item.active : true
    }));
  };

  const handleCreateChecklist = async (checklistData: ChecklistData): Promise<any> => {
    try {
      if (isEditing && editingChecklist) {
        // Actualizar checklist existente
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
          ...(checklistData.deletedItemIds && checklistData.deletedItemIds.length > 0 && {
            deletedItemIds: checklistData.deletedItemIds
          })
        }
        const { data: result } = await updateChecklistMutation({
          variables: { id: parseInt(editingChecklist.id), input: updateData }
        })
        if (result?.updateChecklist?.code === "200") {
          toast.success("Lista de chequeo actualizada exitosamente")
          await refetch()
          handleCloseModal()
          return { id: editingChecklist.id, success: true }
        } else {
          toast.error(result?.updateChecklist?.message || "Error al actualizar la lista de chequeo")
          return { success: false }
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
        }
        
        console.log("🚀 Attempting to create checklist with data:", newChecklistData);
        console.log("🔗 Using client:", client);
        
        const { data: result } = await addChecklistMutation({
          variables: { input: newChecklistData }
        })
        if (result?.addChecklist?.code === "200") {
          toast.success("Lista de chequeo creada exitosamente")
          
          // NOTA: No creamos evaluación automática aquí porque las evaluaciones
          // deben estar asociadas a un team scrum específico. Se crearán cuando
          // el instructor seleccione un team scrum.
          console.log("✅ Lista de chequeo creada con ID:", result?.addChecklist?.id)
          
          await refetch()
          setModalOpen(false)
          return { id: result?.addChecklist?.id, success: true }
        } else {
          toast.error(result?.addChecklist?.message || "Error al crear la lista de chequeo")
          return { success: false }
        }
      }
    } catch (error: any) {
      console.error("❌ Error with checklist operation:", error)
      
      // Manejo específico de errores de red
      if (error.message?.includes('Failed to fetch') || error.networkError) {
        toast.error("❌ Error de conexión: No se puede conectar al servidor. Verifique que el backend esté ejecutándose.")
        console.error("Network error details:", error.networkError || error)
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0]
        toast.error(`❌ Error GraphQL: ${graphQLError.message}`)
        console.error("GraphQL error details:", graphQLError)
      } else {
        toast.error(isEditing ? "❌ Error al actualizar la lista de chequeo" : "❌ Error al crear la lista de chequeo")
      }
      
      return { success: false }
    }
  }

  const handleDeleteChecklist = async (): Promise<void> => {
    if (!checklistToDelete) return
    try {
      const { data: result } = await deleteChecklistMutation({
        variables: { id: parseInt(checklistToDelete) }
      })
      if (result?.deleteChecklist?.code === "200") {
        toast.success("Lista de chequeo eliminada exitosamente")
        await refetch()
      } else {
        toast.error(result?.deleteChecklist?.message || "Error al eliminar la lista de chequeo")
      }
    } catch (error: any) {
      console.error("Error deleting checklist:", error)
      toast.error("Error al eliminar la lista de chequeo")
    } finally {
      setConfirmModalOpen(false)
      setChecklistToDelete(null)
    }
  }

  // Cambiar estado usando updateChecklistMutation
  const handleToggleState = async (checklistId: string, currentState: boolean | null | undefined): Promise<void> => {
    try {
      const checklist = checklists.find((c) => c.id === checklistId)
      if (!checklist) return
      const updateData = {
        ...checklist,
        state: !currentState
      }
      const { data: result } = await updateChecklistMutation({
        variables: { id: parseInt(checklistId), input: updateData }
      })
      if (result?.updateChecklist?.code === "200") {
        toast.success(`Lista de chequeo ${!currentState ? 'activada' : 'desactivada'} exitosamente`)
        await refetch()
      } else {
        toast.error(result?.updateChecklist?.message || "Error al actualizar el estado de la lista de chequeo")
      }
    } catch (error: any) {
      console.error("Error updating checklist state:", error)
      toast.error("Error al actualizar el estado de la lista de chequeo")
    }
  }

  // Editar checklist: solo setea el checklist seleccionado
  const handleOpenEditModal = async (checklist: Checklist): Promise<void> => {
    setIsEditing(true)
    setEditingChecklist(checklist)
    setModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setModalOpen(false)
    setIsEditing(false)
    setEditingChecklist(null)
  }

  const handleOpenCreateModal = (): void => {
    setIsEditing(false)
    setEditingChecklist(null)
    setModalOpen(true)
  }

  const handleOpenConfirmModal = (checklistId: string): void => {
    setChecklistToDelete(checklistId)
    setConfirmModalOpen(true)
  }

  // Función para toggle del desplegable de fichas
  const toggleStudySheetExpansion = (checklistId: string): void => {
    setExpandedStudySheets(expandedStudySheets === checklistId ? null : checklistId)
  }

  // Cerrar desplegables cuando se abre un modal
  useEffect(() => {
    if (modalOpen || confirmModalOpen) {
      setExpandedStudySheets(null)
    }
  }, [modalOpen, confirmModalOpen])

  // Función auxiliar para formatear las fichas (mantenida para compatibilidad)
  const getFormattedStudySheets = (studySheets: string): string => {
    if (!studySheets) return 'Sin fichas asociadas'
    
    const sheetIds = studySheets.split(',')
    if (sheetIds.length === 1) {
      return `Ficha ${sheetIds[0]}`
    }
    return `${sheetIds.length} fichas asociadas`
  }

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
          className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-6 py-3 rounded-full hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          + Crear Lista de Chequeo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 dark:border-shadowBlue"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Cargando listas de chequeo...
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
                  // Rendering checklist card

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
                            <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                              Proyecto Formativo
                            </span>
                            <p className="text-sm text-gray-700 dark:text-white mt-1 font-medium">
                              {getTrainingProjectName((checklist as any).trainingProjectId)}
                            </p>
                          </div>

                          {/* Componente */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                              Componente
                            </span>
                            <p className="text-sm text-gray-700 dark:text-white mt-1 font-medium">
                              {checklist.component || 'N/A'}
                            </p>
                          </div>

                          {/* Fichas asociadas */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                              Fichas Asociadas
                            </span>
                            <div className="mt-1">
                              {(checklist as any).studySheets ? (() => {
                                const studySheetDetails = getStudySheetDetails((checklist as any).studySheets);
                                const isExpanded = expandedStudySheets === checklist.id;
                                
                                return (
                                  <div className="space-y-2">
                                    {/* Botón principal con resumen */}
                                    <button
                                      onClick={() => toggleStudySheetExpansion(checklist.id)}
                                      className="inline-flex items-center justify-between w-full px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/20 dark:to-blue-600/20 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-300 dark:border-blue-500/30 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700/30 dark:hover:to-blue-500/30 transition-all duration-200"
                                    >
                                      <span>{studySheetDetails.summary}</span>
                                      <FaChevronDown 
                                        className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                      />
                                    </button>
                                    
                                    {/* Lista desplegable de fichas */}
                                    {isExpanded && studySheetDetails.sheets.length > 0 && (
                                      <div className="bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-600 rounded-lg shadow-lg overflow-hidden animate-slide-down">
                                        {studySheetDetails.sheets.map((sheet, index) => (
                                          <div 
                                            key={sheet.id}
                                            className={`px-3 py-3 text-xs border-b border-blue-100 dark:border-blue-700 last:border-b-0 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-150 ${
                                              sheet.found 
                                                ? (index % 2 === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-700')
                                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                                            }`}
                                          >
                                            <div className="flex items-center space-x-2">
                                              <FaGraduationCap 
                                                className={`w-3 h-3 flex-shrink-0 ${
                                                  sheet.found 
                                                    ? 'text-blue-600 dark:text-blue-400' 
                                                    : 'text-red-500 dark:text-red-400'
                                                }`} 
                                              />
                                              <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                  <span className={`font-semibold truncate ${
                                                    sheet.found 
                                                      ? 'text-blue-800 dark:text-blue-300'
                                                      : 'text-red-700 dark:text-red-300'
                                                  }`}>
                                                    Ficha {sheet.number}
                                                  </span>
                                                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                                                    ID: {sheet.id}
                                                  </span>
                                                </div>
                                                <div className={`mt-1 text-xs truncate ${
                                                  sheet.found 
                                                    ? 'text-gray-700 dark:text-gray-300'
                                                    : 'text-red-600 dark:text-red-400 italic'
                                                }`}>
                                                  {sheet.name}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })() : (
                                <span className="text-gray-500 italic text-sm">Sin fichas asociadas</span>
                              )}
                            </div>
                          </div>

                          {/* Indicadores */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                              Indicadores
                            </span>
                            <div className="mt-1">
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-lime-100 to-lime-200 dark:from-shadowBlue/20 dark:to-darkBlue/20 text-lime-800 dark:text-gray-300 rounded-full text-xs font-bold border border-lime-300 dark:border-shadowBlue/30">
                                {checklist.items ? checklist.items.length : 0} indicadores
                              </span>
                            </div>
                          </div>

                          {/* Estado */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
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
                                ? 'text-lime-600 dark:text-gray-300'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {checklist.state ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </div>

                          {/* Observaciones */}
                          <div>
                            <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
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
        editingData={editingChecklist as any}
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
