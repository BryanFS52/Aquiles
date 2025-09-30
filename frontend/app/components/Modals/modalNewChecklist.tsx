'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@redux/store'
import { fetchAllTrainingProjects } from '@redux/slices/olympo/trainingProjectSlice'
import { fetchStudySheetsByTrainingProject } from '@redux/slices/olympo/studySheetSlice'

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
  const dispatch = useDispatch<AppDispatch>()
  const [trimestre, setTrimestre] = useState<string>('')
  const [componente, setComponente] = useState<string>('')
  const [observaciones, setObservaciones] = useState<string>('')
  const [items, setItems] = useState<{ id?: string; indicador: string }[]>([{ indicador: '' }])
  const [deletedItemIds, setDeletedItemIds] = useState<number[]>([])

  // Estados para proyectos formativos y fichas
  const [selectedTrainingProject, setSelectedTrainingProject] = useState<string>('')
  const [selectedStudySheets, setSelectedStudySheets] = useState<string[]>([])

  // Redux selectors
  const trainingProjects = useSelector((state: RootState) => state.trainingProject.data)
  const loadingProjects = useSelector((state: RootState) => state.trainingProject.loading)
  const studySheets = useSelector((state: RootState) => state.studySheet.data)
  const loadingSheets = useSelector((state: RootState) => state.studySheet.loading)

  // Cargar proyectos formativos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllTrainingProjects({ size: 100 }))
    }
  }, [isOpen, dispatch])

  // Cargar fichas cuando se selecciona un proyecto formativo
  useEffect(() => {
    if (selectedTrainingProject) {
      dispatch(fetchStudySheetsByTrainingProject({ trainingProjectId: parseInt(selectedTrainingProject), size: 100 }))
    } else {
      setSelectedStudySheets([])
    }
  }, [selectedTrainingProject, dispatch])

  // Efecto para cargar datos de edición
  useEffect(() => {
    if (isOpen && isEditing && editingData) {
      setTrimestre(editingData.trimester?.toString() || '')
      setComponente(editingData.component || '')
      setObservaciones(editingData.remarks || '')
      setDeletedItemIds([])
      setSelectedTrainingProject(editingData.trainingProjectId?.toString() || '')
      setSelectedStudySheets(editingData.studySheets ? editingData.studySheets.split(',') : [])
      if (editingData.items && editingData.items.length > 0) {
        const loadedItems = editingData.items.map(item => ({
          id: item.id?.toString(),
          indicador: item.indicator || ''
        }))
        setItems(loadedItems)
      } else {
        setItems([{ indicador: '' }])
      }
    } else if (isOpen && !isEditing) {
      setTrimestre('')
      setComponente('')
      setObservaciones('')
      setItems([{ indicador: '' }])
      setDeletedItemIds([])
      setSelectedTrainingProject('')
      setSelectedStudySheets([])
    }
  }, [isEditing, editingData, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!trimestre || !componente || items.some(i => !i.indicador)) {
      toast.error('Por favor, complete todos los campos.')
      return
    }
    try {
      const newChecklist = {
        state: false,
        remarks: observaciones || 'Sin observaciones',
        trimester: trimestre,
        instructorSignature: JSON.stringify({}),
        evaluationCriteria: false,
        studySheets: selectedStudySheets.length > 0 ? selectedStudySheets.join(',') : null,
        trainingProjectId: selectedTrainingProject ? parseInt(selectedTrainingProject) : null,
        evaluations: null,
        component: componente,
        associatedJuries: null,
        items: items.map((item, index) => ({
          ...(item.id && { id: parseInt(item.id) }),
          code: `IND-${index + 1}`,
          indicator: item.indicador,
          active: true
        })),
        ...(isEditing && deletedItemIds.length > 0 && { deletedItemIds })
      }
      await onCreate(newChecklist)
      if (isEditing) {
        setDeletedItemIds([])
        if (onClose) onClose()
      } else {
        resetForm()
        if (onClose) onClose()
      }
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
    const itemToRemove = items[index]
    if (itemToRemove.id && isEditing) {
      const numericId = parseInt(itemToRemove.id)
      if (!isNaN(numericId)) {
        setDeletedItemIds(prev => [...prev, numericId])
      }
    }
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleTrainingProjectChange = (value: string) => {
    setSelectedTrainingProject(value)
    setSelectedStudySheets([])
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
    setDeletedItemIds([])
    setSelectedTrainingProject('')
    setSelectedStudySheets([])
  }

  // Filtrar fichas por proyecto formativo en el render
  const filteredStudySheets = studySheets.filter(sheet => sheet.trainingProject?.id?.toString() === selectedTrainingProject)

  if (isOpen !== undefined) {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-8 max-h-[90vh] overflow-y-auto border-2 border-lime-500/30 dark:border-shadowBlue/50">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-lime-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              {isEditing ? 'Editar Lista de Chequeo' : 'Crear Lista de Chequeo'}
            </h2>
          </div>
          <div className="bg-gradient-to-r from-lime-50 to-lime-100 dark:from-shadowBlue/10 dark:to-darkBlue/10 border-2 border-lime-200 dark:border-shadowBlue/30 rounded-xl p-4">
            <p className="text-lime-800 dark:text-gray-300 text-sm font-medium">
              💡 <strong>Nota:</strong> {isEditing ?
                'Los cambios se guardarán automáticamente. Puede cerrar este modal cuando termine.' :
                'Se creará automáticamente una evaluación vinculada a esta lista. El instructor podrá completarla desde su vista.'
              }
            </p>
            {isEditing && deletedItemIds.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                  🗑️ <strong>Atención:</strong> Se eliminarán {deletedItemIds.length} indicador(es) existente(s) al guardar.
                </p>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="trimestre" className="block text-sm font-bold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                  Trimestre
                </label>
                <select
                  id="trimestre"
                  value={trimestre}
                  onChange={(e) => setTrimestre(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <option value="">Selecciona un trimestre</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{`${i + 1}° Trimestre`}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="componente" className="block text-sm font-bold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                  Componente
                </label>
                <select
                  id="componente"
                  value={componente}
                  onChange={(e) => setComponente(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <option value="">Selecciona un componente</option>
                  <option value="academico">Académico</option>
                  <option value="actitudinal">Actitudinal</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="observaciones" className="block text-sm font-bold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                Competencia
              </label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Describe la competencia asociada a esta lista de chequeo..."
                className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-28 resize-none font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="trainingProject" className="block text-sm font-bold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                Proyecto Formativo (Opcional)
              </label>
              <select
                id="trainingProject"
                value={selectedTrainingProject}
                onChange={(e) => handleTrainingProjectChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                disabled={loadingProjects}
              >
                <option value="">Selecciona un proyecto formativo</option>
                {trainingProjects.filter(project => project.id != null).map((project) => (
                  <option key={project.id!} value={project.id!}>
                    {project.name} - {project.program?.name}
                  </option>
                ))}
              </select>
              {loadingProjects && (
                <p className="text-sm text-gray-500 mt-1">Cargando proyectos formativos...</p>
              )}
            </div>
            {selectedTrainingProject && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                  Fichas de Formación Asociadas
                </label>
                {loadingSheets ? (
                  <p className="text-sm text-gray-500">Cargando fichas...</p>
                ) : filteredStudySheets.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl p-3 space-y-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                    {filteredStudySheets.filter(sheet => sheet.id != null).map((sheet) => (
                      <label key={sheet.id!} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudySheets.includes(sheet.id!.toString())}
                          onChange={(e) => handleStudySheetChange(sheet.id!.toString(), e.target.checked)}
                          className="h-4 w-4 text-lime-600 focus:ring-lime-500 dark:text-blue-600 dark:focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Ficha {sheet.number} - {sheet.journey?.name} ({sheet.numberStudents} estudiantes)
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay fichas disponibles para este proyecto formativo</p>
                )}
              </div>
            )}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                  Indicadores de Evaluación
                </h3>
                <button
                  type="button"
                  onClick={handleAddIndicador}
                  className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-4 py-2 rounded-xl hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm"
                >
                  + Agregar Indicador
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-lime-50/50 to-lime-100/50 dark:from-shadowBlue/5 dark:to-darkBlue/5 p-4 rounded-xl border border-lime-200/50 dark:border-shadowBlue/20">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <textarea
                        value={item.indicador}
                        onChange={(e) => handleIndicadorChange(index, e.target.value)}
                        placeholder={`Describe el indicador ${index + 1} de evaluación...`}
                        className="flex-1 px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-24 resize-none font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIndicador(index)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold"
                          title="Eliminar indicador"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-lime-200 dark:border-shadowBlue/30">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white py-4 rounded-xl hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg"
              >
                {isEditing ? '✓ Actualizar Lista de Chequeo' : '+ Crear Lista de Chequeo'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="sm:w-auto px-8 py-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-lime-500 dark:hover:border-shadowBlue rounded-xl transition-all duration-300 font-semibold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Versión inicial: botón para abrir modal
  return (
    <div>
      <button
        onClick={() => {}}
        className="bg-[#00324d] text-white px-4 py-2 rounded hover:bg-lime-600 dark:hover:bg-darkBlue transition-colors"
      >
        Crear Lista de Chequeo
      </button>
    </div>
  )
}
