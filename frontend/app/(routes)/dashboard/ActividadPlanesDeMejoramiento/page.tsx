"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PageTitle from "@components/UI/pageTitle"
import { clientLAN } from "@lib/apollo-client"
import {
  GET_ALL_IMPROVEMENT_PLAN_EVIDENCE_TYPES,
  GET_ALL_IMPROVEMENT_PLAN_DELIVERIES,
  GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES,
} from "@graphql/improvementPlanActivityGraph"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@redux/store"
import { fetchImprovementPlans } from "@slice/improvementPlanSlice"
import { fetchImprovementPlanActivities, addImprovementPlanActivity } from "@slice/improvementPlanActivitySlice"
import { toast } from "react-toastify"
import { useLoader } from "@context/LoaderContext"

const AddImprovementPlanActivityPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { showLoader, hideLoader } = useLoader()
  const router = useRouter()

  const improvementPlansState = useSelector((state: any) => state.improvementPlan)
  const activityState = useSelector((state: any) => state.improvementPlanActivity)

  const [description, setDescription] = useState("")
  const [objectives, setObjectives] = useState("")
  const [conclusions, setConclusions] = useState("")
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [improvementPlanId, setImprovementPlanId] = useState<string>("")
  const searchParams = useSearchParams()
  
  // Capturar parámetros de ficha para preservar el contexto
  const [studySheetParams, setStudySheetParams] = useState<{
    studySheetId?: string;
    ficha?: string;
    studentIds?: string;
  }>({});

  useEffect(() => {
    const planIdParam = searchParams.get("planId") || searchParams.get("improvementPlanId")
    if (planIdParam) setImprovementPlanId(String(planIdParam))
    
    // Capturar parámetros de ficha si existen
    const studySheetId = searchParams.get("studySheetId")
    const ficha = searchParams.get("ficha")
    const studentIds = searchParams.get("studentIds")
    
    if (studySheetId || ficha) {
      setStudySheetParams({
        studySheetId: studySheetId || undefined,
        ficha: ficha || undefined,
        studentIds: studentIds || undefined
      })
      console.log('📋 Parámetros de ficha capturados:', { studySheetId, ficha, studentIds })
    }
  }, [searchParams])

  const [deliveryId, setDeliveryId] = useState<string>("")
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([])
  const [activitiesCount, setActivitiesCount] = useState<number>(0)

  useEffect(() => {
    // NO cargar todos los planes sin filtro - esto causa el flash de datos no filtrados
    // dispatch(fetchImprovementPlans({ page: 0, size: 200 }))
    dispatch(fetchImprovementPlanActivities({ page: 0, size: 200 }))
    ;(async () => {
      try {
        const { data } = await clientLAN.query({
          query: GET_ALL_IMPROVEMENT_PLAN_EVIDENCE_TYPES,
          variables: { page: 0, size: 200 },
          fetchPolicy: "no-cache",
        })
        const items = data?.allImprovementPlanEvidenceTypes?.data || []
        if (items && items.length > 0) setGlobalEvidenceTypes(items.map((it: any) => ({ id: it.id, name: it.name })))
      } catch (err) {
        // ignore
      }
    })()
    ;(async () => {
      try {
        const { data } = await clientLAN.query({
          query: GET_ALL_IMPROVEMENT_PLAN_DELIVERIES,
          variables: { page: 0, size: 200 },
          fetchPolicy: "no-cache",
        })
        const items = data?.allImprovementPlanDeliveries?.data || []
        if (items && items.length > 0)
          setGlobalDeliveries(items.map((it: any) => ({ id: it.id, deliveryFormat: it.deliveryFormat })))
      } catch (err) {
        // ignore
      }
    })()
  }, [dispatch])

  useEffect(() => {
    if (improvementPlanId) {
      dispatch(fetchImprovementPlanActivities({ page: 0, size: 200, id: Number(improvementPlanId) }))
    }
  }, [dispatch, improvementPlanId])

  // cuando cambia el plan seleccionado, obtener el conteo de actividades existentes
  useEffect(() => {
    const fetchCount = async () => {
      if (!improvementPlanId) {
        setActivitiesCount(0)
        return
      }
      try {
        const planIdNumber = Number(improvementPlanId)
        console.log(`🔍 Buscando actividades para el plan ID: ${planIdNumber}`)
        
        const { data } = await clientLAN.query({
          query: GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES,
          variables: { page: 0, size: 200, id: planIdNumber },
          fetchPolicy: "no-cache",
        })
        
        const allItems = data?.allImprovementPlanActivities?.data || []
        console.log(`📦 Total de actividades recibidas del backend:`, allItems.length)
        console.log(`📋 Actividades completas:`, allItems)
        
        // Filtrar manualmente las actividades que pertenecen a este plan específico
        const filteredItems = allItems.filter((activity: any) => {
          const activityPlanId = activity?.improvementPlan?.id
          console.log(`  - Actividad ${activity.id}: Plan ID = ${activityPlanId}`)
          return Number(activityPlanId) === planIdNumber
        })
        
        const count = filteredItems.length
        console.log(`✅ Actividades filtradas para el plan ${planIdNumber}: ${count}`)
        setActivitiesCount(count)
      } catch (err) {
        console.error('❌ Error al obtener conteo de actividades:', err)
        setActivitiesCount(0)
      }
    }
    fetchCount()
  }, [improvementPlanId])

  const capturedRef = React.useRef(false)
  const [globalDeliveries, setGlobalDeliveries] = useState<any[]>([])
  const [globalEvidenceTypes, setGlobalEvidenceTypes] = useState<any[]>([])
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false)

  const improvementPlans = improvementPlansState?.data || []
  const deliveries = React.useMemo(() => activityState?.deliveries || [], [activityState?.deliveries])
  const evidenceTypes = React.useMemo(() => activityState?.evidenceTypes || [], [activityState?.evidenceTypes])

  useEffect(() => {
    if (!capturedRef.current) {
      if ((deliveries && deliveries.length > 0) || (evidenceTypes && evidenceTypes.length > 0)) {
        setGlobalDeliveries(deliveries || [])
        setGlobalEvidenceTypes(evidenceTypes || [])
        capturedRef.current = true
      }
    }
  }, [deliveries, evidenceTypes])

  // prevenir navegación si el plan seleccionado no tiene al menos 1 actividad
  useEffect(() => {
    const shouldPrevent = Boolean(improvementPlanId) && activitiesCount === 0
    setPreventNavigation(shouldPrevent)

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    const popstateHandler = (e: PopStateEvent) => {
      if (shouldPrevent) {
        const confirmed = window.confirm('Este plan no tiene actividades. ¿Seguro que desea salir sin registrar al menos una actividad?')
        if (!confirmed) {
          // volver a retroceder la navegación para permanecer en la página
          history.pushState(null, document.title, window.location.href)
        }
      }
    }

    window.addEventListener('beforeunload', beforeUnloadHandler)
    window.addEventListener('popstate', popstateHandler)

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      window.removeEventListener('popstate', popstateHandler)
    }
  }, [improvementPlanId, activitiesCount])

  const displayDeliveries = globalDeliveries && globalDeliveries.length > 0 ? globalDeliveries : deliveries || []
  const displayEvidenceTypes =
    globalEvidenceTypes && globalEvidenceTypes.length > 0 ? globalEvidenceTypes : evidenceTypes || []

  const toggleEvidence = (id: string) => {
    setSelectedEvidenceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectDelivery = (id: string) => {
    setDeliveryId(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      toast.error("La descripción es obligatoria")
      return
    }
    if (!deliveryDate) {
      toast.error("La fecha de entrega es obligatoria")
      return
    }
    if (!improvementPlanId) {
      toast.error("Seleccione un plan de mejoramiento")
      return
    }
    if (!deliveryId) {
      toast.error("Seleccione un tipo de entrega")
      return
    }


    // validar límite máximo de actividades por plan (máximo 3)
    console.log(`Validando actividades. Contador actual: ${activitiesCount}`)
    if (activitiesCount >= 3) {
      toast.error("No puede registrar más de 3 actividades para este plan de mejoramiento")
      return
    }

    const input = {
      description: description.trim(),
      objectives: objectives.trim() || null,
      conclusions: conclusions.trim() || null,
      deliveryDate,
      improvementPlan: { id: Number(improvementPlanId) },
      improvementPlanDelivery: { id: Number(deliveryId) },
      evidenceTypes: selectedEvidenceIds.map((id) => ({ id: Number(id) })),
    }

    try {
      showLoader && showLoader()
      const res = await dispatch(addImprovementPlanActivity(input)).unwrap()
      hideLoader && hideLoader()
      if (res?.code === "200") {
        toast.success("Actividad registrada correctamente")
        // actualizar contador local
        const newCount = activitiesCount + 1
        setActivitiesCount(newCount)
        console.log(`Actividad registrada. Nuevo contador: ${newCount}`)
        
        // Redirigir al historial preservando los parámetros de ficha
        let historialUrl = "/dashboard/HistorialPlanesMejoramientoInstructor"
        const params = new URLSearchParams()
        
        if (studySheetParams.studySheetId) {
          params.set('studySheetId', studySheetParams.studySheetId)
        }
        if (studySheetParams.ficha) {
          params.set('ficha', studySheetParams.ficha)
        }
        if (studySheetParams.studentIds) {
          params.set('studentIds', studySheetParams.studentIds)
        }
        
        if (params.toString()) {
          historialUrl += `?${params.toString()}`
        }
        
        console.log('🔄 Redirigiendo a:', historialUrl)
        router.push(historialUrl)
      } else {
        toast.error(res?.message ?? "Error al registrar actividad")
      }
    } catch (error: any) {
      hideLoader && hideLoader()
      toast.error(error?.message || "Error en la petición")
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <PageTitle onBack={() => router.back()}>Registrar Actividad - Plan de Mejoramiento</PageTitle>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Information Section */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Información Principal</h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Proporcione los detalles fundamentales de la actividad
              </p>
            </div>

            <div className="space-y-5 p-5">
              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400"
                  rows={4}
                  placeholder="Describa detalladamente la actividad a realizar..."
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="objectives" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Objetivos
                  </label>
                  <textarea
                    id="objectives"
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400"
                    rows={3}
                    placeholder="Defina los objetivos que se esperan alcanzar..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="conclusions" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Conclusiones
                  </label>
                  <textarea
                    id="conclusions"
                    value={conclusions}
                    onChange={(e) => setConclusions(e.target.value)}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400"
                    rows={3}
                    placeholder="Registre las conclusiones obtenidas..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Configuration Section */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Configuración de Entrega</h2>
            </div>

            <div className="space-y-5 p-5">
              {improvementPlanId ? (
                <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-blue-700 dark:bg-gradient-to-r dark:from-blue-900/20 dark:to-blue-800/20">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 dark:text-blue-100">
                        Plan de Mejoramiento
                      </p>
                      <p className="mt-1 text-sm text-green-700 dark:text-blue-200">
                        Actividades registradas: <span className="font-semibold">{activitiesCount} de 3</span>
                        {activitiesCount >= 3 ? (
                          <span className="ml-2 text-red-600 dark:text-red-400 font-medium">⚠️ Límite alcanzado</span>
                        ) : (
                          <span className="ml-2">• Puede agregar {3 - activitiesCount} más</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    ⚠️ No se pudo identificar el plan de mejoramiento. Por favor, regrese al historial y seleccione un plan.
                  </p>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-[auto_1fr]">
                <div className="space-y-1.5">
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Fecha de Entrega <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:focus:border-blue-400"
                    required
                  />
                </div>

                {/* Tipo de Entrega con Radio Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Tipo de Entrega <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 justify-center">
                    {displayDeliveries?.map((d: any) => (
                      <label
                        key={d.id}
                        className={`group relative flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
                          deliveryId === String(d.id)
                            ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm dark:border-blue-500 dark:bg-blue-900/30"
                            : "border-slate-200 bg-white hover:border-green-300 hover:bg-green-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryId === String(d.id)}
                          onChange={() => selectDelivery(String(d.id))}
                          className="h-4 w-4 shrink-0 cursor-pointer border-slate-300 text-green-600 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500/20 group-hover:scale-110 dark:border-slate-500 dark:bg-slate-800 dark:text-blue-500"
                        />
                        <span
                          className={`text-sm transition-colors duration-200 ${
                            deliveryId === String(d.id)
                              ? "font-medium text-green-700 dark:text-blue-400"
                              : "text-slate-700 group-hover:text-green-700 dark:text-slate-300 dark:group-hover:text-blue-400"
                          }`}
                        >
                          {d.deliveryFormat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Types Section */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tipos de Evidencia</h2>
            </div>

            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayEvidenceTypes?.map((ev: any) => (
                  <label
                    key={ev.id}
                    className="group relative flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvidenceIds.includes(String(ev.id))}
                      onChange={() => toggleEvidence(String(ev.id))}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 group-hover:scale-110 dark:border-slate-600 dark:bg-slate-900"
                    />
                    <span className="text-sm leading-tight text-slate-700 transition-colors duration-200 group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-300">
                      {ev.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                if (preventNavigation) {
                  const ok = window.confirm('Este plan no tiene actividades. ¿Seguro que desea salir sin registrar al menos una actividad?')
                  if (!ok) return
                }
                router.back()
              }}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!improvementPlanId || activitiesCount >= 3}
              className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-md active:scale-[0.98] dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 dark:disabled:hover:from-blue-600 dark:disabled:hover:to-blue-700"
            >
              {activitiesCount >= 3 ? 'Límite de actividades alcanzado' : 'Registrar Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddImprovementPlanActivityPage