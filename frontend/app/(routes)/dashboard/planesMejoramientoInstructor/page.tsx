"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoader } from "@context/LoaderContext"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { fetchStudySheetByTeacher } from "@redux/slices/olympo/studySheetSlice"
import { fetchTeacherCompetencesByStudySheet } from "@redux/slices/improvementPlanSlice"
import type { AppDispatch } from "@redux/store"
import type { StudySheet, StudentStudySheet } from "@graphql/generated"
import { FiBookOpen, FiCreditCard, FiPhone, FiMail, FiUsers } from "react-icons/fi"
import { IoPeople, IoTimeOutline } from "react-icons/io5"
import { GraduationCap, Award, MoveRight, Calendar } from "lucide-react"
import PageTitle from "@components/UI/pageTitle"
import EmptyState from "@components/UI/emptyState"
import Modal from "@components/UI/Modal"

const styles = `
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`

const PlanMejoramientoInstructor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [selectedStudents, setSelectedStudents] = useState<NonNullable<StudentStudySheet>[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSheet, setCurrentSheet] = useState<NonNullable<StudySheet> | null>(null)

  const { showLoader, hideLoader } = useLoader()

  const { data, loading, error } = useSelector((state: any) => state.studySheet)
  const { teacherCompetences, loadingCompetences } = useSelector((state: any) => state.improvementPlan)
  const studySheets: NonNullable<StudySheet>[] = (data || []).filter(
    (sheet: StudySheet): sheet is NonNullable<StudySheet> => sheet !== null,
  )

  const filteredStudySheets = studySheets

  useEffect(() => {
    const loadData = async () => {
      showLoader()
      try {
        await dispatch(
          fetchStudySheetByTeacher({
            idTeacher: 1,
            page: 0,
            size: 5,
          }),
        ).unwrap()
      } catch (error) {
        console.error("Error al cargar fichas:", error)
        toast.error("Error al cargar las fichas de estudio", {
          position: "top-right",
          autoClose: 4000,
        })
      } finally {
        hideLoader()
      }
    }

    loadData()
  }, [dispatch, showLoader, hideLoader])

  const handleViewStudents = (sheet: NonNullable<StudySheet>) => {
    setCurrentSheet(sheet)
    const validStudents = (sheet.studentStudySheets || []).filter(
      (ss): ss is NonNullable<StudentStudySheet> => ss !== null,
    )
    setSelectedStudents(validStudents)
    setIsModalOpen(true)
  }

  const handleSelectSheet = async (sheet: NonNullable<StudySheet>) => {
    console.log("Ficha seleccionada:", sheet)

    showLoader()

    try {
      const teacherId = 1
      let currentCompetences: any[] = []

      try {
        const competencesResult = await dispatch(
          fetchTeacherCompetencesByStudySheet({
            studySheetId: sheet.id?.toString() || "",
            teacherId: teacherId.toString(),
          }),
        ).unwrap()

        currentCompetences = competencesResult || []
        console.log("Competencias cargadas para la ficha:", currentCompetences)
      } catch (error) {
        console.error("Error al cargar competencias:", error)
        toast.error("Error al cargar las competencias de la ficha", {
          position: "top-right",
          autoClose: 4000,
        })
        currentCompetences = []
      }

      const validStudents = (sheet.studentStudySheets || []).filter(
        (ss): ss is NonNullable<StudentStudySheet> => ss !== null,
      )
      const studentIds = validStudents.map((ss) => ss.student?.id).filter(Boolean)

      console.log("Estudiantes de la ficha:", validStudents)
      console.log("IDs de estudiantes:", studentIds)

      const fichaData = {
        id: sheet.id,
        fichaNumber: sheet.number,
        number: sheet.number,
        studentIds: studentIds,
        teacherCompetences: currentCompetences,
        students: validStudents.map((ss) => ss.student),
        studentStudySheets: validStudents,
      }

      console.log("FichaData completo a enviar:", fichaData)

      if (validStudents.length > 0) {
        const url = `./HistorialPlanesMejoramientoInstructor?studySheetId=${fichaData.id}`

        console.log("Navegando a:", url)

        router.push(url)
      } else {
        toast.warning("Esta ficha no tiene estudiantes asignados", {
          position: "top-right",
          autoClose: 4000,
        })
        // NO redirigir al historial sin parámetros - esto causa carga de todos los planes
        // router.push(`./HistorialPlanesMejoramientoInstructor`)
      }
    } catch (error) {
      console.error("Error general en handleSelectSheet:", error)
      toast.error("Error al procesar la selección de ficha", {
        position: "top-right",
        autoClose: 4000,
      })
    } finally {
      hideLoader()
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getCurrentQuarter = (sheet: NonNullable<StudySheet>) => {
    if (!sheet.quarter || sheet.quarter.length === 0) {
      return "Sin trimestre"
    }
    const lastQuarter = [...sheet.quarter]
      .filter((q) => q?.name?.number !== undefined)
      .sort((a, b) => (b?.name?.number ?? 0) - (a?.name?.number ?? 0))[0]
    return `${lastQuarter?.name?.extension} ${lastQuarter?.name?.number}`
  }

  if (error) {
    return (
      <EmptyState
        message={
          typeof error === "string" ? `Error al cargar las fichas: ${error}` : "Error desconocido al cargar las fichas."
        }
      />
    )
  }

  if ((!studySheets || studySheets.length === 0) && !error) {
    return <EmptyState message="No se encontraron fichas de mejoramiento." />
  }

  return (
    <div className="mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <style>{styles}</style>

      <div className="mb-4 sm:mb-5 md:mb-6">
        <PageTitle>Planes De Mejoramiento</PageTitle>
      </div>

      {filteredStudySheets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredStudySheets.map((sheet, index) => (
            <article
              key={sheet.id}
              className="relative h-full bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(57,143,15,0.3)] dark:hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)] hover:-translate-y-1 flex flex-col group"
              style={{
                animation: `fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
              }}
            >
              {/* Barra lateral de color según estado */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${sheet.state ? "bg-gradient-to-b from-primary to-lightGreen dark:from-blue-600 dark:to-blue-800" : "bg-gradient-to-b from-gray-400 to-gray-600"} transition-all duration-300 group-hover:w-2`}
              ></div>

              {/* Header minimalista */}
              <header className="relative px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 border-b border-gray-100 dark:border-gray-700">
                {/* Fondo sutil con patrón */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`pattern-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
                  </svg>
                </div>

                <div className="relative flex items-start justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                  {/* Número de ficha - Diseño limpio */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 dark:from-blue-600 dark:to-blue-700 shadow-lg group-hover:shadow-green-500/30 dark:group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ficha
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-black dark:text-white leading-none truncate">{sheet.number}</p>
                    </div>
                  </div>

                  {/* Badge de estado - Discreto */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {sheet.state ? (
                      <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-green-50 dark:bg-blue-900/20 border border-green-200 dark:border-blue-800/50">
                        <div className="w-2 h-2 bg-green-500 dark:bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                        <span className="text-[10px] sm:text-xs font-semibold text-green-700 dark:text-blue-400 whitespace-nowrap">Activa</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0"></div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Inactiva</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Programa - Tipografía elegante */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary dark:text-blue-400 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Programa de Formación
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-black dark:text-white leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors duration-300 uppercase">
                    {sheet.trainingProject?.program?.name ?? "No especificado"}
                  </h3>
                </div>
              </header>

              {/* Body con DataCards */}
              <div className="relative px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex-1 space-y-3 sm:space-y-4">
                {/* Información principal */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Jornada */}
                  <DataCard
                    icon={<IoTimeOutline className="w-4 h-4" />}
                    label="Jornada"
                    value={sheet.journey?.name ?? "Sin jornada"}
                    gradient="from-blue-500 to-blue-600"
                  />
                  <div className="col-span-2 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary dark:text-blue-400 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Período Lectivo
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute top-[10px] sm:top-[12px] left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 z-0"></div>
                      <div className="relative grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        <TimelinePoint label="Inicio" date={formatDate((sheet as any).startLective)} color="green" />
                        <TimelinePoint label="Finalización" date={formatDate((sheet as any).endLective)} color="blue" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer elegante */}
              <footer className="relative px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/30 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Contador de aprendices - Limpio */}
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
                    <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-blue-500/20 dark:to-blue-600/20 transition-all duration-300">
                      <IoPeople className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary dark:text-blue-400" strokeWidth={2} />
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-5 h-5 bg-primary dark:bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-[9px] sm:text-[10px] font-bold text-white">
                          {sheet.studentStudySheets?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-black dark:text-white truncate">Aprendices</p>
                    </div>
                  </div>

                  {/* Botones - Minimalistas */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <button
                      onClick={() => handleViewStudents(sheet)}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md active:scale-95 justify-center"
                    >
                      <FiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-white flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wide whitespace-nowrap">
                        Ver
                      </span>
                    </button>
                    <button
                      onClick={() => handleSelectSheet(sheet)}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-black dark:bg-white hover:bg-primary dark:hover:bg-blue-600 transition-all duration-300 hover:shadow-lg active:scale-95 justify-center"
                    >
                      <span className="text-[11px] sm:text-xs font-semibold text-white dark:text-black uppercase tracking-wide whitespace-nowrap">
                        Historial
                      </span>
                      <MoveRight
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-black group-hover:translate-x-1 transition-transform flex-shrink-0"
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                </div>
              </footer>

              {/* Efecto de hover sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-lightGreen/0 group-hover:from-primary/5 group-hover:to-lightGreen/5 transition-all duration-500 pointer-events-none"></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full mb-4 mx-auto group-hover:animate-bounce">
              <FiBookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">No se encontraron fichas</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No hay fichas que coincidan con los filtros aplicados.
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Aprendices - Ficha #${currentSheet?.number}`}
        size="xxxl"
      >
        <div className="max-h-[75vh] overflow-y-auto">
          {selectedStudents && selectedStudents.length > 0 ? (
            <div className="w-full">
              <div className="text-xs sm:text-sm text-grayText dark:text-white mb-3 sm:mb-4 text-center">
                Total de aprendices: <span className="font-semibold">{selectedStudents.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 p-1">
                {selectedStudents.map((studentSheet, index) => {
                  const student = studentSheet?.student
                  const person = student?.person
                  if (!student || !person) return null

                  const displayName =
                    person?.name && person?.lastname
                      ? `${person.name} ${person.lastname}`
                      : person?.name || "Nombre no disponible"

                  const studentState = studentSheet?.studentStudySheetState?.name || "Estado no disponible"

                  return (
                    <div
                      key={student.id || index}
                      className="group bg-white dark:bg-shadowBlue rounded-xl shadow-sm border border-lightGray dark:border-grayText p-3 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-48 min-h-[12rem] max-h-48"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-black dark:text-white text-xs leading-tight break-words line-clamp-2 max-h-8 overflow-hidden">
                            {displayName}
                          </h4>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${
                            studentState === "En formacion"
                              ? "bg-gradient-to-r from-lightGreen to-darkGreen dark:from-secondary dark:to-darkBlue text-white"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          }`}
                        >
                          {studentState}
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-grayText dark:text-white flex-1 overflow-hidden">
                        <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-shadowBlue/50 rounded-md">
                          <FiCreditCard className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Doc:</span>
                            <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1 truncate">
                              {person.document || "Sin documento"}
                            </span>
                          </div>
                        </div>
                        {person.email && (
                          <div className="flex items-start gap-1.5 p-1 bg-gray-50 dark:bg-shadowBlue/50 rounded-md">
                            <FiMail className="w-2.5 h-2.5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Correo:</span>
                              <span className="block text-[10px] text-gray-600 dark:text-gray-400 break-all leading-tight line-clamp-2 max-h-6 overflow-hidden">
                                {person.email}
                              </span>
                            </div>
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-shadowBlue/50 rounded-md">
                            <FiPhone className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Tel:</span>
                              <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1 truncate">
                                {person.phone}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <EmptyState message="No hay aprendices registrados en esta ficha" />
          )}
        </div>
      </Modal>
    </div>
  )
}

const DataCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: string
  gradient: string
  fullWidth?: boolean
}> = ({ icon, label, value, gradient, fullWidth = false }) => (
  <div
    className={`${fullWidth ? "col-span-2" : ""} group/card relative overflow-hidden bg-white dark:bg-gray-800/50 rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-lightGreen/50 transition-all duration-300 hover:shadow-md`}
  >
    {/* Gradiente de fondo en hover */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover/card:opacity-5 transition-opacity duration-300`}
    ></div>

    <div className="relative flex items-start gap-2 sm:gap-2.5">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm group-hover/card:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] sm:text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-black dark:text-white truncate">{value}</p>
      </div>
    </div>
  </div>
)

// Componente auxiliar para puntos de timeline (Inicio / Finalización)
const TimelinePoint: React.FC<{
  label: string
  date: string
  color: "green" | "red" | "blue"
}> = ({ label, date, color }) => (
  <div className="relative flex flex-col items-center">
    <div
      className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-3 sm:border-4 ${
          color === "green"
          ? "bg-green-500 border-green-200 dark:border-green-800"
          : color === "blue"
            ? "bg-blue-500 border-blue-200 dark:border-blue-800"
            : "bg-red-500 border-red-200 dark:border-red-800"
      } shadow-lg flex-shrink-0`}
    >
      <div
        className={`absolute inset-0 rounded-full ${
          color === "green" ? "bg-green-500" : color === "blue" ? "bg-blue-500" : "bg-red-500"
        } animate-ping opacity-20`}
      ></div>
    </div>
    <div className="mt-2 sm:mt-3 text-center">
      <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">{label}</p>
      <p
        className={`text-xs sm:text-sm font-bold ${
          color === "green"
            ? "text-green-700 dark:text-green-400"
            : color === "blue"
              ? "text-blue-700 dark:text-blue-400"
              : "text-red-700 dark:text-red-400"
        }`}
      >
        {date}
      </p>
    </div>
  </div>
)

export default PlanMejoramientoInstructor
