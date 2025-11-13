/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useState, useEffect } from 'react'
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
  items?: Array<{
    id?: string
    code: string
    indicator: string
    active: boolean
  }>
  trainingProjectId?: number | null
  studySheets?: string | null
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
      // ✅ NO limpiar selectedStudySheets si estamos editando
      if (!isEditing) setSelectedStudySheets([])
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

  // ✅ Efecto para cargar datos cuando se edita
  useEffect(() => {
    if (isOpen && isEditing && editingData) {
      // Primero establecer el proyecto formativo
      const projectId = editingData.trainingProjectId?.toString() || ''
      setSelectedTrainingProject(projectId)
      
      // Establecer otros campos
      setTrimestre(editingData.trimester?.toString() || '')
      setObservaciones(editingData.remarks || '')
      
      // Las fichas se establecerán después de que se carguen desde el proyecto
      const sheetsToSelect = editingData.studySheets ? editingData.studySheets.split(',') : []
      
      // ✅ Si hay un proyecto, cargar las fichas y luego seleccionarlas
      if (projectId) {
        loadStudySheets(projectId).then(() => {
          setSelectedStudySheets(sheetsToSelect)
        })
      } else {
        setSelectedStudySheets(sheetsToSelect)
      }
      
      // ✅ Convertir items a indicadores técnicos y actitudinales
      if (editingData.items && Array.isArray(editingData.items)) {
        const tecnicos = editingData.items
          .filter((item: any) => item.code?.startsWith('TEC-'))
          .map((item: any) => ({ indicador: item.indicator }))
        
        const actitudinales = editingData.items
          .filter((item: any) => item.code?.startsWith('ACT-'))
          .map((item: any) => ({ indicador: item.indicator }))
        
        setIndicadoresTecnicos(tecnicos.length > 0 ? tecnicos : [{ indicador: '' }])
        setIndicadoresActitudinales(actitudinales.length > 0 ? actitudinales : [{ indicador: '' }])
      } else {
        setIndicadoresTecnicos([{ indicador: '' }])
        setIndicadoresActitudinales([{ indicador: '' }])
      }
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

    // ✅ Convertir indicadores al formato correcto para GraphQL
    const items = [
      ...indicadoresTecnicos.map((item, index) => ({
        code: `TEC-${index + 1}`,
        indicator: item.indicador,
        active: true,
        itemTypeId: 3 // ID del tipo "Técnico"
      })),
      ...indicadoresActitudinales.map((item, index) => ({
        code: `ACT-${index + 1}`,
        indicator: item.indicador,
        active: true,
        itemTypeId: 1 // ID del tipo "Actitudinal"
      }))
    ]

    const checklistData: any = {
      state: true, // ✅ Cambiar a true para que esté activa al crear
      remarks: observaciones,
      trimester: trimestre,
      studySheets: selectedStudySheets.length > 0 ? selectedStudySheets.join(',') : null,
      trainingProjectId: selectedTrainingProject ? parseInt(selectedTrainingProject) : null,
      items: items // ✅ Enviar items en lugar de indicadores
    }

    // Si estamos editando, agregar el ID
    if (isEditing && editingData?.id) {
      checklistData.id = editingData.id
    }

    try {
      await onCreate(checklistData)
      resetForm()
      onClose()
    } catch (error) {
      console.error(error)
      // El componente padre maneja los toasts de éxito/error
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
            <strong>Nota:</strong> El instructor podrá crear y completar una evaluación asociada a una lista de chequeo desde su vista. Una vez que tanto la lista de chequeo como la evaluación hayan sido diligenciadas, la lista quedará bloqueada, impidiendo su eliminación o modificación posterior.
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
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? 'Cargando proyectos...' : 'Selecciona un proyecto formativo'}
              </option>
              {trainingProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.trainingProjectName || project.name || `Proyecto ${project.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selección de Fichas de Formación */}
        {selectedTrainingProject && (
          <div>
            <label className="block text-sm font-bold text-lime-600 uppercase mb-3">
              Fichas de Formación
            </label>
            {loadingSheets ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Cargando fichas...</p>
              </div>
            ) : studySheets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-lime-200 rounded-xl p-4">
                {studySheets.map((sheet) => (
                  <label key={sheet.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStudySheets.includes(sheet.id.toString())}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudySheets(prev => [...prev, sheet.id.toString()]);
                        } else {
                          setSelectedStudySheets(prev => prev.filter(id => id !== sheet.id.toString()));
                        }
                      }}
                      className="w-4 h-4 text-lime-600 bg-gray-100 border-gray-300 rounded focus:ring-lime-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">
                      Ficha {sheet.number} - {sheet.journey?.name || 'Sin jornada'}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No se encontraron fichas para este proyecto formativo</p>
              </div>
            )}
          </div>
        )}

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

