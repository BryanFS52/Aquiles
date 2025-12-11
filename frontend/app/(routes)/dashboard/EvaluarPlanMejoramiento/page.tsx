"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PageTitle from "@components/UI/pageTitle"
import { client } from "@lib/apollo-client"
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
      const { data } = await client.query({
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
        const { data } = await client.mutate({
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
        const { data } = await client.mutate({
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

  const EvaluationOption = ({ name, value, onChange, checked }: any) => (
    <div className="flex items-center justify-center gap-3 sm:gap-8">
      <label className="group relative flex cursor-pointer items-center gap-2 sm:gap-3">
        <input
          type="radio"
          name={name}
          checked={checked === true}
          onChange={() => onChange(true)}
          className="peer sr-only"
        />
        <div className="flex h-9 w-16 sm:h-11 sm:w-20 items-center justify-center rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white transition-all peer-checked:border-emerald-500 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500 peer-checked:shadow-sm group-hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:peer-checked:border-blue-500 dark:peer-checked:from-blue-500 dark:peer-checked:to-blue-600 dark:group-hover:border-blue-400">
          <span className="text-sm sm:text-base font-bold text-slate-600 transition-colors peer-checked:text-white dark:text-slate-300 dark:peer-checked:text-white">
            SÍ
          </span>
        </div>
      </label>
      <label className="group relative flex cursor-pointer items-center gap-2 sm:gap-3">
        <input
          type="radio"
          name={name}
          checked={checked === false}
          onChange={() => onChange(false)}
          className="peer sr-only"
        />
        <div className="flex h-9 w-16 sm:h-11 sm:w-20 items-center justify-center rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white transition-all peer-checked:border-rose-500 peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-red-500 peer-checked:shadow-sm group-hover:border-rose-300 dark:border-slate-700 dark:bg-slate-800 dark:peer-checked:border-rose-500 dark:peer-checked:from-rose-500 dark:peer-checked:to-rose-600 dark:group-hover:border-rose-400">
          <span className="text-sm sm:text-base font-bold text-slate-600 transition-colors peer-checked:text-white dark:text-slate-300 dark:peer-checked:text-white">
            NO
          </span>
        </div>
      </label>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 py-4 sm:py-8">
        <PageTitle onBack={() => router.back()}>
          {isEditing ? "Editar Evaluación" : "Nueva Evaluación"}
        </PageTitle>

        <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
          {/* Evaluación Completa */}
          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-800 dark:shadow-slate-900/30">
            <div className="border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-5 dark:border-slate-700/50">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Criterios de Evaluación
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Evalúe cada criterio según las evidencias presentadas
              </p>
            </div>

            <div className="p-3 sm:p-6">
              <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Pertinencia */}
                <div className="group rounded-lg sm:rounded-xl border border-slate-200/60 p-3 sm:p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700/50 dark:hover:border-slate-600">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Pertinencia
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-gray-600 dark:text-slate-400">
                      ¿Es relevante para el objetivo?
                    </p>
                  </div>
                  <EvaluationOption
                    name="pertinence"
                    value={pertinence}
                    onChange={setPertinence}
                    checked={pertinence}
                  />
                </div>

                {/* Vigencia */}
                <div className="group rounded-lg sm:rounded-xl border border-slate-200/60 p-3 sm:p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700/50 dark:hover:border-slate-600">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Vigencia
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-gray-600 dark:text-slate-400">
                      ¿Está actualizado y vigente?
                    </p>
                  </div>
                  <EvaluationOption
                    name="validity"
                    value={validity}
                    onChange={setValidity}
                    checked={validity}
                  />
                </div>

                {/* Autenticidad */}
                <div className="group rounded-lg sm:rounded-xl border border-slate-200/60 p-3 sm:p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700/50 dark:hover:border-slate-600">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Autenticidad
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-gray-600 dark:text-slate-400">
                      ¿Es genuino y verificable?
                    </p>
                  </div>
                  <EvaluationOption
                    name="authenticity"
                    value={authenticity}
                    onChange={setAuthenticity}
                    checked={authenticity}
                  />
                </div>

                {/* Calidad */}
                <div className="group rounded-lg sm:rounded-xl border border-slate-200/60 p-3 sm:p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700/50 dark:hover:border-slate-600">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Calidad
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-gray-600 dark:text-slate-400">
                      ¿Cumple con los estándares?
                    </p>
                  </div>
                  <EvaluationOption
                    name="quality"
                    value={quality}
                    onChange={setQuality}
                    checked={quality}
                  />
                </div>

                {/* Juicio Evaluativo */}
                <div className="group relative rounded-lg sm:rounded-xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-3 sm:p-4 shadow-lg shadow-emerald-200/40 transition-all hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-300/50 dark:border-blue-400/60 dark:from-blue-900/10 dark:to-blue-900/10 dark:shadow-blue-900/20 dark:hover:border-blue-500">
                  <div className="absolute -right-1 sm:-right-2 -top-1 sm:-top-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/50 dark:from-blue-400 dark:to-blue-600 dark:shadow-blue-500/50">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="mb-2 sm:mb-3 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Juicio Evaluativo
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs font-medium text-gray-800 dark:text-white/90">
                      ¿Aprueba el plan de mejoramiento?
                    </p>
                  </div>
                  <div className="flex flex-col items-stretch justify-center gap-1.5 sm:gap-2">
                    <label className="group/label relative cursor-pointer">
                      <input
                        type="radio"
                        name="judgment"
                        checked={judgment === true}
                        onChange={() => setJudgment(true)}
                        className="peer sr-only"
                      />
                      <div className="relative flex min-h-[36px] sm:min-h-[40px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm transition-all peer-checked:border-emerald-500 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500 peer-checked:shadow-md peer-checked:shadow-emerald-500/30 group-hover/label:border-emerald-400 group-hover/label:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:peer-checked:border-blue-500 dark:peer-checked:from-blue-500 dark:peer-checked:to-blue-600 dark:peer-checked:shadow-blue-500/20 dark:group-hover/label:border-blue-400">
                        <svg className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-white mr-1.5 sm:mr-2 transition-all ${judgment === true ? 'opacity-100' : 'opacity-0 w-0 mr-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-sm sm:text-base font-extrabold leading-none transition-colors ${judgment === true ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          APROBADO
                        </span>
                      </div>
                    </label>
                    <label className="group/label relative cursor-pointer">
                      <input
                        type="radio"
                        name="judgment"
                        checked={judgment === false}
                        onChange={() => setJudgment(false)}
                        className="peer sr-only"
                      />
                      <div className="relative flex min-h-[36px] sm:min-h-[40px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm transition-all peer-checked:border-rose-500 peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-red-500 peer-checked:shadow-md peer-checked:shadow-rose-500/30 group-hover/label:border-rose-400 group-hover/label:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:peer-checked:from-rose-500 dark:peer-checked:to-rose-600 dark:peer-checked:shadow-rose-500/20 dark:group-hover/label:border-rose-400">
                        <svg className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-white mr-1.5 sm:mr-2 transition-all ${judgment === false ? 'opacity-100' : 'opacity-0 w-0 mr-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className={`text-sm sm:text-base font-extrabold leading-none transition-colors ${judgment === false ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          REPROBADO
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col-reverse gap-2 sm:gap-3 pt-2 sm:pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.97] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-750"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg sm:rounded-xl bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.97] dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-blue-500"
            >
              {isEditing ? "Actualizar Evaluación" : "Guardar Evaluación"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvaluatePlanMejoramientoPage