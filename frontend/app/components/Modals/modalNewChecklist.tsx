'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
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
  indicadoresTecnicos?: string[]
  indicadoresActitudinales?: string[]
  [key: string]: any
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (checklistData: any) => Promise<void>
  editingData?: Checklist | null
  isEditing?: boolean
}

export default function CrearListaChequeo({
  isOpen,
  onClose,
  onCreate,
  editingData = null,
  isEditing = false
}: ModalProps) {
  const [trimestre, setTrimestre] = useState<string>('')
  const [observaciones, setObservaciones] = useState<string>('')

  // Indicadores separados
  const [indicadoresTecnicos, setIndicadoresTecnicos] = useState<{ indicador: string }[]>([{ indicador: '' }])
  const [indicadoresActitudinales, setIndicadoresActitudinales] = useState<{ indicador: string }[]>([{ indicador: '' }])

  // Estados para proyectos formativos y fichas
  const [selectedTrainingProject, setSelectedTrainingProject] = useState<string>('')
  const [selectedStudySheets, setSelectedStudySheets] = useState<string[]>([])

  // Redux selectors
  const trainingProjects = useSelector((state: RootState) => state.trainingProject.data)
  const loadingProjects = useSelector((state: RootState) => state.trainingProject.loading)
  const studySheets = useSelector((state: RootState) => state.studySheet.data)
  const loadingSheets = useSelector((state: RootState) => state.studySheet.loading)

  // Log cuando cambien las fichas
  useEffect(() => {
    if (studySheets.length > 0) {
      console.log(`✅ ${studySheets.length} fichas cargadas correctamente`)
    }
  }, [studySheets, loadingSheets])

  // Cargar proyectos formativos y fichas al abrir el modal
  useEffect(() => {
    if (isOpen) loadTrainingProjects()
  }, [isOpen])

  // Limpiar fichas seleccionadas cuando cambia el proyecto
  useEffect(() => {
    if (selectedTrainingProject) loadStudySheets(selectedTrainingProject)
    else {
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

  // Cargar datos al editar
  useEffect(() => {
    if (isOpen && isEditing && editingData) {
      setTrimestre(editingData.trimester?.toString() || '')
      setObservaciones(editingData.remarks || '')
      setSelectedTrainingProject(editingData.trainingProjectId?.toString() || '')
      setSelectedStudySheets(editingData.studySheets ? editingData.studySheets.split(',') : [])
      setIndicadoresTecnicos(
        editingData.indicadoresTecnicos?.map((i: string) => ({ indicador: i })) || [{ indicador: '' }]
      )
      setIndicadoresActitudinales(
        editingData.indicadoresActitudinales?.map((i: string) => ({ indicador: i })) || [{ indicador: '' }]
      )
    } else if (isOpen && !isEditing) {
      resetForm()
    }
  }, [isEditing, editingData, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!trimestre || indicadoresTecnicos.some(i => !i.indicador) || indicadoresActitudinales.some(i => !i.indicador)) {
      toast.error('Por favor, completa todos los campos obligatorios.')
      return
    }

    if (selectedTrainingProject && selectedStudySheets.length === 0) {
      toast.error('Debe seleccionar al menos una ficha de formación para el proyecto formativo seleccionado.')
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
        indicadoresTecnicos: indicadoresTecnicos.map(i => i.indicador),
        indicadoresActitudinales: indicadoresActitudinales.map(i => i.indicador)
      }

      await onCreate(newChecklist)
    } catch (error) {
      console.error('Error in modal:', error)
      toast.error(isEditing ? 'Error al actualizar la lista de chequeo' : 'Error al crear la lista de chequeo')
    }
  }

  // Funciones dinámicas
  const handleChange = (setter: any, index: number, value: string) => {
    const newItems = [...setter]
    newItems[index].indicador = value
    return newItems
  }

  const handleAdd = (setter: any) => [...setter, { indicador: '' }]
  const handleRemove = (setter: any, index: number) => setter.filter((_: any, i: number) => i !== index)

  const handleTrainingProjectChange = (value: string) => {
    setSelectedTrainingProject(value)
    setSelectedStudySheets([])
  }

  const handleStudySheetChange = (sheetId: string, checked: boolean) => {
    setSelectedStudySheets(prev => checked ? [...prev, sheetId] : prev.filter(id => id !== sheetId))
  }

  const resetForm = () => {
    setTrimestre('')
    setObservaciones('')
    setIndicadoresTecnicos([{ indicador: '' }])
    setIndicadoresActitudinales([{ indicador: '' }])
    setSelectedTrainingProject('')
    setSelectedStudySheets([])
  }

  // Filtrar fichas por proyecto formativo
  const filteredStudySheets = studySheets.filter(sheet => 
    sheet.trainingProject?.id?.toString() === selectedTrainingProject
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditing ? 'Editar Lista de Chequeo' : 'Crear Lista de Chequeo'}
        </h2>

        {/* Información */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm flex items-start space-x-2">
            <span className="text-green-600 font-bold">✅</span>
            <span>
              <strong>Nuevo:</strong> Esta lista de chequeo generará una evaluación asociada en la base de datos,
              disponible para el instructor.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trimestre */}
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

          {/* Competencia */}
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

          {/* Proyecto Formativo */}
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
            {loadingProjects && <p className="text-sm text-gray-500 mt-1">Cargando proyectos formativos...</p>}
          </div>

          {/* Fichas */}
          {selectedTrainingProject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichas de Formación Asociadas <span className="text-red-500">*</span>
              </label>
              {loadingSheets ? (
                <p className="text-sm text-gray-500">Cargando fichas...</p>
              ) : (
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                  {studySheets.map((sheet) => (
                    <label key={sheet.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedStudySheets.includes(sheet.id.toString())}
                        onChange={(e) => handleStudySheetChange(sheet.id.toString(), e.target.checked)}
                        className="h-4 w-4 text-[#00324d] border-gray-300 rounded"
                      />
                      <span className="text-sm">
                        Ficha {sheet.number} - {sheet.journey?.name} ({sheet.numberStudents} estudiantes)
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Indicadores Técnicos */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#00324d]">Indicadores de Evaluación Técnicos</h3>
            {indicadoresTecnicos.map((item, index) => (
              <div key={index} className="flex space-x-3 items-start">
                <textarea
                  value={item.indicador}
                  onChange={(e) => setIndicadoresTecnicos(handleChange(indicadoresTecnicos, index, e.target.value))}
                  placeholder={`Indicador Técnico ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] h-20 resize-none"
                />
                {indicadoresTecnicos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setIndicadoresTecnicos(handleRemove(indicadoresTecnicos, index))}
                    className="text-red-500 mt-2"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIndicadoresTecnicos(handleAdd(indicadoresTecnicos))}
              className="text-[#00324d] hover:text-[#40b003] transition-colors"
            >
              + Agregar Indicador Técnico
            </button>
          </div>

          {/* Indicadores Actitudinales */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#00324d]">Indicadores de Evaluación Actitudinales</h3>
            {indicadoresActitudinales.map((item, index) => (
              <div key={index} className="flex space-x-3 items-start">
                <textarea
                  value={item.indicador}
                  onChange={(e) => setIndicadoresActitudinales(handleChange(indicadoresActitudinales, index, e.target.value))}
                  placeholder={`Indicador Actitudinal ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] h-20 resize-none"
                />
                {indicadoresActitudinales.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setIndicadoresActitudinales(handleRemove(indicadoresActitudinales, index))}
                    className="text-red-500 mt-2"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIndicadoresActitudinales(handleAdd(indicadoresActitudinales))}
              className="text-[#00324d] hover:text-[#40b003] transition-colors"
            >
              + Agregar Indicador Actitudinal
            </button>
          </div>

          {/* Botones */}
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full bg-[#00324d] text-white py-2 rounded hover:bg-[#40b003] transition-colors"
            >
              {isEditing ? 'Actualizar Lista de Chequeo' : 'Crear Lista de Chequeo'}
            </button>
          </div>
        </form>

        <button onClick={onClose} className="text-sm text-gray-500 underline mt-4">
          Cancelar
        </button>
      </div>
    </div>
  )
}

