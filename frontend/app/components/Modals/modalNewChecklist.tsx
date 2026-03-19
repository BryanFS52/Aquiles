/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { trainingProjectService } from '@redux/slices/olympo/trainingProjectSlice'
import { studySheetService } from '@redux/slices/olympo/studySheetSlice'
import ChecklistPreview from './checklistPreview'
import { CHECKLIST_TEMPLATES } from '@data/checklistTemplates'

// ===== Toggle rápido =====
// PASOS PARA VOLVER A DATOS REALES:
// 1) Cambia USE_REAL_SERVICE a true.
// 2) (Opcional) Comenta o elimina DUMMY_TRAINING_PROJECTS y DUMMY_STUDY_SHEETS_BY_PROJECT.
// 3) Mantén activos loadTrainingProjects/loadStudySheets en bloque "MODO SERVICIO REAL".
const USE_REAL_SERVICE = false // Modo datos quemados
// const USE_REAL_SERVICE = true // Modo servicio real

const DUMMY_TRAINING_PROJECTS = [
  { id: 1, trainingProjectName: 'Proyecto Formativo Software Empresarial' },
  { id: 2, trainingProjectName: 'Proyecto Formativo Redes e Infraestructura' },
  { id: 3, trainingProjectName: 'Proyecto Formativo Analítica y Datos' },
]

const DUMMY_STUDY_SHEETS_BY_PROJECT: Record<number, Array<{ id: number; number: string; journey?: { name: string } }>> = {
  1: [
    { id: 101, number: '2758963', journey: { name: 'Mañana' } },
    { id: 102, number: '2758965', journey: { name: 'Tarde' } },
  ],
  2: [
    { id: 201, number: '2758968', journey: { name: 'Noche' } },
    { id: 202, number: '2758970', journey: { name: 'Mañana' } },
  ],
  3: [
    { id: 301, number: '2758971', journey: { name: 'Tarde' } },
    { id: 302, number: '2758973', journey: { name: 'Noche' } },
  ],
}

interface ChecklistItem {
  indicador: string
}

