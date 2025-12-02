"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PageTitle from "@components/UI/pageTitle"
import { clientLAN } from "@lib/apollo-client"
import {
  GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID,
  ADD_IMPROVEMENT_PLAN_EVALUATION,
  UPDATE_IMPROVEMENT_PLAN_EVALUATION,
} from "@graphql/improvementPlanEvaluationGraph"
import { toast } from "react-toastify"
import { useLoader } from "@context/LoaderContext"

const EvaluatePlanMejoramientoPage = () => {
  const { showLoader, hideLoader } = useLoader()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [improvementPlanId, setImprovementPlanId] = useState<string>("")
  const [evaluationId, setEvaluationId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Estados para los campos de evaluación
  const [pertinence, setPertinence] = useState<boolean>(false)
  const [validity, setValidity] = useState<boolean>(false)
  const [authenticity, setAuthenticity] = useState<boolean>(false)
  const [quality, setQuality] = useState<boolean>(false)
  const [judgment, setJudgment] = useState<boolean>(false)

  useEffect(() => {
    const planId = searchParams.get("planId")
    if (planId) {
      setImprovementPlanId(planId)
      loadExistingEvaluation(planId)
    }
  }, [searchParams])

  const loadExistingEvaluation = async (planId: string) => {
    try {
      const { data } = await clientLAN.query({
        query: GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID,
        variables: { improvementPlanId: Number(planId) },
        fetchPolicy: "no-cache",
      })

      if (data?.improvementPlanEvaluationByImprovementPlanId?.data) {
        const evaluation = data.improvementPlanEvaluationByImprovementPlanId.data
        setEvaluationId(evaluation.id)
        setPertinence(evaluation.pertinence)
        setValidity(evaluation.validity)
        setAuthenticity(evaluation.authenticity)
        setQuality(evaluation.quality)
        setJudgment(evaluation.judgment)
        setIsEditing(true)
      }
    } catch (error) {
      // No hay evaluación existente, se creará una nueva
      console.log("No existe evaluación previa para este plan")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!improvementPlanId) {
      toast.error("No se encontró el ID del plan de mejoramiento")
      return
    }

    const input = {
      pertinence,
      validity,
      authenticity,
      quality,
      judgment,
      improvementPlan: { id: Number(improvementPlanId) },
    }

    try {
      showLoader && showLoader()

      if (isEditing && evaluationId) {
        // Actualizar evaluación existente
        const { data } = await clientLAN.mutate({
          mutation: UPDATE_IMPROVEMENT_PLAN_EVALUATION,
          variables: { id: Number(evaluationId), input },
        })

        if (data?.updateImprovementPlanEvaluation?.code === "200") {
          toast.success("Evaluación actualizada correctamente")
          router.back()
        } else {
          toast.error(data?.updateImprovementPlanEvaluation?.message ?? "Error al actualizar evaluación")
        }
      } else {
        // Crear nueva evaluación
        const { data } = await clientLAN.mutate({
          mutation: ADD_IMPROVEMENT_PLAN_EVALUATION,
          variables: { input },
        })

        if (data?.addImprovementPlanEvaluation?.code === "200") {
          toast.success("Evaluación registrada correctamente")
          router.back()
        } else {
          toast.error(data?.addImprovementPlanEvaluation?.message ?? "Error al registrar evaluación")
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Error en la petición")
    } finally {
      hideLoader && hideLoader()
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <PageTitle onBack={() => router.back()}>
          {isEditing ? "Editar Evaluación - Plan de Mejoramiento" : "Evaluar Plan de Mejoramiento"}
        </PageTitle>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Tabla de Verificación y Valoración de Evidencias */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Verificación y Valoración de Evidencias
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Evalúe cada aspecto del plan de mejoramiento
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      P - Pertinencia
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      V - Vigencia
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      A - Autenticidad
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      C - Calidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-r border-slate-200 px-4 py-6 dark:border-slate-700">
                      <div className="flex gap-6 justify-center">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="pertinence"
                            checked={pertinence === true}
                            onChange={() => setPertinence(true)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500/20 dark:border-slate-500 dark:bg-slate-800 dark:text-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">SÍ</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="pertinence"
                            checked={pertinence === false}
                            onChange={() => setPertinence(false)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-slate-500 dark:bg-slate-800"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">NO</span>
                        </label>
                      </div>
                    </td>
                    <td className="border-r border-slate-200 px-4 py-6 dark:border-slate-700">
                      <div className="flex gap-6 justify-center">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="validity"
                            checked={validity === true}
                            onChange={() => setValidity(true)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500/20 dark:border-slate-500 dark:bg-slate-800 dark:text-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">SÍ</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="validity"
                            checked={validity === false}
                            onChange={() => setValidity(false)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-slate-500 dark:bg-slate-800"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">NO</span>
                        </label>
                      </div>
                    </td>
                    <td className="border-r border-slate-200 px-4 py-6 dark:border-slate-700">
                      <div className="flex gap-6 justify-center">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="authenticity"
                            checked={authenticity === true}
                            onChange={() => setAuthenticity(true)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500/20 dark:border-slate-500 dark:bg-slate-800 dark:text-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">SÍ</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="authenticity"
                            checked={authenticity === false}
                            onChange={() => setAuthenticity(false)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-slate-500 dark:bg-slate-800"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">NO</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex gap-6 justify-center">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="quality"
                            checked={quality === true}
                            onChange={() => setQuality(true)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500/20 dark:border-slate-500 dark:bg-slate-800 dark:text-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">SÍ</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="quality"
                            checked={quality === false}
                            onChange={() => setQuality(false)}
                            className="h-4 w-4 cursor-pointer border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-slate-500 dark:bg-slate-800"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">NO</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Juicio de Valor */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Juicio de Valor</h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Decisión final sobre el plan de mejoramiento
              </p>
            </div>

            <div className="p-6">
              <div className="flex gap-8 justify-center">
                <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-6 py-4 transition-all duration-200 hover:shadow-sm active:scale-[0.98] dark:border-slate-700 dark:hover:border-green-500 has-[:checked]:border-green-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-green-50 has-[:checked]:to-emerald-50 has-[:checked]:shadow-sm dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-900/30">
                  <input
                    type="radio"
                    name="judgment"
                    checked={judgment === true}
                    onChange={() => setJudgment(true)}
                    className="h-5 w-5 cursor-pointer border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500/20 dark:border-slate-500 dark:bg-slate-800 dark:text-blue-500"
                  />
                  <span className="text-base font-semibold text-green-700 dark:text-blue-400">APROBADO</span>
                </label>
                <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-6 py-4 transition-all duration-200 hover:shadow-sm active:scale-[0.98] dark:border-slate-700 dark:hover:border-red-500 has-[:checked]:border-red-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-red-50 has-[:checked]:to-red-50 has-[:checked]:shadow-sm dark:has-[:checked]:border-red-500 dark:has-[:checked]:bg-red-900/20">
                  <input
                    type="radio"
                    name="judgment"
                    checked={judgment === false}
                    onChange={() => setJudgment(false)}
                    className="h-5 w-5 cursor-pointer border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-slate-500 dark:bg-slate-800"
                  />
                  <span className="text-base font-semibold text-red-700 dark:text-red-400">NO APROBADO</span>
                </label>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
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
              className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-md active:scale-[0.98] dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
            >
              {isEditing ? "Actualizar Evaluación" : "Guardar Evaluación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EvaluatePlanMejoramientoPage
