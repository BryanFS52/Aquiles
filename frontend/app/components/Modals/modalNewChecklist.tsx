'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { checkListService } from '@redux/slices/checklistSlice'
import { trainingProjectService } from '@redux/slices/olympo/trainingProjectSlice'
import { studySheetService } from '@redux/slices/olympo/studySheetSlice'

interface ChecklistItem {
  id?: string
  code?: string
  indicator: string
  active?: boolean
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

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (checklistData: any) => Promise<void>
  editingData?: Checklist | null
  isEditing?: boolean
}

export default function CrearListaChequeo({ isOpen, onClose, onCreate, editingData = null, isEditing = false }: ModalProps) {
  const [trimestre, setTrimestre] = useState<string>('')
  const [componente, setComponente] = useState<string>('')
  const [observaciones, setObservaciones] = useState<string>('')
  const [items, setItems] = useState<{ indicador: string }[]>([{ indicador: '' }])
  const [isModalOpen, setIsOpen] = useState<boolean>(false)
  
  // Estados para proyectos formativos y fichas
  const [selectedTrainingProject, setSelectedTrainingProject] = useState<string>('')
  const [selectedStudySheets, setSelectedStudySheets] = useState<string[]>([])
  const [trainingProjects, setTrainingProjects] = useState<any[]>([])
  const [studySheets, setStudySheets] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false)
  const [loadingSheets, setLoadingSheets] = useState<boolean>(false)

  // Cargar proyectos formativos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadTrainingProjects()
    }
  }, [isOpen])

  // Cargar fichas cuando se selecciona un proyecto formativo
  useEffect(() => {
    if (selectedTrainingProject) {
      loadStudySheets(selectedTrainingProject)
    } else {
      setStudySheets([])
      setSelectedStudySheets([])
    }
  }, [selectedTrainingProject])

  const loadTrainingProjects = async () => {
    setLoadingProjects(true)
    try {
      const response = await trainingProjectService.getAllTrainingProjects({ size: 100 })
      setTrainingProjects(response.data || [])
    } catch (error) {
      console.error('Error loading training projects:', error)
      toast.error('Error al cargar los proyectos formativos')
    } finally {
      setLoadingProjects(false)
    }
  }

  const loadStudySheets = async (trainingProjectId: string) => {
    setLoadingSheets(true)
    try {
      const response = await studySheetService.getStudySheetsByTrainingProject({ 
        idTrainingProject: parseInt(trainingProjectId),
        size: 100
      })
      setStudySheets(response.data || [])
    } catch (error) {
      console.error('Error loading study sheets:', error)
      toast.error('Error al cargar las fichas de formación')
    } finally {
      setLoadingSheets(false)
    }
  }

  // Efecto para cargar datos de edición
  useEffect(() => {
    if (isOpen && isEditing && editingData) {
      console.log("Modal received editingData:", editingData) // Debug log
      console.log("Modal editingData type:", typeof editingData) // Debug log
      
      // Cargar datos existentes para edición
      setTrimestre(editingData.trimester?.toString() || '')
      setComponente(editingData.component || '')
      setObservaciones(editingData.remarks || '')
      
      // Cargar datos de proyecto formativo y fichas si existen
      setSelectedTrainingProject(editingData.trainingProjectId?.toString() || '')
      setSelectedStudySheets(editingData.studySheets ? editingData.studySheets.split(',') : [])
      
      console.log("Loading items from editingData:", editingData.items) // Debug log
      
      // Cargar indicadores existentes si están disponibles
      if (editingData.items && editingData.items.length > 0) {
        const loadedItems = editingData.items.map(item => ({
          indicador: item.indicator || ''
        }))
        console.log("Mapped items for modal:", loadedItems) // Debug log
        setItems(loadedItems)
      } else {
        console.log("No items found, setting default item") // Debug log
        setItems([{ indicador: '' }])
      }
    } else {
      // Limpiar formulario para nueva creación
      setTrimestre('')
      setComponente('')
      setObservaciones('')
      setItems([{ indicador: '' }])
      setSelectedTrainingProject('')
      setSelectedStudySheets([])
    }
  }, [isEditing, editingData, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validaciones básicas
    if (!trimestre || !componente || items.some(i => !i.indicador)) {
      toast.error('Por favor, complete todos los campos obligatorios.')
      return
    }

    // Validación: Si hay un proyecto formativo seleccionado, debe tener al menos una ficha
    if (selectedTrainingProject && selectedStudySheets.length === 0) {
      toast.error('Debe seleccionar al menos una ficha de formación para el proyecto formativo seleccionado.')
      return
    }

    try {
      const newChecklist = {
        state: false,
        remarks: observaciones || "Sin observaciones",
        trimester: trimestre,
        instructorSignature: JSON.stringify({}),
        evaluationCriteria: false,
        studySheets: selectedStudySheets.length > 0 ? selectedStudySheets.join(',') : null,
        trainingProjectId: selectedTrainingProject ? parseInt(selectedTrainingProject) : null,
        evaluations: null,
        associatedJuries: null,
        component: componente,
        items: items.map((item, index) => ({
          code: `IND-${index + 1}`,
          indicator: item.indicador,
          active: true
        }))
      }

      console.log('Modal submitting checklist data:', newChecklist); // Debug log
      console.log('Is editing mode:', isEditing); // Debug log

      await onCreate(newChecklist)
    } catch (error) {
      console.error('Error in modal:', error)
      toast.error(isEditing ? 'Error al actualizar la lista de chequeo' : 'Error al crear la lista de chequeo')
    }
  }

  const handleIndicadorChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index].indicador = value
    setItems(newItems)
  }

  const handleAddIndicador = () => {
    setItems([...items, { indicador: '' }])
  }

  const handleRemoveIndicador = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleTrainingProjectChange = (value: string) => {
    setSelectedTrainingProject(value)
    setSelectedStudySheets([]) // Limpiar fichas seleccionadas
  }

  const handleStudySheetChange = (sheetId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudySheets(prev => [...prev, sheetId])
    } else {
      setSelectedStudySheets(prev => prev.filter(id => id !== sheetId))
    }
  }

  const resetForm = () => {
    setTrimestre('')
    setComponente('')
    setObservaciones('')
    setItems([{ indicador: '' }])
    setSelectedTrainingProject('')
    setSelectedStudySheets([])
  }

  if (isOpen !== undefined) {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Editar Lista de Chequeo' : 'Crear Lista de Chequeo'}
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm flex items-start space-x-2">
              <span className="text-green-600 font-bold">✅</span>
              <span>
                <strong>Nuevo:</strong> Al crear esta lista de chequeo, se generará automáticamente una evaluación asociada en la base de datos. 
                Esta evaluación estará disponible para que el instructor la complete con observaciones, recomendaciones y juicio de valor.
              </span>
            </p>
            <div className="mt-2 text-xs text-blue-600">
              <strong>Relación:</strong> Lista de Chequeo ↔ Evaluación (1:1)
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="trimestre" className="block text-sm font-medium text-gray-700">Trimestre</label>
                <select
                  id="trimestre"
                  value={trimestre}
                  onChange={(e) => setTrimestre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d]"
                >
                  <option value="">Selecciona un trimestre</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{`${i + 1}° Trimestre`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="componente" className="block text-sm font-medium text-gray-700">Componente</label>
                <select
                  id="componente"
                  value={componente}
                  onChange={(e) => setComponente(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d]"
                >
                  <option value="">Selecciona un componente</option>
                  <option value="academico">Académico</option>
                  <option value="actitudinal">Actitudinal</option>
                </select>
              </div>
              <div>
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Competencia</label>
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Describe la competencia asociada a esta lista de chequeo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] h-24 resize-none"
                />
              </div>

              {/* Selector de Proyecto Formativo */}
              <div>
                <label htmlFor="trainingProject" className="block text-sm font-medium text-gray-700">
                  Proyecto Formativo
                </label>
                <select
                  id="trainingProject"
                  value={selectedTrainingProject}
                  onChange={(e) => handleTrainingProjectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d]"
                  disabled={loadingProjects}
                >
                  <option value="">Selecciona un proyecto formativo</option>
                  {trainingProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.program?.name || 'Sin programa'}
                    </option>
                  ))}
                </select>
                {trainingProjects.length === 0 && !loadingProjects && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ No hay proyectos formativos disponibles
                  </p>
                )}
                {loadingProjects && (
                  <p className="text-sm text-gray-500 mt-1">Cargando proyectos formativos...</p>
                )}
              </div>

              {/* Selector de Fichas de Formación */}
              {selectedTrainingProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichas de Formación Asociadas <span className="text-red-500">*</span>
                  </label>
                  {loadingSheets ? (
                    <p className="text-sm text-gray-500">Cargando fichas...</p>
                  ) : studySheets.length > 0 ? (
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                      {studySheets.map((sheet) => (
                        <label key={sheet.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedStudySheets.includes(sheet.id.toString())}
                            onChange={(e) => handleStudySheetChange(sheet.id.toString(), e.target.checked)}
                            className="h-4 w-4 text-[#00324d] focus:ring-[#00324d] border-gray-300 rounded"
                          />
                          <span className="text-sm">
                            Ficha {sheet.number} - {sheet.journey?.name} ({sheet.numberStudents} estudiantes)
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay fichas disponibles para este proyecto formativo</p>
                  )}
                  {studySheets.length > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      <strong>Nota:</strong> Debe seleccionar al menos una ficha para continuar.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex space-x-4 items-start">
                  <textarea
                    value={item.indicador}
                    onChange={(e) => handleIndicadorChange(index, e.target.value)}
                    placeholder={`Indicador ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] h-24 resize-none"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIndicador(index)}
                      className="text-red-500 mt-2 flex-shrink-0"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIndicador}
                className="text-[#00324d] hover:text-[#40b003] transition-colors"
              >
                Agregar Indicador
              </button>
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-[#00324d] text-white py-2 rounded hover:bg-[#40b003] transition-colors"
              >
                {isEditing ? 'Actualizar Lista de Chequeo' : 'Crear Lista de Chequeo'}
              </button>
            </div>

          </form>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 underline mt-4"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  // Versión inicial: botón para abrir modal
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#00324d] text-white px-4 py-2 rounded hover:bg-[#40b003] transition-colors"
      >
        Crear Lista de Chequeo
      </button>
    </div>
  )
}
