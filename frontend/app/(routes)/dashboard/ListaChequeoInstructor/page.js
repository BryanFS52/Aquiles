'use client'

import { useState, useMemo } from "react";
import { Check, FileDown, Save, UploadCloud, X } from "lucide-react";

// Datos del checklist (misma estructura que tu código original)
const checklistData = {
  "Trimestre 1": {
    "Componente Técnico": [
      { id: 1, indicator: "Presenta los diagramas de la vista de implementación. (componentes y paquetes).", completed: null, observations: "" },
      { id: 2, indicator: "Presenta los diagramas de las vistas de despliegue del sistema. (despliegue, infraestructura y red).", completed: null, observations: "" },
      { id: 3, indicator: "Describe claramente los componentes de la plataforma tecnológica a utilizar.", completed: null, observations: "" },
      { id: 4, indicator: "Propone un catálogo de patrones de diseño a utilizar de acuerdo con la arquitectura seleccionada.", completed: null, observations: "" },
      { id: 5, indicator: "Presenta el documento de especificación de arquitectura (DEA).", completed: null, observations: "" },
      { id: 6, indicator: "La presentación de la arquitectura del sistema es clara y cumple con los requisitos del sistema.", completed: null, observations: "" }
    ],
    "Componente Bases de Datos": [
      { id: 1, indicator: "El modelo de la base de datos evidencia el cumplimiento de los requisitos del sistema.", completed: null, observations: "" },
      { id: 2, indicator: "La base de datos cumple con estándares y normas internacionales. (Nomenclatura estándar, Diccionario de datos, Modelo relacional, Normalización (mínimo 3FN), Especialización o generalización índices)", completed: null, observations: "" },
      { id: 3, indicator: "Evidencia la coherencia del diseño a través de consultas que incluyen cuatro o más tablas y que aportan información sobre el sistema a desarrollar.", completed: null, observations: "" },
      { id: 4, indicator: "Argumenta sobre las fases (conceptual, lógica y física) del proceso de diseño de la BD.", completed: null, observations: "" }
    ],
    "Componente Diseño Web": [
      { id: 1, indicator: "La interfaz evidencia el diseño centrado en el usuario cumpliendo estándares internacionales como UX (User Experience).", completed: null, observations: "" },
      { id: 2, indicator: "El diseño de la interfaz evidencia facilidad de aprendizaje, explicación clara de los datos de entrada y salida a través del uso de un lenguaje sencillo y breve.", completed: null, observations: "" },
      { id: 3, indicator: "El diseño de formularios presenta una correcta validación (lado del cliente) y retroalimentación al usuario.", completed: null, observations: "" },
      { id: 4, indicator: "Presenta el diseño de reportes.", completed: null, observations: "" }
    ],
    "Componente Humanistico": [
      { id: 1, indicator: "Presentación personal de expositores.", completed: null, observations: "" },
      { id: 2, indicator: "Utiliza un lenguaje incluyente en la sustentación.", completed: null, observations: "" },
      { id: 3, indicator: "Cumplimiento del tiempo establecido.", completed: null, observations: "" },
      { id: 4, indicator: "Participación de todos los integrantes del Team Scrum.", completed: null, observations: "" },
      { id: 5, indicator: "Apropiación del proyecto por parte de los y las integrantes del Team Scrum (trabajo en equipo)", completed: null, observations: "" },
      { id: 6, indicator: "Coloca en práctica los principios del código de ética del ingeniero de Software", completed: null, observations: "" },
      { id: 7, indicator: "Acepta los aportes como sugerencias para mejorar y expresa su inconformidad con respeto.", completed: null, observations: "" },
      { id: 8, indicator: "Uso adecuado de recursos audiovisuales. (Redacción y presentación de los recursos visuales).", completed: null, observations: "" }
    ],
    "Componente Comunicación": [
      { id: 1, indicator: "Refleja coherencia en su participación utilizando principios de comunicación verbal y no verbal.", completed: null, observations: "" },
      { id: 2, indicator: "Maneja correctamente el espacio y mantiene contacto visual con el auditorio.", completed: null, observations: "" },
      { id: 3, indicator: "Hace uso adecuado de los cualificadores vocales (tono, ritmo, intensidad y volumen).", completed: null, observations: "" }
    ],
    "Componente Emprendimiento": [
      { id: 1, indicator: "Presenta los diagramas de la vista de implementación. (componentes y paquetes).", completed: null, observations: "" },
      { id: 2, indicator: "Presenta los diagramas de las vistas de despliegue del sistema. (despliegue, infraestructura y red).", completed: null, observations: "" }
    ],
    "Componente Inglés": [
      { id: 1, indicator: "Comprende contenidos específicos y expresa sus ideas de forma oral y escrita mediante el uso de vocabulario. (Inglés general y técnico).", completed: null, observations: "" },
      { id: 2, indicator: "Utiliza en forma correcta la gramática escrita y oral. (Interfaz, explicar la función de las opciones).", completed: null, observations: "" },
      { id: 3, indicator: "Refleja coherencia en su participación, utilizando principios de fonética y fónica en inglés. (Speaking).", completed: null, observations: "" },
      { id: 4, indicator: "Expresa oralmente ideas y conceptos, de manera clara y sencilla utilizando el vocabulario y la pronunciación correcta. (Reading/punctuation).", completed: null, observations: "" },
      { id: 5, indicator: "La intervención del aprendiz permite reconocer la preparación previa a la actividad desarrollada (Apropiación).", completed: null, observations: "" },
      { id: 6, indicator: "Sustenta oralmente los contenidos relacionados al Sistema de información correspondiente a la fase.", completed: null, observations: "" },
      { id: 7, indicator: "Presenta las evidencias de manera oportuna y deacuerdo con lo concertado (Team Scrum).", completed: null, observations: "" },
      { id: 8, indicator: "Reacciona apropiadamente a la retroalimentación del instructor.", completed: null, observations: "" }
    ]
  }
  // Los demás trimestres siguen la misma estructura...
};

const teams = [
  { id: 1, name: "Team 1" },
  { id: 2, name: "Team 2" },
  { id: 3, name: "Team 3" },
  { id: 4, name: "Team 4" }
];

export default function InstructorChecklistView() {
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 1");
  const [selectedComponent, setSelectedComponent] = useState("Componente Técnico");
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [firmaAnterior, setFirmaAnterior] = useState(null);
  const [firmaNuevo, setFirmaNuevo] = useState(null);

  const itemsPerPage = 3;

  const items = useMemo(() => {
    return checklistData[selectedTrimester][selectedComponent]
  }, [selectedTrimester, selectedComponent])

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleTrimesterChange = (value) => {
    setSelectedTrimester(value)
    setCurrentPage(1)
  }

  const handleComponentChange = (value) => {
    setSelectedComponent(value)
    setCurrentPage(1)
  }

  const handleTeamChange = (value) => {
    setSelectedTeam(teams.find(team => team.id.toString() === value) || teams[0])
  }

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    console.log("Updated items:", updatedItems)
  }

  const handleFileUpload = (event, setSignature) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChecklist = () => {
    console.log("Saving checklist:", { selectedTeam, items });
    alert("La lista de chequeo ha sido guardada exitosamente.");
  }

  return (
    <div className="w-full">
      {/* Contenido principal adaptado al layout */}
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
          Lista de Chequeo - Vista del Instructor
        </h1>

        {/* Información del centro y datos generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded space-y-2">
            <p className="text-2xl font-bold text-[#00324d]">Centro de Formación:</p>
            <p className="text-base">Centro de Servicios Financieros</p>
            <p className="text-2xl font-bold text-[#00324d]">Fecha:</p>
            <p className="text-base">05/02/2024 - 05/05/2024</p>
          </div>
          <div className="p-4 bg-white shadow rounded space-y-2">
            <p className="text-2xl font-bold text-[#00324d]">Jornada:</p>
            <p className="text-base">Diurna</p>
            <p className="text-2xl font-bold text-[#00324d]">Ficha:</p>
            <p className="text-base">2558735</p>
          </div>
          <div className="p-4 bg-white shadow rounded space-y-2">
            <p className="text-2xl font-bold text-[#00324d]">Instructor Calificador:</p>
            <p className="text-base">Juan Pérez</p>
            <p className="text-2xl font-bold text-[#00324d]">Team</p>
            <select onChange={(e) => handleTeamChange(e.target.value)} className="border rounded p-2 w-full">
              {teams.map((team) => (
                <option key={team.id} value={team.id.toString()}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controles de filtros y acciones */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <select
              onChange={(e) => handleTrimesterChange(e.target.value)}
              value={selectedTrimester}
              className="border rounded p-2"
            >
              {Object.keys(checklistData).map((trimester) => (
                <option key={trimester} value={trimester}>
                  {trimester}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => handleComponentChange(e.target.value)}
              value={selectedComponent}
              className="border rounded p-2"
            >
              {Object.keys(checklistData[selectedTrimester]).map((component) => (
                <option key={component} value={component}>
                  {component}
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveChecklist}
              className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md hover:border-[#01b001] bg-[#0e324b] text-white hover:bg-[#01b001] transition-colors duration-300 focus:outline-none"
            >
              <Save className="w-4 h-4" /> Guardar Lista de Chequeo
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md hover:border-[#01b001] bg-[#0e324b] text-white hover:bg-[#01b001] transition-colors duration-300 focus:outline-none">
              <FileDown className="w-4 h-4" /> PDF
            </button>
            <button className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md hover:border-[#01b001] bg-[#0e324b] text-white hover:bg-[#01b001] transition-colors duration-300 focus:outline-none">
              <FileDown className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-300">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-xl font-bold text-[#00324d] p-3 text-center">Item</th>
                <th className="text-xl font-bold text-[#00324d] p-3 text-left">Indicadores y/o Variables</th>
                <th className="text-xl font-bold text-[#00324d] p-3 text-center">Sí / No</th>
                <th className="text-xl font-bold text-[#00324d] p-3 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-6 text-center">{item.id}</td>
                  <td className="p-6">{item.indicator}</td>
                  <td className="p-6 text-center">
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
            <p className="text-lg font-semibold text-[#00324d] text-center mb-4">Instructor técnico anterior</p>
            <div className="flex flex-col items-center">
              <label className="flex flex-col items-center cursor-pointer mb-3 p-4 border-2 border-dashed border-[#00324d] rounded-lg w-full hover:border-[#01b001] transition-colors duration-300">
                <UploadCloud className="w-8 h-8 text-[#00324d] hover:text-[#01b001] transition-colors duration-300 mb-2" />
                <span className="text-[#00324d] font-semibold text-sm text-center">Subir firma</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                  className="hidden"
                />
              </label>
              {firmaAnterior && (
                <div className="w-full flex justify-center">
                  <img
                    src={firmaAnterior}
                    alt="Firma instructor anterior"
                    className="max-h-20 max-w-full object-contain border border-[#00324d] rounded-md p-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Firma Instructor Técnico Nuevo */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
            <p className="text-lg font-semibold text-[#00324d] text-center mb-4">Instructor técnico nuevo</p>
            <div className="flex flex-col items-center">
              <label className="flex flex-col items-center cursor-pointer mb-3 p-4 border-2 border-dashed border-[#00324d] rounded-lg w-full hover:border-[#01b001] transition-colors duration-300">
                <UploadCloud className="w-8 h-8 text-[#00324d] hover:text-[#01b001] transition-colors duration-300 mb-2" />
                <span className="text-[#00324d] font-semibold text-sm text-center">Subir firma</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                  className="hidden"
                />
              </label>
              {firmaNuevo && (
                <div className="w-full flex justify-center">
                  <img
                    src={firmaNuevo}
                    alt="Firma instructor nuevo"
                    className="max-h-20 max-w-full object-contain border border-[#00324d] rounded-md p-2"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}