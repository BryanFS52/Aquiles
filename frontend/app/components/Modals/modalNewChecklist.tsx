/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { trainingProjectService } from '@redux/slices/olympo/trainingProjectSlice'
import { studySheetService } from '@redux/slices/olympo/studySheetSlice'

interface ChecklistItem {
  indicador: string
}

interface Checklist {
  id?: string
  state: boolean
  remarks?: string
  trimester?: string
  indicadoresTecnicos?: string[]
  indicadoresActitudinales?: string[]
  trainingProjectId?: number | null
  studySheets?: string | null
  note?: string
  [key: string]: any
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (checklistData: Checklist) => Promise<void> | void
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
  const [trimestre, setTrimestre] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [checklistNote, setChecklistNote] = useState('')

  const [indicadoresTecnicos, setIndicadoresTecnicos] = useState<ChecklistItem[]>([{ indicador: '' }])
  const [indicadoresActitudinales, setIndicadoresActitudinales] = useState<ChecklistItem[]>([{ indicador: '' }])

  const [selectedTrainingProject, setSelectedTrainingProject] = useState('')
  const [selectedStudySheets, setSelectedStudySheets] = useState<string[]>([])
  const [trainingProjects, setTrainingProjects] = useState<any[]>([])
  const [studySheets, setStudySheets] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loadingSheets, setLoadingSheets] = useState(false)

  useEffect(() => {
    if (isOpen) loadTrainingProjects()
  }, [isOpen])

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
    } catch {
      toast.error('Error al cargar proyectos formativos')
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
    } catch {
      toast.error('Error al cargar fichas de formación')
    } finally {
      setLoadingSheets(false)
    }
  }

  useEffect(() => {
    if (isOpen && isEditing && editingData) {
      setTrimestre(editingData.trimester?.toString() || '')
      setObservaciones(editingData.remarks || '')
      setChecklistNote(editingData.note || '')
      setSelectedTrainingProject(editingData.trainingProjectId?.toString() || '')
      setSelectedStudySheets(editingData.studySheets ? editingData.studySheets.split(',') : [])
      setIndicadoresTecnicos(editingData.indicadoresTecnicos?.map(i => ({ indicador: i })) || [{ indicador: '' }])
      setIndicadoresActitudinales(editingData.indicadoresActitudinales?.map(i => ({ indicador: i })) || [{ indicador: '' }])
    } else if (isOpen && !isEditing) {
      resetForm()
    }
  }, [isEditing, editingData, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ✅ Validaciones
    if (!trimestre) return toast.error('Debes seleccionar un trimestre')
    if (!selectedTrainingProject) return toast.error('Debes seleccionar un proyecto formativo')
    if (!observaciones.trim()) return toast.error('Debes ingresar una competencia')
    if (indicadoresTecnicos.some(i => !i.indicador.trim())) return toast.error('Todos los indicadores técnicos son requeridos')
    if (indicadoresActitudinales.some(i => !i.indicador.trim())) return toast.error('Todos los indicadores actitudinales son requeridos')

    const checklistData: Checklist = {
      state: false,
      remarks: observaciones || 'Sin observaciones',
      trimester: trimestre,
      instructorSignature: JSON.stringify({}),
      evaluationCriteria: false,
      studySheets: selectedStudySheets.length > 0 ? selectedStudySheets.join(',') : null,
      trainingProjectId: selectedTrainingProject ? parseInt(selectedTrainingProject) : null,
      indicadoresTecnicos: indicadoresTecnicos.map(i => i.indicador),
      indicadoresActitudinales: indicadoresActitudinales.map(i => i.indicador),
      note: checklistNote
    }

    try {
      await onCreate(checklistData)
      toast.success(isEditing ? 'Lista actualizada correctamente' : 'Lista creada correctamente')
      resetForm()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar la lista de chequeo')
    }
  }

  const handleAdd = (setter: React.Dispatch<React.SetStateAction<ChecklistItem[]>>) =>
    setter(prev => [...prev, { indicador: '' }])

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<ChecklistItem[]>>, index: number) =>
    setter(prev => prev.filter((_, i) => i !== index))

  const handleChange = (setter: React.Dispatch<React.SetStateAction<ChecklistItem[]>>, index: number, value: string) =>
    setter(prev => {
      const copy = [...prev]
      copy[index].indicador = value
      return copy
    })

  const resetForm = () => {
    setTrimestre('')
    setObservaciones('')
    setChecklistNote('')
    setIndicadoresTecnicos([{ indicador: '' }])
    setIndicadoresActitudinales([{ indicador: '' }])
    setSelectedTrainingProject('')
    setSelectedStudySheets([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 dark:bg-gray-800/95 p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-8 max-h-[90vh] overflow-y-auto border-2 border-lime-500/30"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-lime-500 bg-clip-text text-transparent">
            {isEditing ? 'Editar Lista de Chequeo' : 'Crear Lista de Chequeo'}
          </h2>
        </div>

        <div className="flex items-start gap-3 bg-lime-50 border border-lime-200 text-lime-700 rounded-xl p-4">
          <span className="text-2xl">💡</span>
          <p className="text-sm leading-relaxed">
            <strong>Nota:</strong> Se creará automáticamente una evaluación vinculada a esta lista.
            El instructor podrá completarla desde su vista.
          </p>
        </div>

        {/* Trimestre y Proyecto Formativo en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-lime-600 uppercase">Trimestre</label>
            <select
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
              className="w-full px-4 py-3 border-2 border-lime-400 rounded-xl focus:ring-4 focus:ring-lime-500/30"
            >
              <option value="">Selecciona un trimestre</option>
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1}° Trimestre`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-lime-600 uppercase">Proyecto Formativo</label>
            <select
              value={selectedTrainingProject}
              onChange={(e) => setSelectedTrainingProject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-lime-400 rounded-xl focus:ring-4 focus:ring-lime-500/30"
            >
              <option value="">Selecciona un proyecto formativo</option>
              {trainingProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.trainingProjectName || `Proyecto ${project.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Competencia */}
        <div>
          <label className="block text-sm font-bold text-lime-600 uppercase">Competencia</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Describe la competencia asociada..."
            className="w-full px-4 py-3 border-2 border-lime-400 rounded-xl h-24 resize-none"
          />
        </div>

        {/* Indicadores Técnicos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-lime-600 uppercase">Indicadores Técnicos</h3>
            <button type="button" onClick={() => handleAdd(setIndicadoresTecnicos)} className="text-lime-600 font-bold">
              + Agregar
            </button>
          </div>
          {indicadoresTecnicos.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <textarea
                value={item.indicador}
                onChange={(e) => handleChange(setIndicadoresTecnicos, index, e.target.value)}
                placeholder={`Indicador técnico ${index + 1}`}
                className="flex-1 px-4 py-2 border-2 border-lime-400 rounded-xl h-20"
              />
              {indicadoresTecnicos.length > 1 && (
                <button type="button" onClick={() => handleRemove(setIndicadoresTecnicos, index)} className="text-red-600">
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Indicadores Actitudinales */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-lime-600 uppercase">Indicadores Actitudinales</h3>
            <button type="button" onClick={() => handleAdd(setIndicadoresActitudinales)} className="text-lime-600 font-bold">
              + Agregar
            </button>
          </div>
          {indicadoresActitudinales.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <textarea
                value={item.indicador}
                onChange={(e) => handleChange(setIndicadoresActitudinales, index, e.target.value)}
                placeholder={`Indicador actitudinal ${index + 1}`}
                className="flex-1 px-4 py-2 border-2 border-lime-400 rounded-xl h-20"
              />
              {indicadoresActitudinales.length > 1 && (
                <button type="button" onClick={() => handleRemove(setIndicadoresActitudinales, index)} className="text-red-600">
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-lime-200">
          <button
            type="submit"
            className="flex-1 bg-lime-600 text-white py-4 rounded-xl hover:bg-lime-700 font-bold text-lg transition-all"
          >
            {isEditing ? 'Actualizar Lista de chequeo' : 'Crear Lista de chequeo'}
          </button>
          <button
            type="button"
            onClick={() => { resetForm(); onClose() }}
            className="sm:w-auto px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:border-lime-500 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

