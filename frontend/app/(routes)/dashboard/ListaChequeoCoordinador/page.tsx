'use client'

import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@redux/store"
import { fetchChecklists, addChecklist, updateChecklist, deleteChecklist } from "@redux/slices/checklistSlice"
import { FaTrashAlt, FaEdit, FaEllipsisV } from "react-icons/fa"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import { toast } from "react-toastify"
import { fetchCoordinationByColaborator } from "@redux/slices/olympo/coordinationSlice"
import { sendEmailNotification } from "@redux/slices/sendEmailSlice"
import { TEMPORAL_COORDINATOR_ID } from "@/temporaryCredential"

// ===== Toggle rápido =====
// PASOS PARA VOLVER A DATOS REALES:
// 1) Cambia USE_REAL_SERVICE a true.
// 2) (Opcional) Borra o comenta el bloque "MODO LOCAL" en useEffect, handleSaveChecklist y handleDeleteChecklist.
// 3) (Opcional) Borra localStorage con la key LOCAL_STORAGE_KEY si ya no usarás datos quemados.
const USE_REAL_SERVICE = false // Modo local (sin backend)
// const USE_REAL_SERVICE = true // Modo servicio real
const LOCAL_STORAGE_KEY = 'checklists_local_data' // Solo se usa en modo local
const LOCAL_JURY_ASSIGNMENTS_KEY = 'checklists_jury_assignments'

interface JurorCandidate {
  id: string
  name: string
  document: string
  email: string
  specialty: string
  center: string
  active: boolean
}

interface AssignedJuror extends JurorCandidate {
  assignedAt: string
  sessionAt: string
}

const FALLBACK_JURORS: JurorCandidate[] = [
  {
    id: '1001',
    name: 'Juan Pérez',
    document: '1045123456',
    email: 'juan.perez@sena.edu.co',
    specialty: 'Desarrollo de Software',
    center: 'Centro de Servicios Financieros',
    active: true,
  },
  {
    id: '1002',
    name: 'María Rodríguez',
    document: '52891234',
    email: 'maria.rodriguez@sena.edu.co',
    specialty: 'Bases de Datos',
    center: 'Centro de Servicios Financieros',
    active: true,
  },
  {
    id: '1003',
    name: 'Carlos Gómez',
    document: '79234123',
    email: 'carlos.gomez@sena.edu.co',
    specialty: 'Redes',
    center: 'Centro de Servicios Empresariales',
    active: true,
  },
]

const LOCAL_TRAINING_PROJECT_LABELS: Record<string, string> = {
  '1': 'Proyecto Formativo Software Empresarial',
  '2': 'Proyecto Formativo Redes e Infraestructura',
  '3': 'Proyecto Formativo Analítica y Datos',
}

const LOCAL_STUDY_SHEET_LABELS: Record<string, string> = {
  '101': 'Ficha 2758963 - Mañana',
  '102': 'Ficha 2758965 - Tarde',
  '201': 'Ficha 2758968 - Noche',
  '202': 'Ficha 2758970 - Mañana',
  '301': 'Ficha 2758971 - Tarde',
  '302': 'Ficha 2758973 - Noche',
}

const LOCAL_ONLY_FIELDS = [
  'version',
  'versionHistory',
  'workflowStatus',
  'updateReason',
  'createdAt',
  'lastUpdatedAt',
] as const

/**
 * Vista de Listas de Chequeo - ROL: COORDINADOR
 *
 * RESPONSABILIDADES:
 * ==================
 * 1. Crear listas de chequeo con indicadores (técnicos/actitudinales)
 * 2. Asociar listas a fichas de formación (studySheets)
 * 3. Definir trimestre, componente y proyecto formativo
 * 4. Activar/Desactivar listas
 * 5. Editar/Eliminar listas creadas
 *
 * CAMPOS QUE SE LLENAN AQUÍ:
 * - state (activo/inactivo)
 * - trimester
 * - component
 * - studySheets (fichas asociadas)
 * - trainingProjectId
 * - items (indicadores)
 * 
 * CAMPOS QUE SE LLENAN EN LA VISTA DEL INSTRUCTOR:
 * - instructorSignature (firma digital)
 * - evaluationCriteria (cumplimiento de criterios)
 * - remarks (observaciones finales)
 * - evaluations (relación 1:1 con evaluación)
 */
