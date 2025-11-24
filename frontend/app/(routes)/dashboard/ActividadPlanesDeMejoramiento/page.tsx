"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PageTitle from "@components/UI/pageTitle"
import { clientLAN } from "@lib/apollo-client"
import { GET_ALL_IMPROVEMENT_PLAN_EVIDENCE_TYPES } from "@graphql/improvementPlanActivityGraph"
import { GET_ALL_IMPROVEMENT_PLAN_DELIVERIES } from "@graphql/improvementPlanActivityGraph"
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

  useEffect(() => {
    const planIdParam = searchParams.get("planId") || searchParams.get("improvementPlanId")
    if (planIdParam) setImprovementPlanId(String(planIdParam))
  }, [searchParams])

  const [deliveryId, setDeliveryId] = useState<string>("")
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchImprovementPlans({ page: 0, size: 200 }))
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

  const capturedRef = React.useRef(false)
  const [globalDeliveries, setGlobalDeliveries] = useState<any[]>([])
  const [globalEvidenceTypes, setGlobalEvidenceTypes] = useState<any[]>([])

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
        setDescription("")
        setObjectives("")
        setConclusions("")
        setSelectedEvidenceIds([])
        setDeliveryDate(new Date().toISOString().split("T")[0])
        setImprovementPlanId("")
        setDeliveryId("")
        router.push("/dashboard/HistorialPlanesMejoramientoInstructor")
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
      <div className="mx-auto max-w-4xl px-4 py-6">
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
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400"
                  rows={4}
                  placeholder="Describa detalladamente la actividad a realizar..."
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="objectives" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Objetivos
                  </label>
                  <textarea
                    id="objectives"
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400"
                    rows={3}
                    placeholder="Defina los objetivos que se esperan alcanzar..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="conclusions" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Conclusiones
                  </label>
                  <textarea
                    id="conclusions"
                    value={conclusions}
                    onChange={(e) => setConclusions(e.target.value)}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400"
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
              {!improvementPlanId && (
                <div className="space-y-1.5">
                  <label htmlFor="plan" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Plan de Mejoramiento <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="plan"
                    value={improvementPlanId}
                    onChange={(e) => setImprovementPlanId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:focus:border-blue-400"
                    required
                  >
                    <option value="">Seleccione un plan</option>
                    {improvementPlans?.data?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.reason || `Plan ${p.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
                <div className="space-y-1.5">
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Fecha de Entrega <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:focus:border-blue-400"
                    required
                  />
                </div>

                {/* Tipo de Entrega con Radio Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tipo de Entrega <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayDeliveries?.map((d: any) => (
                      <label
                        key={d.id}
                        className={`group relative flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
                          deliveryId === String(d.id)
                            ? "border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/30"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryId === String(d.id)}
                          onChange={() => selectDelivery(String(d.id))}
                          className="h-4 w-4 shrink-0 cursor-pointer border-slate-300 text-blue-600 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 group-hover:scale-110 dark:border-slate-600 dark:bg-slate-900"
                        />
                        <span
                          className={`text-sm transition-colors duration-200 ${
                            deliveryId === String(d.id)
                              ? "font-medium text-blue-700 dark:text-blue-300"
                              : "text-slate-700 group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-300"
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
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Registrar Actividad
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddImprovementPlanActivityPage