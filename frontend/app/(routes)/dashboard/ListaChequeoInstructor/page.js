'use client'

import { useState, useEffect, useMemo } from "react";
import { Check, FileDown, Save, UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";
import { fetchAllChecklists } from "@services/checkListService"
import { fetchEvaluationsByChecklist, completeEvaluation } from "@services/evaluationService";

export default function InstructorChecklistView() {
  const [activeChecklists, setActiveChecklists] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [selectedTrimester, setSelectedTrimester] = useState("todos");
  const [selectedTrimestre, setSelectedTrimestre] = useState("1")
  const [currentPage, setCurrentPage] = useState(1)
  const [firmaAnterior, setFirmaAnterior] = useState(null)
  const [firmaNuevo, setFirmaNuevo] = useState(null)
  const [evaluations, setEvaluations] = useState([])
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [evaluationRecommendations, setEvaluationRecommendations] = useState("")
  const [evaluationJudgment, setEvaluationJudgment] = useState("PENDIENTE")
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 3;

  // Cargar listas de chequeo activas
  useEffect(() => {
    loadActiveChecklists();
  }, []);

  const loadActiveChecklists = async () => {
    try {
      setLoading(true);
      const response = await fetchAllChecklists(0, 100);
      if (response.code === "200" && response.data) {
        // Filtrar solo las listas activas
        const activeLists = response.data.filter(checklist => checklist.state === true);
        setActiveChecklists(activeLists);
        if (activeLists.length > 0 && !selectedChecklist) {
          setSelectedChecklist(activeLists[0]);
        }
      }
    } catch (error) {
      console.error("Error loading active checklists:", error);
      toast.error("Error al cargar las listas de chequeo activas");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar checklists por trimestre
  const filteredChecklists = useMemo(() => {
    if (selectedTrimester === "todos") {
      return activeChecklists;
    }
    return activeChecklists.filter(checklist => 
      checklist.trimester === selectedTrimester
    );
  }, [activeChecklists, selectedTrimester]);

  // Obtener items del checklist seleccionado (simulado)
  const items = useMemo(() => {
    if (!selectedChecklist) return [];
    // Simulamos items para el checklist seleccionado
    return [
      { id: 1, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: null, observations: "" },
      { id: 2, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: null, observations: "" },
      { id: 3, indicator: "Implementa servicios REST siguiendo estándares.", completed: null, observations: "" },
      { id: 4, indicator: "La aplicación implementa patrones de diseño.", completed: null, observations: "" },
      { id: 5, indicator: "Se evidencia el uso de principios SOLID.", completed: null, observations: "" },
      { id: 6, indicator: "Describe la creación de usuarios y privilegios a nivel de base de datos.", completed: null, observations: "" }
    ];
  }, [selectedChecklist]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTrimesterChange = (value) => {
    setSelectedTrimester(value);
    setCurrentPage(1);
  };

  const handleChecklistChange = async (checklistId) => {
    const checklist = activeChecklists.find(cl => cl.id === parseInt(checklistId));
    setSelectedChecklist(checklist);
    setCurrentPage(1);
    
    // Reiniciar estados de evaluación
    setEvaluations([]);
    setSelectedEvaluation(null);
    setEvaluationRecommendations("");
    setEvaluationJudgment("PENDIENTE");
    
    // Comentamos temporalmente la carga de evaluaciones hasta que el backend las soporte
    /*
    // Cargar evaluaciones para esta lista de chequeo
    if (checklistId && checklistId !== "") {
      try {
        const evaluationsResponse = await fetchEvaluationsByChecklist(parseInt(checklistId));
        if (evaluationsResponse.code === "200" && evaluationsResponse.data) {
          setEvaluations(evaluationsResponse.data);
          // Si hay evaluaciones, seleccionar la primera automáticamente
          if (evaluationsResponse.data.length > 0) {
            const firstEvaluation = evaluationsResponse.data[0];
            setSelectedEvaluation(firstEvaluation);
            setEvaluationRecommendations(firstEvaluation.recommendations || "");
            setEvaluationJudgment(firstEvaluation.valueJudgment || "PENDIENTE");
          }
        } else {
          setEvaluations([]);
          setSelectedEvaluation(null);
        }
      } catch (error) {
        console.error("Error loading evaluations:", error);
        // No mostrar error al usuario hasta que las evaluaciones estén implementadas
        setEvaluations([]);
        setSelectedEvaluation(null);
      }
    } else {
      setEvaluations([]);
      setSelectedEvaluation(null);
    }
    */
  };  const handleItemChange = (id, field, value) => {
    // Aquí actualizarías el estado de los items
    console.log("Updated item:", { id, field, value });
  };

    const handleFileUpload = (event, setFile) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setFile(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Función para completar/actualizar la evaluación
  const handleCompleteEvaluation = async () => {
    if (!selectedEvaluation) {
      toast.error("No hay evaluación seleccionada");
      return;
    }

    try {
      const response = await completeEvaluation(
        selectedEvaluation.id,
        evaluationRecommendations,
        evaluationJudgment
      );

      if (response.code === "200") {
        toast.success("Evaluación actualizada exitosamente");
        // Actualizar el estado local
        setSelectedEvaluation({
          ...selectedEvaluation,
          recommendations: evaluationRecommendations,
          valueJudgment: evaluationJudgment
        });
      } else {
        toast.error("Error al actualizar la evaluación");
      }
    } catch (error) {
      console.error("Error updating evaluation:", error);
      toast.error("Error al actualizar la evaluación");
    }
  };;

  const handleSaveChecklist = () => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada");
      return;
    }
    console.log("Saving checklist:", { selectedChecklist, items });
    toast.success("La lista de chequeo ha sido guardada exitosamente.");
  };

  return (
    <div className="w-full">
      {/* Contenido principal adaptado al layout */}
      <div className="p-6 space-y-6">
        <PageTitle>Lista de Chequeo - Vista del Instructor</PageTitle>

        {/* Información del centro y datos generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-black/20 shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Centro de Formación:</p>
            <p className="text-base text-black dark:text-white">Centro de Servicios Financieros</p>
            <p className="text-2xl font-bold text-black dark:text-white">Fecha:</p>
            <p className="text-base text-black dark:text-white">05/02/2024 - 05/05/2024</p>
          </div>
          <div className="p-4 bg-white dark:bg-black/20 shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Jornada:</p>
            <p className="text-base text-black dark:text-white">Diurna</p>
            <p className="text-2xl font-bold text-black dark:text-white">Ficha:</p>
            <p className="text-base text-black dark:text-white">2558735</p>
          </div>
          <div className="p-4 bg-white dark:bg-black/20 shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Instructor Calificador:</p>
            <p className="text-base text-black dark:text-white">Juan Pérez</p>
            <p className="text-2xl font-bold text-black dark:text-white">Lista Seleccionada:</p>
            {selectedChecklist ? (
              <p className="text-base text-black dark:text-white">ID: {selectedChecklist.id} - {selectedChecklist.component || 'N/A'}</p>
            ) : (
              <p className="text-base text-gray-500 dark:text-gray-400">Ninguna lista seleccionada</p>
            )}
          </div>

          {/* Sección de Evaluación */}
          {selectedChecklist && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 shadow rounded border border-green-200 dark:border-green-800 space-y-4 transition-colors duration-300">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                📋 Evaluación
              </h3>
              
              {selectedEvaluation ? (
                <div className="space-y-3">
                  <div className="bg-green-100 dark:bg-green-800 p-3 rounded-md">
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      ✅ Evaluación encontrada para esta lista de chequeo
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recomendaciones:
                    </label>
                    <textarea
                      value={evaluationRecommendations}
                      onChange={(e) => setEvaluationRecommendations(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                      rows="3"
                      placeholder="Ingrese sus recomendaciones para esta evaluación..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Juicio de Valor:
                    </label>
                    <select
                      value={evaluationJudgment}
                      onChange={(e) => setEvaluationJudgment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EXCELENTE">Excelente</option>
                      <option value="BUENO">Bueno</option>
                      <option value="ACEPTABLE">Aceptable</option>
                      <option value="DEFICIENTE">Deficiente</option>
                      <option value="RECHAZADO">Rechazado</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleCompleteEvaluation}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Evaluación</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-md">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      ⚠️ No hay evaluación asignada para esta lista de chequeo
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        // Por ahora solo mostramos un mensaje, hasta que el backend soporte evaluaciones
                        toast.info("Funcionalidad de evaluaciones en desarrollo")
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>➕ Crear Evaluación</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controles de filtros y acciones */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <select
              onChange={(e) => handleTrimesterChange(e.target.value)}
              value={selectedTrimester}
              className="p-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 border rounded"
            >
              <option value="todos">Todos los Trimestres</option>
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Trimestre {i + 1}</option>
              ))}
            </select>

            <select
              onChange={(e) => handleChecklistChange(e.target.value)}
              value={selectedChecklist?.id || ""}
              className="p-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 border rounded"
              disabled={filteredChecklists.length === 0}
            >
              <option value="">Seleccionar Lista de Chequeo</option>
              {filteredChecklists.map((checklist) => (
                <option key={checklist.id} value={checklist.id}>
                  ID: {checklist.id} - {checklist.component || 'Lista de Chequeo'} (T{checklist.trimester || 'N/A'})
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveChecklist}
              disabled={!selectedChecklist}
              className={`flex items-center gap-1 px-4 py-2 rounded-md border transition-colors duration-300 ${
                selectedChecklist
                  ? 'hover:border-[#01b001] border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" /> Guardar Lista de Chequeo
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Listas activas: {activeChecklists.length}
            </span>
            <button className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md bg-gradient-to-r from-lime-600 to-lime-500 text-white focus:outline-none">
              <FileDown className="w-4 h-4" /> PDF
            </button>
            <button className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md bg-gradient-to-r from-lime-600 to-lime-500 text-white focus:outline-none">
              <FileDown className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>

        {/* Estado de carga o sin listas activas */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e324b]"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando listas de chequeo activas...</span>
          </div>
        ) : filteredChecklists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {selectedTrimester === "todos" 
                ? "No hay listas de chequeo activas disponibles" 
                : `No hay listas de chequeo activas para el trimestre ${selectedTrimester}`
              }
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Las listas de chequeo deben ser activadas desde la vista del coordinador
            </p>
          </div>
        ) : !selectedChecklist ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Selecciona una lista de chequeo para comenzar la evaluación
            </p>
          </div>
        ) : (
          <>
            {/* Tabla principal */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-300">
              <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                  <tr className="font-medium text-gray-900 dark:text-white">
                    <th className="text-xl font-bold p-3 text-center">Item</th>
                    <th className="text-xl font-bold p-3 text-left">Indicadores y/o Variables</th>
                    <th className="text-xl font-bold p-3 text-center">Sí / No</th>
                    <th className="text-xl font-bold p-3 text-left">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="p-6 text-center font-medium text-gray-900 dark:text-white">{item.id}</td>
                      <td className="p-6 font-medium text-gray-900 dark:text-white">{item.indicator}</td>
                      <td className="p-6 text-center font-medium text-gray-900 dark:text-white">
                        <div className="flex justify-center space-x-2">
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name={`completed-${item.id}`}
                              value="yes"
                              onChange={() => handleItemChange(item.id, "completed", true)}
                              checked={item.completed === true}
                            />
                            <Check className="w-5 h-5 text-green-600" />
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name={`completed-${item.id}`}
                              value="no"
                              onChange={() => handleItemChange(item.id, "completed", false)}
                              checked={item.completed === false}
                            />
                            <X className="w-5 h-5 text-red-600" />
                          </label>
                        </div>
                      </td>
                      <td className="p-3">
                        <textarea
                          value={item.observations}
                          onChange={(e) => handleItemChange(item.id, "observations", e.target.value)}
                          className="border rounded w-full p-2 min-h-[60px]"
                          placeholder="Agregar observaciones..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0e324b] hover:bg-[#01b001] text-white'} transition-colors duration-300`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹ Anterior
              </button>
              <div className="text-lg font-medium">
                Página {currentPage} de {totalPages}
              </div>
              <button
                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0e324b] hover:bg-[#01b001] text-white'} transition-colors duration-300`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente ›
              </button>
            </div>

            {/* Sección de firmas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Firma Instructor Técnico Anterior */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                <p className="text-lg font-semibold text-center mb-4">Instructor técnico anterior</p>
                <div className="flex flex-col items-center">
                  <label className="flex flex-col items-center cursor-pointer mb-3 p-4 border-2 border-dashed border-[#00324d] rounded-lg w-full hover:border-[#01b001] transition-colors duration-300">
                    <UploadCloud className="w-8 h-8 hover:text-[#01b001] transition-colors duration-300 mb-2" />
                    <span className="font-semibold text-sm text-center">Subir firma</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                      className="hidden"
                    />
                  </label>
                  {firmaAnterior && (
                    <div className="w-full flex justify-center">
                      <Image
                        src={firmaAnterior}
                        alt="Firma instructor anterior"
                        width={100}
                        height={100}
                        className="max-h-20 max-w-full object-contain border border-[#00324d] rounded-md p-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Firma Instructor Técnico Nuevo */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                <p className="text-lg font-semibold text-center mb-4">Instructor técnico nuevo</p>
                <div className="flex flex-col items-center">
                  <label className="flex flex-col items-center cursor-pointer mb-3 p-4 border-2 border-dashed border-[#00324d] rounded-lg w-full hover:border-[#01b001] transition-colors duration-300">
                    <UploadCloud className="w-8 h-8 hover:text-[#01b001] transition-colors duration-300 mb-2" />
                    <span className="font-semibold text-sm text-center">Subir firma</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                      className="hidden"
                    />
                  </label>
                  {firmaNuevo && (
                    <div className="w-full flex justify-center">
                      <Image
                        src={firmaNuevo}
                        alt="Firma instructor nuevo"
                        height={100}
                        width={100}
                        className="max-h-20 max-w-full object-contain border border-[#00324d] rounded-md p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}