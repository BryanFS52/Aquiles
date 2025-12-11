"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageTitle from "@components/UI/pageTitle";
import Loader from "@components/UI/Loader";
import { Card } from "@components/UI/Card";
import { clientLAN } from "@lib/apollo-client";
import { GET_IMPROVEMENT_PLAN_BY_ID } from "@graphql/improvementPlanGraph";
import { GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES } from "@graphql/improvementPlanActivityGraph";
import { GET_LEARNING_OUTCOMES_BY_COMPETENCE } from "@graphql/olympo/studySheetGraph";
import { GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID } from "@graphql/improvementPlanEvaluationGraph";

export default function DetallePlanPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const planIdParam = searchParams.get("id") || searchParams.get("improvementPlanId") || null;
	const planId = planIdParam ? Number(planIdParam) : null;

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [plan, setPlan] = useState<any | null>(null);
	const [activities, setActivities] = useState<any[]>([]);
	const [learningOutcomeName, setLearningOutcomeName] = useState<string | null>(null);
	const [evaluation, setEvaluation] = useState<any | null>(null);

	useEffect(() => {
		const load = async () => {
			if (!planId) return;
			setLoading(true);
			setError(null);
			try {
				const [pRes, aRes] = await Promise.all([
					clientLAN.query({ query: GET_IMPROVEMENT_PLAN_BY_ID, variables: { id: planId }, fetchPolicy: "no-cache" }),
					clientLAN.query({ query: GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES, variables: { id: planId, page: 0, size: 200 }, fetchPolicy: "no-cache" }),
				]);

				const p = pRes?.data?.improvementPlanById?.data ?? null;
				let a = aRes?.data?.allImprovementPlanActivities?.data ?? [];
				// filter and dedupe client-side
				a = a.filter((act: any) => Number(act?.improvementPlan?.id) === Number(planId));
				const map = new Map();
				const uniq: any[] = [];
				for (const it of a) {
					if (!map.has(it.id)) {
						map.set(it.id, true);
						uniq.push(it);
					}
				}

				setPlan(p);
				setActivities(uniq);

				// Fetch evaluation
				try {
					const evalRes = await clientLAN.query({
						query: GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID,
						variables: { improvementPlanId: planId },
						fetchPolicy: "no-cache",
					});
					const evalData = evalRes?.data?.improvementPlanEvaluationByImprovementPlanId?.data ?? null;
					setEvaluation(evalData);
				} catch (err) {
					console.error("Error fetching evaluation:", err);
					setEvaluation(null);
				}

				// fetch learning outcome name
				try {
					const competenceId = p?.teacherCompetence?.competence?.id;
					const outcomeId = p?.learningOutcome?.id ?? p?.learningOutcome;
					if (competenceId && outcomeId) {
						const loRes = await clientLAN.query({
							query: GET_LEARNING_OUTCOMES_BY_COMPETENCE,
							variables: { idCompetence: Number(competenceId), page: 0, size: 200 },
							fetchPolicy: "no-cache",
						});
						const items = loRes?.data?.allLearningOutcomes?.data || [];
						const found = items.find((it: any) => Number(it.id) === Number(outcomeId));
						setLearningOutcomeName(found ? found.name ?? String(found.id) : null);
					} else {
						setLearningOutcomeName(null);
					}
				} catch (err) {
					console.error("Error fetching learning outcome name:", err);
					setLearningOutcomeName(null);
				}
			} catch (err: any) {
				console.error("Error cargando detalle de plan:", err);
				const message = err?.message || (err && JSON.stringify(err)) || "Error desconocido";
				setError(String(message));
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [planId]);

	if (!planId) {
		return (
			<div className="mx-auto px-4 py-8 animate-fade-in">
				<PageTitle onBack={() => router.back()}>Detalle Plan de Mejoramiento</PageTitle>
				<div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
					<div className="flex items-center justify-center gap-3 text-gray-500">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<span className="text-lg font-medium">No se encontró el identificador del plan en la URL</span>
					</div>
				</div>
			</div>
		);
	}

	if (loading) return <Loader />;

	if (error) {
		return (
			<div className="mx-auto px-4 py-8 animate-fade-in">
				<PageTitle onBack={() => router.back()}>Detalle Plan de Mejoramiento</PageTitle>
				<div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200 shadow-lg">
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<div className="flex-1">
							<h3 className="text-red-800 font-bold text-lg mb-2">Error cargando datos</h3>
							<p className="text-sm text-red-700 leading-relaxed">{error}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto px-4 py-8 animate-fade-in">
			<PageTitle onBack={() => router.back()}>Detalle Plan de Mejoramiento</PageTitle>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
				<div className="lg:col-span-2">
					<div className="transform transition-all duration-500 hover:scale-[1.005] h-full">
						<Card
							className="h-full"
						header={
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-r from-lightGreen to-primary dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Información del plan</h2>
							</div>
						}
						body={
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Acta / Número</p>
										<p className="font-semibold text-gray-800 dark:text-white">{plan?.actNumber ?? "-"}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Ciudad</p>
										<p className="font-semibold text-gray-800 dark:text-white">{plan?.city ?? "-"}</p>
										</div>
									</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Fecha</p>
										<p className="font-semibold text-gray-800 dark:text-white">{plan?.date ?? "-"}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Horario</p>
										<p className="font-semibold text-gray-800 dark:text-white">{(plan?.startTime ?? "-") + (plan?.endTime ? ` - ${plan.endTime}` : "")}</p>
										</div>
									</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Lugar</p>
										<p className="font-semibold text-gray-800 dark:text-white">{plan?.place ?? "-"}</p>
									</div>
							<div>
								<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Estudiante</p>
								<p className="font-semibold text-gray-800 dark:text-white">{plan?.student?.person ? `${plan.student.person.name} ${plan.student.person.lastname}` : "-"}</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Documento</p>
									<p className="font-semibold text-gray-800 dark:text-white">{plan?.student?.person?.document ?? "Sin documento"}</p>
								</div>
							</div>

							<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent my-4" />

							<div>
								<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Motivo / Observaciones</p>
							<p className="text-lg leading-relaxed text-gray-800 dark:text-white font-medium">{plan?.reason ?? "-"}</p>
						</div>								{plan?.improvementPlanFile && plan.improvementPlanFile.length > 0 && (
								<div>
									<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Archivo adjunto</p>
									<button
										onClick={() => {
											try {
												// GraphQL devuelve byte[] como Base64 String
												const base64String = plan.improvementPlanFile as string;
												const byteCharacters = atob(base64String);
												const byteNumbers = new Array(byteCharacters.length);
												for (let i = 0; i < byteCharacters.length; i++) {
													byteNumbers[i] = byteCharacters.charCodeAt(i);
												}
												const byteArray = new Uint8Array(byteNumbers);
												
												const blob = new Blob([byteArray], { type: 'application/pdf' });
												const url = window.URL.createObjectURL(blob);
												const link = document.createElement('a');
												link.href = url;
												link.download = `plan_mejoramiento_${plan.actNumber || plan.id}.pdf`;
												link.click();
												window.URL.revokeObjectURL(url);
											} catch (error) {
												console.error('Error al descargar:', error);
											}
										}}
										className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-colors duration-200"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										Descargar archivo
									</button>
								</div>
							)}
								</div>
							}
						/>
					</div>
				</div>

				<aside className="lg:col-span-1">
					<div className="transform transition-all duration-500 hover:scale-[1.005] h-full">
						<Card
							className="h-full"
					header={
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-lightGreen to-primary dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
								</svg>
							</div>
							<h4 className="text-2xl font-bold text-gray-800 dark:text-white">Información adicional</h4>
						</div>
					}
							body={
							<div className="space-y-4">
								<div>
									<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Competencia docente</p>
									<p className="font-semibold text-gray-800 dark:text-white">{plan?.teacherCompetence?.competence?.name ?? "-"}</p>
								</div>

								<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

								<div>
									<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Resultado de aprendizaje</p>
									<p className="font-semibold text-gray-800 dark:text-white">{learningOutcomeName ?? (plan?.learningOutcome?.id ?? plan?.learningOutcome ?? "-")}</p>
									</div>

								<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

								<div>
									<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Tipo de falta</p>
									<p className="font-semibold text-gray-800 dark:text-white">{plan?.faultType?.name ?? "-"}</p>
								</div>

								<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

								<div>
									<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Estado</p>
									<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border ${plan?.state ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'}`}>
										<svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
											<circle cx="4" cy="4" r="3" />
										</svg>
											{plan?.state ? 'Activo' : 'Inactivo'}
										</span>
									</div>
								</div>
							}
						/>
					</div>
				</aside>

				{/* Sección de Evaluación */}
				<div className="lg:col-span-3">
					<div className="transform transition-all duration-500 hover:scale-[1.005]">
						<Card
							header={
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-r from-lightGreen to-primary dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Evaluación del Plan</h2>
								</div>
							}
							body={
								evaluation ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{/* Pertinencia */}
										<div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
											<div className="flex items-start justify-between mb-3">
												<div>
													<p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Pertinencia</p>
													<p className="text-xs text-gray-500 dark:text-slate-400">¿Es relevante para el objetivo?</p>
												</div>
												<div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
													evaluation.pertinence 
														? 'bg-emerald-100 dark:bg-emerald-500/20' 
														: 'bg-red-100 dark:bg-red-500/20'
												}`}>
													{evaluation.pertinence ? (
														<svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
													) : (
														<svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
														</svg>
													)}
												</div>
											</div>
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
												evaluation.pertinence
													? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
													: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
											}`}>
												{evaluation.pertinence ? 'Sí' : 'No'}
											</span>
										</div>

										{/* Vigencia */}
										<div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
											<div className="flex items-start justify-between mb-3">
												<div>
													<p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Vigencia</p>
													<p className="text-xs text-gray-500 dark:text-slate-400">¿Está actualizado y vigente?</p>
												</div>
												<div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
													evaluation.validity 
														? 'bg-emerald-100 dark:bg-emerald-500/20' 
														: 'bg-red-100 dark:bg-red-500/20'
												}`}>
													{evaluation.validity ? (
														<svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
													) : (
														<svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
														</svg>
													)}
												</div>
											</div>
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
												evaluation.validity
													? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
													: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
											}`}>
												{evaluation.validity ? 'Sí' : 'No'}
											</span>
										</div>

										{/* Autenticidad */}
										<div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
											<div className="flex items-start justify-between mb-3">
												<div>
													<p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Autenticidad</p>
													<p className="text-xs text-gray-500 dark:text-slate-400">¿Es genuino y verificable?</p>
												</div>
												<div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
													evaluation.authenticity 
														? 'bg-emerald-100 dark:bg-emerald-500/20' 
														: 'bg-red-100 dark:bg-red-500/20'
												}`}>
													{evaluation.authenticity ? (
														<svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
													) : (
														<svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
														</svg>
													)}
												</div>
											</div>
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
												evaluation.authenticity
													? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
													: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
											}`}>
												{evaluation.authenticity ? 'Sí' : 'No'}
											</span>
										</div>

										{/* Calidad */}
										<div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
											<div className="flex items-start justify-between mb-3">
												<div>
													<p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Calidad</p>
													<p className="text-xs text-gray-500 dark:text-slate-400">¿Cumple con los estándares?</p>
												</div>
												<div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
													evaluation.quality 
														? 'bg-emerald-100 dark:bg-emerald-500/20' 
														: 'bg-red-100 dark:bg-red-500/20'
												}`}>
													{evaluation.quality ? (
														<svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
													) : (
														<svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
														</svg>
													)}
												</div>
											</div>
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
												evaluation.quality
													? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
													: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
											}`}>
												{evaluation.quality ? 'Sí' : 'No'}
											</span>
										</div>

										{/* Juicio Evaluativo */}
										<div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border-2 border-emerald-200 dark:border-blue-500/30 md:col-span-2 lg:col-span-1">
											<div className="flex items-start justify-between mb-3">
												<div>
													<p className="text-sm font-bold text-emerald-900 dark:text-white mb-1">Juicio Evaluativo</p>
													<p className="text-xs text-emerald-700 dark:text-blue-400">Decisión final del plan</p>
												</div>
												<div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
													evaluation.judgment 
														? 'bg-emerald-500 dark:bg-blue-500' 
														: 'bg-red-500 dark:bg-red-600'
												}`}>
													{evaluation.judgment ? (
														<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
													) : (
														<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
														</svg>
													)}
												</div>
											</div>
											<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold border-2 ${
												evaluation.judgment
													? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/50'
													: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/50'
											}`}>
												{evaluation.judgment ? 'APROBADO' : 'REPROBADO'}
											</span>
										</div>
									</div>
								) : (
									<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 border border-gray-200 dark:border-slate-700 text-center">
										<svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
										<p className="text-gray-500 dark:text-slate-400 font-medium">Este plan aún no ha sido evaluado</p>
									</div>
								)
							}
						/>
					</div>
				</div>

				<div className="lg:col-span-3">
					<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-r from-lightGreen to-primary dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
							</svg>
						</div>
						<h3 className="text-2xl font-bold text-gray-800 dark:text-white">Actividades asignadas</h3>
						<span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 rounded-full text-sm font-semibold">{activities.length}</span>
					</div>						<div className="grid grid-cols-1 gap-4">
							{activities.length === 0 ? (
								<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 border border-gray-200 dark:border-slate-700 text-center">
									<svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
									</svg>
									<p className="text-gray-500 dark:text-slate-400 font-medium">No hay actividades registradas</p>
								</div>
							) : (
								activities.map((a: any, index: number) => (
									<div key={a.id} className="transform transition-all duration-500 hover:scale-[1.005] animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
										<Card
											header={
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gradient-to-r from-lightGreen to-primary dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
														<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
													</div>
													<div className="flex-1 min-w-0">
														<p className="font-bold text-gray-800 dark:text-white text-lg truncate">{a.description ?? "(sin descripción)"}</p>
													</div>
												</div>
											}
											body={
												<div className="space-y-4">
													<div>
														<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Objetivos</p>
														<p className="text-sm text-gray-700 dark:text-slate-300">{a.objectives ?? "-"}</p>
													</div>

													<div>
														<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Conclusiones</p>
														<p className="text-sm text-gray-700 dark:text-slate-300">{a.conclusions ?? "-"}</p>
													</div>

													<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

													<div>
														<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Evidencias</p>
														<div className="flex gap-2 flex-wrap">
															{a.evidenceTypes?.length ? (
																a.evidenceTypes.map((e: any) => (
																	<span key={e.id} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 rounded-full text-xs font-medium">{e.name}</span>
																))
															) : (
																<span className="text-sm text-gray-400 dark:text-slate-500 italic">Sin evidencias</span>
															)}
														</div>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
														<div>
															<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Fecha de entrega</p>
															<p className="text-sm text-gray-800 dark:text-white">{a.deliveryDate ?? 'Sin fecha'}</p>
														</div>
														<div>
															<p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Formato de entrega</p>
															<p className="text-sm text-gray-800 dark:text-white">{a.improvementPlanDelivery?.deliveryFormat ?? 'Sin formato'}</p>
														</div>
													</div>
												</div>
											}
										/>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
				@keyframes slide-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
				.animate-fade-in { animation: fade-in 0.6s ease-out; }
				.animate-slide-up { animation: slide-up 0.7s ease-out backwards; }
			`}</style>
		</div>
	);
}