export default function CoordinadorChecklistView() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: checklists, loading, error } = useSelector((state: RootState) => state.checklist)
  const { data: coordinations } = useSelector((state: RootState) => state.coordination)
  const [localChecklists, setLocalChecklists] = useState<any[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedTrimestre, setSelectedTrimestre] = useState("todos")
  const [isEditing, setIsEditing] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [historyChecklist, setHistoryChecklist] = useState<any>(null)
  const [checklistDetailModalOpen, setChecklistDetailModalOpen] = useState(false)
  const [checklistDetail, setChecklistDetail] = useState<any>(null)
  const [expandedCriteria, setExpandedCriteria] = useState<{ [key: string]: boolean }>({})
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [juryModalOpen, setJuryModalOpen] = useState(false)
  const [juryChecklist, setJuryChecklist] = useState<any>(null)
  const [selectedJurorIds, setSelectedJurorIds] = useState<string[]>([])
  const [jurySearchTerm, setJurySearchTerm] = useState('')
  const [jurySpecialtyFilter, setJurySpecialtyFilter] = useState('todos')
  const [juryCenterFilter, setJuryCenterFilter] = useState('todos')
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const [sessionDate, setSessionDate] = useState('')
  const [sessionTime, setSessionTime] = useState('')
  const [juryAssignments, setJuryAssignments] = useState<Record<string, AssignedJuror[]>>({})

  const sanitizeForService = (payload: any) => {
    const cleanPayload = { ...payload }
    LOCAL_ONLY_FIELDS.forEach((field) => {
      delete cleanPayload[field]
    })
    return cleanPayload
  }

  const isChecklistLocked = (checklist: any): boolean => {
    if (!checklist) return false

    const workflowStatus = checklist.workflowStatus || (checklist.state ? 'active' : 'draft')
    const hasEvaluations = Array.isArray(checklist.evaluations) && checklist.evaluations.length > 0

    return workflowStatus === 'in_evaluation' || workflowStatus === 'closed' || checklist.inEvaluation === true || hasEvaluations
  }

  const getWorkflowLabel = (checklist: any): string => {
    const workflowStatus = checklist.workflowStatus || (checklist.state ? 'active' : 'draft')

    if (workflowStatus === 'in_evaluation') return 'En evaluación'
    if (workflowStatus === 'closed') return 'Cerrada'
    if (workflowStatus === 'active') return 'Vigente'
    return 'Borrador'
  }

  const getWorkflowClasses = (checklist: any): string => {
    const workflowStatus = checklist.workflowStatus || (checklist.state ? 'active' : 'draft')

    if (workflowStatus === 'in_evaluation') return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
    if (workflowStatus === 'closed') return 'bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    if (workflowStatus === 'active') return 'bg-lime-500 text-white border border-lime-100 dark:bg-lime-600 dark:text-white dark:border-lime-400'
    return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
  }

  const getChangedFields = (currentChecklist: any, nextChecklist: any): string[] => {
    const fieldMap: Record<string, string> = {
      trimester: 'Trimestre',
      remarks: 'Competencia',
      studySheets: 'Fichas',
      trainingProjectId: 'Proyecto formativo',
      workflowStatus: 'Estado de flujo',
      items: 'Indicadores',
      state: 'Estado activo/inactivo',
    }

    return Object.keys(fieldMap).filter((key) => JSON.stringify(currentChecklist?.[key]) !== JSON.stringify(nextChecklist?.[key])).map((key) => fieldMap[key])
  }

  const handleOpenHistoryModal = (checklist: any) => {
    setHistoryChecklist(checklist)
    setHistoryModalOpen(true)
  }

  const handleRestoreVersion = (checklistId: string | number, historyEntry: any) => {
    // ===== MODO SERVICIO REAL =====
    // Pendiente integrar endpoint de rollback cuando backend esté disponible.
    if (USE_REAL_SERVICE) {
      toast.info('La restauración de versiones está disponible por ahora en modo local')
      return
    }

    const currentChecklist = localChecklists.find((item) => String(item.id) === String(checklistId))

    if (!currentChecklist) {
      toast.error('No se encontró la lista de chequeo para restaurar')
      return
    }

    if (isChecklistLocked(currentChecklist)) {
      toast.error('Esta lista está en evaluación o cerrada y no se puede restaurar')
      return
    }

    if (!historyEntry?.snapshot) {
      toast.error('La versión seleccionada no tiene snapshot para restaurar')
      return
    }

    const previousVersion = Number(currentChecklist.version || 1)
    const restoredData = {
      state: historyEntry.snapshot.state,
      workflowStatus: historyEntry.snapshot.workflowStatus,
      remarks: historyEntry.snapshot.remarks,
      trimester: historyEntry.snapshot.trimester,
      studySheets: historyEntry.snapshot.studySheets,
      trainingProjectId: historyEntry.snapshot.trainingProjectId,
      items: historyEntry.snapshot.items,
    }

    const changedFields = getChangedFields(currentChecklist, restoredData)

    const rollbackHistoryEntry = {
      version: previousVersion,
      changedAt: new Date().toISOString(),
      changeReason: `Rollback a versión ${historyEntry.version}`,
      changedFields,
      snapshot: {
        state: currentChecklist?.state,
        workflowStatus: currentChecklist?.workflowStatus || (currentChecklist?.state ? 'active' : 'draft'),
        remarks: currentChecklist?.remarks,
        trimester: currentChecklist?.trimester,
        studySheets: currentChecklist?.studySheets,
        trainingProjectId: currentChecklist?.trainingProjectId,
        items: currentChecklist?.items,
      },
    }

    const updated = localChecklists.map((item) =>
      String(item.id) === String(checklistId)
        ? {
          ...item,
          ...restoredData,
          version: previousVersion + 1,
          lastUpdatedAt: new Date().toISOString(),
          versionHistory: [...(item.versionHistory || []), rollbackHistoryEntry],
        }
        : item
    )

    const updatedChecklist = updated.find((item) => String(item.id) === String(checklistId))

    setLocalChecklists(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    setHistoryChecklist(updatedChecklist || null)
    toast.success(`Versión ${historyEntry.version} restaurada correctamente`)
  }

  // Cargar listas al montar el componente
  useEffect(() => {
    // ===== MODO LOCAL =====
    // Puedes comentar/borrar este bloque cuando uses solo backend.
    if (!USE_REAL_SERVICE) {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY)
      setLocalChecklists(localData ? JSON.parse(localData) : [])
      return
    }

    // ===== MODO SERVICIO REAL =====
    dispatch(fetchChecklists({ page: 0, size: 100 }))
  }, [dispatch])

  useEffect(() => {
    const localAssignments = localStorage.getItem(LOCAL_JURY_ASSIGNMENTS_KEY)
    if (localAssignments) {
      try {
        setJuryAssignments(JSON.parse(localAssignments))
      } catch {
        setJuryAssignments({})
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_JURY_ASSIGNMENTS_KEY, JSON.stringify(juryAssignments))
  }, [juryAssignments])

  useEffect(() => {
    dispatch(fetchCoordinationByColaborator({
      collaboratorId: TEMPORAL_COORDINATOR_ID,
      page: 0,
      size: 50,
      state: true,
    }))
  }, [dispatch])

  // Comentado para evitar dobles notificaciones - los errores se manejan en cada función
  // useEffect(() => {
  //   if (error) {
  //     toast.error(`Error: ${error}`)
  //   }
  // }, [error])

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const menuContainer = target.closest('[data-menu-container]')

      if (!menuContainer) {
        setOpenMenuId(null)
      }
    }

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenuId])

  const handleCloseModal = () => {
    setModalOpen(false)
    setIsEditing(false)
    setSelectedChecklist(null)
  }

  const handleOpenCreateModal = () => {
    setIsEditing(false)
    setSelectedChecklist(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (checklist: any) => {
    if (isChecklistLocked(checklist)) {
      toast.error('Esta lista está en evaluación o cerrada y no se puede editar')
      return
    }

    setIsEditing(true)
    setSelectedChecklist(checklist)
    setModalOpen(true)
  }

  const handleOpenConfirmModal = (checklist: any) => {
    if (isChecklistLocked(checklist)) {
      toast.error('Esta lista está en evaluación o cerrada y no se puede eliminar')
      return
    }

    setSelectedChecklist(checklist)
    setConfirmModalOpen(true)
  }

  const handleDeleteChecklist = async () => {
    if (selectedChecklist) {
      // ===== MODO LOCAL =====
      // Puedes comentar/borrar este bloque cuando uses solo backend.
      if (!USE_REAL_SERVICE) {
        if (isChecklistLocked(selectedChecklist)) {
          toast.error('Esta lista está en evaluación o cerrada y no se puede eliminar')
          setConfirmModalOpen(false)
          setSelectedChecklist(null)
          return
        }

        const updated = localChecklists.filter((item) => String(item.id) !== String(selectedChecklist.id))
        setLocalChecklists(updated)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
        toast.success("Lista de chequeo eliminada exitosamente")
        setConfirmModalOpen(false)
        setSelectedChecklist(null)
        return
      }

      try {
        await dispatch(deleteChecklist(selectedChecklist.id)).unwrap()
        toast.success("Lista de chequeo eliminada exitosamente")
        // Recargar listas
        dispatch(fetchChecklists({ page: 0, size: 100 }))
      } catch (err: any) {
        // Extraer solo el mensaje limpio del error
        let errorMessage = err.message || 'Error desconocido';

        // Remover prefijos técnicos del mensaje
        if (errorMessage.includes('Unexpected error in deleteChecklist:')) {
          errorMessage = errorMessage.split('Unexpected error in deleteChecklist:')[1].trim();
        }
        if (errorMessage.startsWith('Error Deleting Checklist:')) {
          errorMessage = errorMessage.replace('Error Deleting Checklist:', '').trim();
        }

        toast.error(errorMessage);
      }
    }
    setConfirmModalOpen(false)
    setSelectedChecklist(null)
  }

  const handleSaveChecklist = async (data: any) => {
    try {
      // ===== MODO LOCAL =====
      // Puedes comentar/borrar este bloque cuando uses solo backend.
      if (!USE_REAL_SERVICE) {
        if (isEditing) {
          const currentChecklist = localChecklists.find((item) => String(item.id) === String(data.id))

          if (isChecklistLocked(currentChecklist)) {
            toast.error('Esta lista está en evaluación o cerrada y no se puede actualizar')
            return
          }

          const { updateReason, ...incomingData } = data
          const previousVersion = Number(currentChecklist?.version || 1)
          const changedFields = getChangedFields(currentChecklist, incomingData)
          const versionEntry = {
            version: previousVersion,
            changedAt: new Date().toISOString(),
            changeReason: updateReason || 'Actualización manual',
            changedFields,
            snapshot: {
              state: currentChecklist?.state,
              workflowStatus: currentChecklist?.workflowStatus || (currentChecklist?.state ? 'active' : 'draft'),
              remarks: currentChecklist?.remarks,
              trimester: currentChecklist?.trimester,
              studySheets: currentChecklist?.studySheets,
              trainingProjectId: currentChecklist?.trainingProjectId,
              items: currentChecklist?.items,
            },
          }

          const updated = localChecklists.map((item) =>
            String(item.id) === String(data.id)
              ? {
                ...item,
                ...incomingData,
                version: previousVersion + 1,
                lastUpdatedAt: new Date().toISOString(),
                versionHistory: [...(item.versionHistory || []), versionEntry],
              }
              : item
          )
          setLocalChecklists(updated)
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
          toast.success("Lista de chequeo actualizada exitosamente")
        } else {
          const newChecklist = {
            ...data,
            id: data.id ?? `${Date.now()}`,
            workflowStatus: data.workflowStatus || (data.state ? 'active' : 'draft'),
            version: 1,
            versionHistory: [],
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
          }
          const updated = [...localChecklists, newChecklist]
          setLocalChecklists(updated)
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
          toast.success("Lista de chequeo creada exitosamente")
        }

        handleCloseModal()
        return
      }

      if (isEditing) {
        // Actualizar lista existente
        const { id, ...inputData } = data // Separar id del resto de datos
        await dispatch(updateChecklist({
          id,
          input: sanitizeForService(inputData)
        })).unwrap()
        toast.success("Lista de chequeo actualizada exitosamente")
      } else {
        // Crear nueva lista
        await dispatch(addChecklist(sanitizeForService(data))).unwrap()
        toast.success("Lista de chequeo creada exitosamente")
      }

      // Recargar listas
      dispatch(fetchChecklists({ page: 0, size: 100 }))
      handleCloseModal()
    } catch (err: any) {
      // Extraer solo el mensaje limpio del error
      let errorMessage = err.message || 'Error desconocido';

      // Remover prefijos técnicos del mensaje
      if (errorMessage.includes('Unexpected error in updateChecklist:')) {
        errorMessage = errorMessage.split('Unexpected error in updateChecklist:')[1].trim();
      }
      if (errorMessage.startsWith('Error Updating Checklist:')) {
        errorMessage = errorMessage.replace('Error Updating Checklist:', '').trim();
      }

      toast.error(errorMessage);
    }
  }

  const handleToggleState = async (checklist: any) => {
    if (isChecklistLocked(checklist)) {
      toast.error('Esta lista está en evaluación o cerrada y no se puede modificar')
      return
    }

    const newState = !checklist.state

    // ===== MODO LOCAL =====
    if (!USE_REAL_SERVICE) {
      const updated = localChecklists.map((item) =>
        String(item.id) === String(checklist.id) ? { ...item, state: newState } : item
      )
      setLocalChecklists(updated)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      toast.success(`Lista ${newState ? 'activada' : 'desactivada'} correctamente`)
      return
    }

    // ===== MODO SERVICIO REAL =====
    try {
      const { id, ...rest } = checklist
      await dispatch(updateChecklist({ id, input: { ...rest, state: newState } })).unwrap()
      dispatch(fetchChecklists({ page: 0, size: 100 }))
      toast.success(`Lista ${newState ? 'activada' : 'desactivada'} correctamente`)
    } catch (err: any) {
      toast.error(err.message || 'Error al cambiar el estado')
    }
  }

  // Toggle para expandir/contraer criterios
  const toggleCriteria = (checklistId: string) => {
    setExpandedCriteria(prev => ({
      ...prev,
      [checklistId]: !prev[checklistId]
    }))
  }

  const getFormattedStudySheets = (studySheets: string): string => {
    if (!studySheets) return 'Sin fichas asociadas'
    const sheetIds = studySheets.split(',')
    return `${sheetIds.length} ${sheetIds.length === 1 ? 'ficha asociada' : 'fichas asociadas'}`
  }

  const jurorCandidates: JurorCandidate[] = useMemo(() => {
    const olympoJurors = (coordinations || []).flatMap((coord: any) => {
      const centerName = coord?.trainingCenter?.name || 'Sin centro'
      return (coord?.teachers || [])
        .filter((teacher: any) => teacher?.id)
        .map((teacher: any) => {
          const person = teacher?.collaborator?.person
          const fullName = `${person?.name || ''} ${person?.lastname || ''}`.trim() || 'Instructor sin nombre'
          return {
            id: String(teacher.id),
            name: fullName,
            document: person?.document ? String(person.document) : 'Sin documento',
            email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@sena.edu.co`,
            specialty: teacher?.classTypes?.[0]?.name || 'General',
            center: centerName,
            active: teacher?.state !== false,
          }
        })
    })

    if (olympoJurors.length > 0) {
      const uniqueById = new Map<string, JurorCandidate>()
      olympoJurors.forEach((juror) => {
        if (!uniqueById.has(juror.id)) {
          uniqueById.set(juror.id, juror)
        }
      })
      return Array.from(uniqueById.values())
    }

    return FALLBACK_JURORS
  }, [coordinations])

  const sessionAt = sessionDate && sessionTime ? `${sessionDate}T${sessionTime}` : ''

  const busySlotsByJuror = useMemo(() => {
    const entries = Object.entries(juryAssignments)
    return entries.reduce<Record<string, string[]>>((acc, [checklistId, assigned]) => {
      if (juryChecklist && String(juryChecklist.id) === checklistId) return acc

      assigned.forEach((juror) => {
        if (!acc[juror.id]) acc[juror.id] = []
        acc[juror.id].push(juror.sessionAt)
      })
      return acc
    }, {})
  }, [juryAssignments, juryChecklist])

  const isJurorAvailableAtSession = (jurorId: string): boolean => {
    if (!sessionAt) return true
    return !(busySlotsByJuror[jurorId] || []).includes(sessionAt)
  }

  const specialtyOptions = useMemo(() => {
    const values = new Set(jurorCandidates.map((juror) => juror.specialty).filter(Boolean))
    return ['todos', ...Array.from(values)]
  }, [jurorCandidates])

  const centerOptions = useMemo(() => {
    const values = new Set(jurorCandidates.map((juror) => juror.center).filter(Boolean))
    return ['todos', ...Array.from(values)]
  }, [jurorCandidates])

  const filteredJurors = useMemo(() => {
    const search = jurySearchTerm.trim().toLowerCase()

    return jurorCandidates.filter((juror) => {
      if (!juror.active) return false

      const matchesSearch = !search ||
        juror.name.toLowerCase().includes(search) ||
        juror.document.toLowerCase().includes(search) ||
        juror.specialty.toLowerCase().includes(search) ||
        juror.center.toLowerCase().includes(search)

      const matchesSpecialty = jurySpecialtyFilter === 'todos' || juror.specialty === jurySpecialtyFilter
      const matchesCenter = juryCenterFilter === 'todos' || juror.center === juryCenterFilter
      const matchesAvailability = !onlyAvailable || isJurorAvailableAtSession(juror.id)

      return matchesSearch && matchesSpecialty && matchesCenter && matchesAvailability
    })
  }, [jurorCandidates, jurySearchTerm, jurySpecialtyFilter, juryCenterFilter, onlyAvailable, sessionAt, busySlotsByJuror])

  const getAssignedJurorsCount = (checklistId: string | number): number => {
    return juryAssignments[String(checklistId)]?.length || 0
  }

  const handleOpenJuryModal = (checklist: any) => {
    setJuryChecklist(checklist)
    const existing = juryAssignments[String(checklist.id)] || []
    setSelectedJurorIds(existing.map((juror) => juror.id))

    if (existing[0]?.sessionAt) {
      const [savedDate, savedTime] = existing[0].sessionAt.split('T')
      setSessionDate(savedDate || '')
      setSessionTime((savedTime || '').slice(0, 5))
    } else {
      setSessionDate('')
      setSessionTime('')
    }

    setJurySearchTerm('')
    setJurySpecialtyFilter('todos')
    setJuryCenterFilter('todos')
    setOnlyAvailable(true)
    setJuryModalOpen(true)
  }

  const handleToggleJurorSelection = (jurorId: string) => {
    setSelectedJurorIds((prev) =>
      prev.includes(jurorId)
        ? prev.filter((id) => id !== jurorId)
        : [...prev, jurorId]
    )
  }

  const handleSaveJuryAssignment = async () => {
    if (!juryChecklist) return

    if (!sessionDate || !sessionTime) {
      toast.error('Define la fecha y hora de la sustentación para verificar disponibilidad')
      return
    }

    if (selectedJurorIds.length === 0) {
      toast.error('Selecciona al menos un jurado')
      return
    }

    const selectedJurors = jurorCandidates.filter((juror) => selectedJurorIds.includes(juror.id))
    const selectedSession = `${sessionDate}T${sessionTime}`
    const conflictedJurors = selectedJurors.filter((juror) => !isJurorAvailableAtSession(juror.id))

    if (conflictedJurors.length > 0) {
      toast.error(`Sin disponibilidad: ${conflictedJurors.map((juror) => juror.name).join(', ')}`)
      return
    }

    const assignedAt = new Date().toISOString()
    const assignmentPayload: AssignedJuror[] = selectedJurors.map((juror) => ({
      ...juror,
      assignedAt,
      sessionAt: selectedSession,
    }))

    const checklistId = String(juryChecklist.id)
    const updatedAssignments = {
      ...juryAssignments,
      [checklistId]: assignmentPayload,
    }

    setJuryAssignments(updatedAssignments)

    if (!USE_REAL_SERVICE) {
      const updated = localChecklists.map((item) =>
        String(item.id) === checklistId
          ? { ...item, associatedJuries: assignmentPayload }
          : item
      )
      setLocalChecklists(updated)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    } else {
      try {
        const associatedJuries = selectedJurorIds
          .map((id) => Number(id))
          .filter((id) => !Number.isNaN(id))

        const { id, ...rest } = juryChecklist
        await dispatch(updateChecklist({ id, input: { ...rest, associatedJuries } as any })).unwrap()
      } catch {
        toast.warning('Se guardó localmente la asignación de jurados, pero no se pudo sincronizar con backend')
      }
    }

    const notificationResults = await Promise.allSettled(
      selectedJurors.map((juror) =>
        dispatch(sendEmailNotification({
          emailRequest: {
            email: juror.email,
            subject: 'Asignación como jurado de sustentación',
            htmlContent: `<p>Hola ${juror.name},</p><p>Has sido asignado como jurado para la sustentación de la lista de chequeo del trimestre ${juryChecklist.trimester}.<br/>Fecha: <strong>${sessionDate}</strong> Hora: <strong>${sessionTime}</strong>.</p>`,
          }
        }))
      )
    )

    const sentCount = notificationResults.filter((result) => result.status === 'fulfilled').length
    toast.success(`Jurados asignados correctamente. Notificaciones enviadas: ${sentCount}/${selectedJurors.length}`)

    setJuryModalOpen(false)
    setJuryChecklist(null)
    setSelectedJurorIds([])
  }

  const checklistSource = USE_REAL_SERVICE ? (checklists || []) : localChecklists
  const isLoading = USE_REAL_SERVICE ? loading : false

  // Filtrar listas según el trimestre seleccionado
  const filteredChecklists = checklistSource.filter(
    (checklist: any) => selectedTrimestre === "todos" || checklist.trimester === selectedTrimestre
  )

  const handleOpenChecklistDetail = (checklist: any) => {
    setChecklistDetail(checklist)
    setChecklistDetailModalOpen(true)
  }

  const detailTrainingProjectName = useMemo(() => {
    if (!checklistDetail) return 'Sin proyecto definido'

    const directName =
      checklistDetail.trainingProjectName ||
      checklistDetail.trainingProject?.trainingProjectName ||
      checklistDetail.trainingProject?.name

    if (directName) return directName

    const id = checklistDetail.trainingProjectId != null ? String(checklistDetail.trainingProjectId) : ''
    if (!id) return 'Sin proyecto definido'

    return LOCAL_TRAINING_PROJECT_LABELS[id] || `Proyecto ${id}`
  }, [checklistDetail])

  const detailStudySheetsLabel = useMemo(() => {
    if (!checklistDetail?.studySheets) return 'Sin fichas asociadas'

    const sheetIds = String(checklistDetail.studySheets)
      .split(',')
      .map((value: string) => value.trim())
      .filter(Boolean)

    if (sheetIds.length === 0) return 'Sin fichas asociadas'

    return sheetIds
      .map((sheetId: string) => LOCAL_STUDY_SHEET_LABELS[sheetId] || `Ficha ${sheetId}`)
      .join(' • ')
  }, [checklistDetail])

  const detailAssignedJurors = useMemo(() => {
    if (!checklistDetail) return []
    const localAssigned = juryAssignments[String(checklistDetail.id)] || []
    if (localAssigned.length > 0) return localAssigned
    if (Array.isArray(checklistDetail.associatedJuries)) return checklistDetail.associatedJuries
    return []
  }, [checklistDetail, juryAssignments])

  // Agrupar criterios por componente
  const groupedItems = useMemo(() => {
    if (!checklistDetail?.items) return {};

    return checklistDetail.items.reduce((acc: any, item: any) => {
      const code = item.code?.toUpperCase() || "";

      const categoryName = code.startsWith('TEC') ? 'Indicadores técnicos' :
        code.startsWith('ACT') ? 'Indicadores actitudinales' : 'Otros';

      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(item);
      return acc;
    }, {});
  }, [checklistDetail]);

  return (
    <>
      <PageTitle>Listas de chequeo trimestrales</PageTitle>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="trimestre-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filtrar por trimestre:
          </label>
          <select
            id="trimestre-select"
            value={selectedTrimestre}
            onChange={(e) => setSelectedTrimestre(e.target.value)}
            className="px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-full focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <option value="todos">Todos los trimestres</option>
            <option value="1">Primer trimestre</option>
            <option value="2">Segundo trimestre</option>
            <option value="3">Tercer trimestre</option>
            <option value="4">Cuarto trimestre</option>
            <option value="5">Quinto trimestre</option>
            <option value="6">Sexto trimestre</option>
            <option value="7">Séptimo trimestre</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreateModal}
          disabled={isLoading}
          className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-6 py-3 rounded-full hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear lista de chequeo
        </button>
      </div>

      <div className="mt-6 overflow-visible">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Cargando listas de chequeo
              </p>
            </div>
          </div>
        ) : filteredChecklists.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {selectedTrimestre === "todos"
                  ? "No hay listas de chequeo disponibles. Crea tu primera lista de chequeo."
                  : `No hay listas de chequeo para el trimestre ${selectedTrimestre}`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-8 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {filteredChecklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="group relative transform transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div
                    onClick={() => handleOpenChecklistDetail(checklist)}
                    className="cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-xl hover:shadow-2xl dark:hover:shadow-2xl overflow-hidden"
                  >
                    <div className="bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-4">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {checklist.trimester}° Trimestre
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenJuryModal(checklist)
                            }}
                            className="text-white hover:text-white-200 transition-colors px-2.5 py-1.5 rounded-full hover:bg-white/20 text-xs font-semibold whitespace-nowrap"
                            title="Asignar jurados"
                          >
                            Jurados
                          </button>

                          <div className="relative" data-menu-container>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === checklist.id ? null : checklist.id)
                              }}
                              className="text-white hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
                              title="Más opciones"
                            >
                              <FaEllipsisV className="w-4 h-4" />
                            </button>

                            {openMenuId === checklist.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 z-50 rounded-lg bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenEditModal(checklist)
                                    setOpenMenuId(null)
                                  }}
                                  disabled={isChecklistLocked(checklist)}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <FaEdit className="w-3.5 h-3.5 text-blue-500" /> Editar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenHistoryModal(checklist)
                                    setOpenMenuId(null)
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-11a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Historial
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenConfirmModal(checklist)
                                    setOpenMenuId(null)
                                  }}
                                  disabled={isChecklistLocked(checklist)}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <FaTrashAlt className="w-3.5 h-3.5" /> Eliminar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">

                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${getWorkflowClasses(checklist)}`}>
                          {getWorkflowLabel(checklist)}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                          Versión {checklist.version || 1}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-white uppercase tracking-wide">
                          Fichas asociadas <br />
                        </span>
                        <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-xs font-bold border border-gray-300 dark:border-gray-500">
                          {getFormattedStudySheets(checklist.studySheets || "")}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-white uppercase tracking-wide">
                          Jurados
                        </span>
                        <div className="mt-2 flex items-center justify-between rounded-lg border border-lime-200 bg-lime-50 px-3 py-2 dark:border-shadowBlue/60 dark:bg-shadowBlue/20">
                          <span className="text-xs font-medium text-lime-700 dark:text-white">
                            Asignados
                          </span>
                          <span className="text-sm font-bold text-lime-800 dark:text-white">
                            {getAssignedJurorsCount(checklist.id)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-white uppercase tracking-wide">
                          Indicadores
                        </span>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between bg-lime-50 dark:bg-shadowBlue/20 rounded-lg px-3 py-2 border border-lime-200 dark:border-shadowBlue/60">
                            <span className="text-xs font-medium text-lime-700 dark:text-white">
                              Técnicos
                            </span>
                            <span className="text-sm font-bold text-lime-800 dark:text-white">
                              {checklist.items?.filter((item: any) => item.code?.startsWith('TEC')).length ?? 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-lime-50 dark:bg-shadowBlue/20 rounded-lg px-3 py-2 border border-lime-200 dark:border-shadowBlue/60">
                            <span className="text-xs font-medium text-lime-700 dark:text-white">
                              Actitudinales
                            </span>
                            <span className="text-sm font-bold text-lime-800 dark:text-white">
                              {checklist.items?.filter((item: any) => item.code?.startsWith('ACT')).length ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-white uppercase tracking-wide">
                          Estado
                        </span>
                        <div className="mt-2 flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleState(checklist)
                            }}
                            disabled={isChecklistLocked(checklist)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${checklist.state
                              ? 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-lime-500 dark:to-lime-600'
                              : 'bg-red-600 dark:bg-red-500'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-lg ${checklist.state ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                          <span className={`ml-3 text-xs font-bold ${checklist.state
                            ? 'text-lime-600 dark:text-lime-600'
                            : 'text-red-600 dark:text-red-600'
                            }`}>
                            {checklist.state ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>

                      {isChecklistLocked(checklist) && (
                        <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-[#232a3a] px-3 py-2 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                          Lista bloqueada: en evaluación o cerrada. No admite edición/eliminación.
                        </div>
                      )}

                      <div className="min-h-[60px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-lime-600 dark:text-white uppercase tracking-wide">
                            Criterios de evaluación
                          </span>
                          {checklist.remarks && checklist.remarks.length > 30 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleCriteria(checklist.id)
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-lime-500 to-lime-600 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-600 hover:to-lime-700 dark:hover:from-darkBlue dark:hover:to-shadowBlue rounded-full shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              {expandedCriteria[checklist.id] ? (
                                <>
                                  <span>Ver menos</span>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <span>Ver más</span>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap transition-all duration-300 ${!expandedCriteria[checklist.id] && checklist.remarks && checklist.remarks.length > 30
                          ? 'line-clamp-2'
                          : ''
                          }`}>
                          {checklist.remarks || 'Sin observaciones'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {checklistDetailModalOpen && checklistDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="sticky top-0 z-10 border-b border-white/20 bg-gradient-to-r from-lime-600 to-lime-500 p-5 text-white dark:from-shadowBlue dark:to-darkBlue dark:border-gray-700">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Detalle de la lista de chequeo</h3>
                  <p className="text-sm text-white/90">Trimestre {checklistDetail.trimester} • Versión {checklistDetail.version || 1}</p>
                </div>
                <button
                  onClick={() => {
                    setChecklistDetailModalOpen(false)
                    setChecklistDetail(null)
                  }}
                  className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Estado de flujo</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{getWorkflowLabel(checklistDetail)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{checklistDetail.state ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fichas asociadas</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{detailStudySheetsLabel}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Proyecto formativo</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{detailTrainingProjectName}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                <p className="text-xs text-gray-500 dark:text-gray-400">Criterios de evaluación</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">{checklistDetail.remarks || 'Sin observaciones'}</p>
              </div>

              {/* Categorías agrupadas */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Desglose de indicadores</p>
                {Object.entries(groupedItems).map(([categoryName, items]: [string, any]) => (
                  <div key={categoryName} className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/20 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {categoryName}
                      </h3>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                      {items.map((item: any, index: number) => {
                        const itemKey = item.id || `${item.code}-${index}` || `idx-${index}`;

                        return (
                          <li key={itemKey} className="flex items-start gap-3 p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.code?.toUpperCase().startsWith('TEC') ? 'bg-lime-500' : 'bg-blue-500'}`}></span>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                                {item.code || 'S/C'}
                              </span>
                              <p className="text-gray-700 dark:text-gray-200">
                                {item.indicator || item.description || "Sin descripción disponible"}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Jurados asignados</p>
                  <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-200">
                    {detailAssignedJurors.length}
                  </span>
                </div>
                {detailAssignedJurors.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">No hay jurados asignados aún.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                    {detailAssignedJurors.map((juror: any) => (
                      <li key={juror.id} className="py-2 first:pt-0 last:pb-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{juror.name || `Jurado ${juror.id}`}</p>
                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">Correo: {juror.email || 'Sin correo'}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CrearListaChequeo
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleSaveChecklist}
        editingData={selectedChecklist}
        isEditing={isEditing}
      />

      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar esta lista de chequeo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
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

      {/* Modal para asignar jurados */}
      {juryModalOpen && juryChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="sticky top-0 z-10 border-b border-white/20 bg-gradient-to-r from-[#5cb800] to-[#8fd400] p-5 text-white dark:from-secondary dark:to-blue-900 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Asignar jurados a ficha(s) de la lista
                  </h3>
                  <p className="text-sm text-white/90">
                    Trimestre {juryChecklist.trimester} • {getFormattedStudySheets(juryChecklist.studySheets || '')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
                <input
                  value={jurySearchTerm}
                  onChange={(e) => setJurySearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, documento, especialidad"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-600"
                />

                <select
                  value={jurySpecialtyFilter}
                  onChange={(e) => setJurySpecialtyFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-600"
                >
                  {specialtyOptions.map((option) => (
                    <option key={option} value={option}>{option === 'todos' ? 'Todas las especialidades' : option}</option>
                  ))}
                </select>

                <select
                  value={juryCenterFilter}
                  onChange={(e) => setJuryCenterFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-600"
                >
                  {centerOptions.map((option) => (
                    <option key={option} value={option}>{option === 'todos' ? 'Todos los centros' : option}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-600"
                />

                <input
                  type="time"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-600"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/40">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 text-gray-800 focus:ring-gray-300"
                  />
                  Mostrar solo jurados disponibles en ese horario
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Seleccionados: {selectedJurorIds.length}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredJurors.map((juror) => {
                  const selected = selectedJurorIds.includes(juror.id)
                  const available = isJurorAvailableAtSession(juror.id)
                  return (
                    <button
                      key={juror.id}
                      type="button"
                      onClick={() => handleToggleJurorSelection(juror.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${selected
                        ? 'border-lime-500 bg-lime-100 shadow dark:border-lime-400 dark:bg-lime-900/20'
                        : 'border-gray-200 bg-white hover:border-lime-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-shadowBlue'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{juror.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Doc: {juror.document}</p>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{juror.specialty}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{juror.center}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${available
                            ? 'bg-lime-500 text-white dark:bg-lime-600 dark:text-white'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                            {available ? 'Disponible' : 'Ocupado'}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {filteredJurors.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  No hay jurados que cumplan con los filtros seleccionados.
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  onClick={() => setJuryModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveJuryAssignment}
                  className="rounded-lg bg-gradient-to-r from-lime-600 to-lime-500 px-4 py-2 text-sm font-semibold text-white hover:from-lime-500 hover:to-lime-600 dark:from-shadowBlue dark:to-darkBlue dark:hover:from-darkBlue dark:hover:to-shadowBlue"
                >
                  Guardar asignación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para historial de versiones */}
      {historyModalOpen && historyChecklist && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Historial de versiones
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Lista del trimestre {historyChecklist.trimester} • Versión actual: {historyChecklist.version || 1}
            </p>

            {(historyChecklist.versionHistory || []).length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Esta lista no tiene cambios históricos registrados.
              </div>
            ) : (
              <div className="space-y-3">
                {(historyChecklist.versionHistory || []).slice().reverse().map((entry: any, index: number) => (
                  <div key={`${entry.version}-${entry.changedAt}-${index}`} className="rounded-lg border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-900/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Versión {entry.version}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(entry.changedAt).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-300 mt-2"><span className="font-semibold">Motivo:</span> {entry.changeReason}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
                      <span className="font-semibold">Campos modificados:</span> {(entry.changedFields || []).length > 0 ? entry.changedFields.join(', ') : 'Sin detalle'}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleRestoreVersion(historyChecklist.id, entry)}
                        disabled={isChecklistLocked(historyChecklist)}
                        className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 dark:border-gray-400 text-gray-800 dark:text-blue-300 hover:bg-white-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Restaurar esta versión
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setHistoryModalOpen(false)
                  setHistoryChecklist(null)
                }}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}