type WorkflowStatus = 'draft' | 'active' | 'in_evaluation' | 'closed'

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
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('draft')
  const [updateReason, setUpdateReason] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const [indicadoresTecnicos, setIndicadoresTecnicos] = useState<ChecklistItem[]>([{ indicador: '' }])
  const [indicadoresActitudinales, setIndicadoresActitudinales] = useState<ChecklistItem[]>([{ indicador: '' }])

  const [selectedTrainingProject, setSelectedTrainingProject] = useState('')
  const [selectedStudySheet, setSelectedStudySheet] = useState('')
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
      // ✅ NO limpiar selectedStudySheet si estamos editando
      if (!isEditing) setSelectedStudySheet('')
    }
  }, [selectedTrainingProject])

  const loadTrainingProjects = async () => {
    setLoadingProjects(true)
    try {
      // ===== MODO LOCAL (DATOS QUEMADOS) =====
      // Puedes comentar/borrar este bloque cuando uses solo backend.
      if (!USE_REAL_SERVICE) {
        setTrainingProjects(DUMMY_TRAINING_PROJECTS)
        return
      }

      // ===== MODO SERVICIO REAL =====
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
      // ===== MODO LOCAL (DATOS QUEMADOS) =====
      // Puedes comentar/borrar este bloque cuando uses solo backend.
      if (!USE_REAL_SERVICE) {
        const projectId = parseInt(trainingProjectId)
        setStudySheets(DUMMY_STUDY_SHEETS_BY_PROJECT[projectId] || [])
        return
      }

      // ===== MODO SERVICIO REAL =====
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
      setWorkflowStatus(editingData.workflowStatus || (editingData.state ? 'active' : 'draft'))
      setUpdateReason('')
      
      // La ficha se establecerá después de que se carguen desde el proyecto
      const selectedSheetFromEdit = editingData.studySheets
        ? editingData.studySheets.split(',')[0]?.trim() || ''
        : ''
      
      // ✅ Si hay un proyecto, cargar las fichas y luego seleccionarlas
      if (projectId) {
        loadStudySheets(projectId).then(() => {
          setSelectedStudySheet(selectedSheetFromEdit)
        })
      } else {
        setSelectedStudySheet(selectedSheetFromEdit)
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
    if (!selectedStudySheet) return toast.error('Debes seleccionar una ficha de formación')
    if (!observaciones.trim()) return toast.error('Debes ingresar una competencia')
    if (indicadoresTecnicos.some(i => !i.indicador.trim())) return toast.error('Todos los indicadores técnicos son requeridos')
    if (indicadoresActitudinales.some(i => !i.indicador.trim())) return toast.error('Todos los indicadores actitudinales son requeridos')
    if (isEditing && !updateReason.trim()) return toast.error('Debes ingresar el motivo de actualización para guardar cambios')

    // ✅ Convertir indicadores al formato correcto para GraphQL
    const items = [
      ...indicadoresTecnicos.map((item, index) => ({
        code: `TEC-${index + 1}`,
        indicator: item.indicador,
        active: true,
        itemTypeId: 2 // ID del tipo "Técnico"
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
      workflowStatus,
      studySheets: selectedStudySheet || null,
      trainingProjectId: selectedTrainingProject ? parseInt(selectedTrainingProject) : null,
      items: items // ✅ Enviar items en lugar de indicadores
    }

    // Si estamos editando, agregar el ID
    if (isEditing && editingData?.id) {
      checklistData.id = editingData.id
      checklistData.updateReason = updateReason.trim()
    }

    try {
      await onCreate(checklistData)
      resetForm()
      onClose()
    } catch (error) {
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

  const handleApplyTemplate = () => {
    const selectedTemplate = CHECKLIST_TEMPLATES.find((template) => template.id === selectedTemplateId)

    if (!selectedTemplate) {
      toast.error('Debes seleccionar una plantilla antes de cargarla')
      return
    }

    setTrimestre(selectedTemplate.trimester)
    setObservaciones(selectedTemplate.competence)
    setIndicadoresTecnicos(
      selectedTemplate.technicalIndicators.map((indicador) => ({ indicador }))
    )
    setIndicadoresActitudinales(
      selectedTemplate.attitudeIndicators.map((indicador) => ({ indicador }))
    )

    toast.success(`Plantilla "${selectedTemplate.name}" cargada correctamente`)
  }

  const selectedTrainingProjectName =
    trainingProjects.find((project) => String(project.id) === String(selectedTrainingProject))
      ?.trainingProjectName ||
    trainingProjects.find((project) => String(project.id) === String(selectedTrainingProject))
      ?.name ||
    ''

  const selectedStudySheetLabel =
    studySheets.find((sheet) => String(sheet.id) === String(selectedStudySheet))
      ? `Ficha ${studySheets.find((sheet) => String(sheet.id) === String(selectedStudySheet))?.number} - ${studySheets.find((sheet) => String(sheet.id) === String(selectedStudySheet))?.journey?.name || 'Sin jornada'}`
      : ''

  const resetForm = () => {
    setTrimestre('')
    setObservaciones('')
    setWorkflowStatus('draft')
    setUpdateReason('')
    setSelectedTemplateId('')
    setPreviewOpen(false)
    setIndicadoresTecnicos([{ indicador: '' }])
    setIndicadoresActitudinales([{ indicador: '' }])
    setSelectedTrainingProject('')
    setSelectedStudySheet('')
  }

  const sharedFieldClass = 'w-full px-4 py-3 border-2 border-lime-400 dark:border-white/50 rounded-xl focus:ring-4 focus:ring-lime-500/30 dark:focus:ring-shadowBlue/30 bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
  const sharedTextareaClass = 'w-full px-4 py-3 border-2 border-lime-400 dark:border-white/50 rounded-xl focus:ring-4 focus:ring-lime-500/30 dark:focus:ring-shadowBlue/30 bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500'
  const sharedIndicatorClass = 'flex-1 px-4 py-2 border-2 border-lime-400 dark:border-white/50 rounded-xl h-20 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 dark:bg-gray-800/95 p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-8 max-h-[90vh] overflow-y-auto border-2 border-lime-500/30 dark:border-white/50"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-lime-500 dark:from-white dark:to-white bg-clip-text text-transparent">
            {isEditing ? 'Editar lista de chequeo' : 'Crear lista de chequeo'}
          </h2>
        </div>

        <div className="rounded-2xl border border-lime-200 dark:border-white/50 bg-lime-50 dark:bg-gray-700/60 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-lime-700 dark:text-white">Plantillas predefinidas</h3>
              <p className="text-sm text-lime-700/80 dark:text-gray-300">
                Usa una base rápida y luego ajusta los campos manualmente si lo necesitas.
              </p>
            </div>
          </div>

          {/* ===== MODO LOCAL (PLANTILLAS QUEMADAS) ===== */}
          {/* Cuando exista el servicio real, puedes conservar este bloque como fallback o reemplazarlo por un selector cargado desde backend. */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className={sharedFieldClass}
            >
              <option value="">Selecciona una plantilla</option>
              {CHECKLIST_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleApplyTemplate}
              className="px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-lime-500 dark:border-white/50 text-lime-700 dark:text-white font-bold hover:bg-lime-100 dark:hover:bg-gray-700 transition-all"
            >
              Cargar plantilla
            </button>
          </div>

          {selectedTemplateId && (
            <div className="rounded-xl border border-lime-200 dark:border-white/50 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              {CHECKLIST_TEMPLATES.find((template) => template.id === selectedTemplateId)?.description}
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 bg-lime-50 dark:bg-gray-700/60 border border-lime-200 dark:border-white/50 text-lime-700 dark:text-gray-200 rounded-xl p-4">
          <span className="text-2xl">💡</span>
          <p className="text-sm leading-relaxed">
            <strong>Nota:</strong> El instructor podrá crear y completar una evaluación asociada a una lista de chequeo desde su vista. Una vez que tanto la lista de chequeo como la evaluación hayan sido diligenciadas, la lista quedará bloqueada, impidiendo su eliminación o modificación posterior.
          </p>
        </div>

        {/* Trimestre y Proyecto Formativo en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-lime-600 dark:text-white uppercase">Trimestre</label>
            <select
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
              className={sharedFieldClass}
            >
              <option value="">Selecciona un trimestre</option>
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1}° Trimestre`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-lime-600 dark:text-white uppercase">Proyecto formativo</label>
            <select
              value={selectedTrainingProject}
              onChange={(e) => setSelectedTrainingProject(e.target.value)}
              className={sharedFieldClass}
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? 'Cargando proyectos.' : 'Selecciona un proyecto formativo'}
              </option>
              {trainingProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.trainingProjectName || project.name || `Proyecto ${project.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-lime-600 dark:text-white uppercase">Estado de flujo</label>
            <select
              value={workflowStatus}
              onChange={(e) => setWorkflowStatus(e.target.value as WorkflowStatus)}
              className={sharedFieldClass}
            >
              <option value="draft">Borrador</option>
              <option value="active">Vigente</option>
              <option value="in_evaluation">En evaluación</option>
              <option value="closed">Cerrada</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Si está en evaluación o cerrada, se bloqueará edición/eliminación desde el listado.
            </p>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-bold text-lime-600 dark:text-white uppercase">Motivo de actualización</label>
              <textarea
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="Ejemplo: Ajuste de indicador técnico por cambio curricular"
                className={`${sharedTextareaClass} h-24`}
              />
            </div>
          )}
        </div>

        {/* Selección de Fichas de Formación */}
        {selectedTrainingProject && (
          <div>
            <label className="block text-sm font-bold text-lime-600 dark:text-white uppercase mb-3">
              Fichas de formación
            </label>
            {loadingSheets ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">Cargando fichas.</p>
              </div>
            ) : studySheets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border-2 border-lime-400 dark:border-white/50 rounded-xl p-4 bg-white dark:bg-gray-800">
                {studySheets.map((sheet) => (
                  <label key={sheet.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="selectedStudySheet"
                      checked={selectedStudySheet === sheet.id.toString()}
                      onChange={() => setSelectedStudySheet(sheet.id.toString())}
                      className="w-4 h-4 text-lime-600 dark:text-shadowBlue bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-lime-500 dark:focus:ring-shadowBlue focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      Ficha {sheet.number} - {sheet.journey?.name || 'Sin jornada'}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/50">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron fichas para este proyecto formativo</p>
              </div>
            )}
          </div>
        )}

        {/* Competencia */}
        <div>
          <label className="block text-sm font-bold text-lime-600 dark:text-white uppercase">Competencia</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Describe la competencia asociada..."
            className={`${sharedTextareaClass} h-24`}
          />
        </div>

        {/* Indicadores Técnicos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-lime-600 dark:text-white uppercase">Indicadores técnicos</h3>
            <button type="button" onClick={() => handleAdd(setIndicadoresTecnicos)} className="text-lime-600 dark:text-blue-300 font-bold">
              Agregar
            </button>
          </div>
          {indicadoresTecnicos.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <textarea
                value={item.indicador}
                onChange={(e) => handleChange(setIndicadoresTecnicos, index, e.target.value)}
                placeholder={`Indicador técnico ${index + 1}`}
                className={sharedIndicatorClass}
              />
              {indicadoresTecnicos.length > 1 && (
                <button type="button" onClick={() => handleRemove(setIndicadoresTecnicos, index)} className="text-red-600 dark:text-red-400">
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Indicadores Actitudinales */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-lime-600 dark:text-white uppercase">Indicadores actitudinales</h3>
            <button type="button" onClick={() => handleAdd(setIndicadoresActitudinales)} className="text-lime-600 dark:text-blue-300 font-bold">
              Agregar
            </button>
          </div>
          {indicadoresActitudinales.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <textarea
                value={item.indicador}
                onChange={(e) => handleChange(setIndicadoresActitudinales, index, e.target.value)}
                placeholder={`Indicador actitudinal ${index + 1}`}
                className={sharedIndicatorClass}
              />
              {indicadoresActitudinales.length > 1 && (
                <button type="button" onClick={() => handleRemove(setIndicadoresActitudinales, index)} className="text-red-600 dark:text-red-400">
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-lime-200 dark:border-white/50">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="sm:w-auto px-8 py-4 border-2 border-lime-500 dark:border-white/50 rounded-xl text-lime-700 dark:text-blue-300 hover:bg-lime-50 dark:hover:bg-gray-700 transition-all font-bold"
          >
            Vista previa
          </button>
          <button
            type="submit"
            className="flex-1 bg-lime-600 text-white py-4 rounded-xl hover:bg-lime-700 font-bold text-lg transition-all"
          >
            {isEditing ? 'Actualizar lista de chequeo' : 'Crear lista de chequeo'}
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

      <ChecklistPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        trimester={trimestre}
        competence={observaciones}
        trainingProjectName={selectedTrainingProjectName}
        studySheetLabel={selectedStudySheetLabel}
        technicalIndicators={indicadoresTecnicos}
        attitudeIndicators={indicadoresActitudinales}
      />
    </div>
  )
}

