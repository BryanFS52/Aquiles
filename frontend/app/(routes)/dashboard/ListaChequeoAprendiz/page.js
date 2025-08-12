"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, FileDown, X, UploadCloud } from "lucide-react";
import Image from 'next/image';
import PageTitle from "@components/UI/pageTitle";

// Moving checklistData outside the component to prevent unnecessary re-renders
const checklistData = {
  "Trimestre 1": {
    "Componente Técnico": [
      { id: 1, indicator: "Domina conceptos básicos de programación.", completed: true, observations: "" },
      { id: 2, indicator: "Comprende estructuras de datos fundamentales.", completed: true, observations: "" },
      { id: 3, indicator: "Implementa algoritmos básicos.", completed: true, observations: "" },
      { id: 4, indicator: "Utiliza herramientas de desarrollo.", completed: true, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Identifica requerimientos básicos.", completed: true, observations: "" },
      { id: 2, indicator: "Diseña soluciones simples.", completed: false, observations: "" },
      { id: 3, indicator: "Documenta procesos básicos.", completed: true, observations: "" }
    ]
  },
  "Trimestre 2": {
    "Componente Técnico": [
      { id: 1, indicator: "Implementa programación orientada a objetos.", completed: true, observations: "" },
      { id: 2, indicator: "Utiliza bases de datos relacionales.", completed: true, observations: "" },
      { id: 3, indicator: "Crea interfaces de usuario básicas.", completed: false, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Analiza requerimientos funcionales.", completed: true, observations: "" },
      { id: 2, indicator: "Diseña modelos de datos.", completed: true, observations: "" }
    ]
  },
  "Trimestre 3": {
    "Componente Técnico": [
      { id: 1, indicator: "Desarrolla aplicaciones web básicas.", completed: true, observations: "" },
      { id: 2, indicator: "Implementa validaciones de datos.", completed: true, observations: "" },
      { id: 3, indicator: "Utiliza frameworks básicos.", completed: false, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Implementa lógica de negocio.", completed: true, observations: "" },
      { id: 2, indicator: "Realiza pruebas básicas.", completed: false, observations: "" }
    ]
  },
  "Trimestre 4": {
    "Componente Técnico": [
      { id: 1, indicator: "Desarrolla APIs REST básicas.", completed: true, observations: "" },
      { id: 2, indicator: "Implementa autenticación básica.", completed: true, observations: "" },
      { id: 3, indicator: "Utiliza sistemas de control de versiones.", completed: true, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Integra sistemas básicos.", completed: true, observations: "" },
      { id: 2, indicator: "Documenta APIs.", completed: false, observations: "" }
    ]
  },
  "Trimestre 5": {
    "Componente Técnico": [
      { id: 1, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: true, observations: "" },
      { id: 2, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: true, observations: "" },
      { id: 3, indicator: "Implementa servicios REST siguiendo estándares.", completed: true, observations: "" },
      { id: 4, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: true, observations: "" },
      { id: 5, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: true, observations: "" },
      { id: 6, indicator: "Implementa servicios REST siguiendo estándares.", completed: true, observations: "" },
      { id: 7, indicator: "Describe la creación de usuarios y privilegios a nivel de base de datos.", completed: true, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "La aplicación implementa patrones de diseño.", completed: true, observations: "" },
      { id: 2, indicator: "Se evidencia el uso de principios SOLID.", completed: false, observations: "" },
      { id: 3, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: true, observations: "" },
      { id: 4, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: true, observations: "" }
    ]
  },
  "Trimestre 6": {
    "Componente Técnico": [
      { id: 1, indicator: "Implementa servicios REST siguiendo estándares.", completed: true, observations: "" },
      { id: 2, indicator: "Utiliza JWT para la autenticación de servicios.", completed: false, observations: "" },
      { id: 3, indicator: "Implementa microservicios.", completed: true, observations: "" },
      { id: 4, indicator: "Utiliza contenedores Docker.", completed: false, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Implementa pruebas unitarias.", completed: true, observations: "" },
      { id: 2, indicator: "Utiliza herramientas de integración continua.", completed: false, observations: "" },
      { id: 3, indicator: "Implementa monitoreo de aplicaciones.", completed: true, observations: "" }
    ]
  },
  "Trimestre 7": {
    "Componente Técnico": [
      { id: 1, indicator: "Implementa arquitecturas escalables.", completed: true, observations: "" },
      { id: 2, indicator: "Utiliza herramientas de orquestación.", completed: false, observations: "" },
      { id: 3, indicator: "Implementa seguridad avanzada.", completed: true, observations: "" },
      { id: 4, indicator: "Optimiza rendimiento de aplicaciones.", completed: true, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Diseña sistemas complejos.", completed: true, observations: "" },
      { id: 2, indicator: "Implementa metodologías ágiles.", completed: true, observations: "" },
      { id: 3, indicator: "Lidera equipos de desarrollo.", completed: false, observations: "" }
    ]
  }
};

export default function ChecklistComponent() {
  // State management
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 1");
  const [selectedComponent, setSelectedComponent] = useState("Componente Técnico");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [firmaAnterior, setFirmaAnterior] = useState(null);
  const [firmaNuevo, setFirmaNuevo] = useState(null);

  const itemsPerPage = 4;

  // Update items when selectors change - now using a safer approach
  useEffect(() => {
    try {
      if (checklistData[selectedTrimester] &&
        checklistData[selectedTrimester][selectedComponent]) {
        setItems(checklistData[selectedTrimester][selectedComponent]);
        setCurrentPage(1); // Reset to first page when selection changes
      } else {
        // Fallback if data is missing
        console.error("Data not found for selection:", selectedTrimester, selectedComponent);
        setItems([]);
      }
    } catch (error) {
      console.error("Error setting items:", error);
      setItems([]);
    }
  }, [selectedTrimester, selectedComponent]);

  // Safe file upload handler
  const handleFileUpload = useCallback((e, setFirma) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFirma(url);
      }
    } catch (error) {
      console.error("Error processing file upload:", error);
    }
  }, []);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil((items?.length || 0) / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Safely navigate pages
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-6">
      {/* Título */}
      <PageTitle>Lista de Chequeo</PageTitle>

      {/* Información */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-[#001829] shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Centro de Formación:</p>
          <p className="text-gray-700 dark:text-gray-300">Centro de Servicios Financieros</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Fecha:</p>
          <p className="text-gray-700 dark:text-gray-300">05/02/2024 - 05/05/2024</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#001829] shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Jornada:</p>
          <p className="text-gray-700 dark:text-gray-300">Diurna</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Ficha:</p>
          <p className="text-gray-700 dark:text-gray-300">2558735</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#001829] shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Team Scrum:</p>
          <p className="text-gray-700 dark:text-gray-300">Team 3</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Integrantes:</p>
          <p className="text-gray-700 dark:text-gray-300">Andres Ruiz, Alejandra Gonzalez, Juan Pullido, Sebastian Pineda</p>
        </div>
      </div>

      {/* Selectores */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <select
            className="w-full sm:w-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#001829] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            value={selectedTrimester}
            onChange={(e) => setSelectedTrimester(e.target.value)}
          >
            {Object.keys(checklistData).map((trimester) => (
              <option key={trimester} value={trimester}>
                {trimester}
              </option>
            ))}
          </select>

          <select
            className="w-full sm:w-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#001829] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            {selectedTrimester && checklistData[selectedTrimester] ?
              Object.keys(checklistData[selectedTrimester]).map((component) => (
                <option key={component} value={component}>
                  {component}
                </option>
              )) : null}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 shadow-sm">
            <FileDown className="w-4 h-4" /> PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 shadow-sm">
            <FileDown className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white dark:bg-[#001829] shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#002033]">
            <tr>
              <th className="text-lg font-semibold text-gray-900 dark:text-white p-4 text-center border-b border-gray-200 dark:border-gray-700">Item</th>
              <th className="text-lg font-semibold text-gray-900 dark:text-white p-4 text-left border-b border-gray-200 dark:border-gray-700">Indicadores y/o Variables</th>
              <th className="text-lg font-semibold text-gray-900 dark:text-white p-4 text-center border-b border-gray-200 dark:border-gray-700">Sí</th>
              <th className="text-lg font-semibold text-gray-900 dark:text-white p-4 text-center border-b border-gray-200 dark:border-gray-700">No</th>
              <th className="text-lg font-semibold text-gray-900 dark:text-white p-4 text-left border-b border-gray-200 dark:border-gray-700">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#002033] transition-colors duration-200">
                  <td className="p-4 text-center text-gray-900 dark:text-white">{item.id}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{item.indicator}</td>
                  <td className="p-4 text-center">
                    {item.completed ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : null}
                  </td>
                  <td className="p-4 text-center">
                    {!item.completed ? <X className="w-5 h-5 text-red-500 mx-auto" /> : null}
                  </td>
                  <td className="p-4 text-gray-900 dark:text-white">{item.observations}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {currentItems.length > 0 && (
        <div className="flex justify-between items-center">
          <button
            className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 ${currentPage === 1
              ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
              : 'bg-white dark:bg-[#001829] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#002033]'
              }`}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <div className="text-lg text-gray-900 dark:text-white">
            Página {currentPage} de {totalPages}
          </div>
          <button
            className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 ${currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
              : 'bg-white dark:bg-[#001829] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#002033]'
              }`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Firmas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Firma Instructor Técnico Anterior */}
        <div className="bg-gray-50 dark:bg-[#001829] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">Instructor técnico anterior</p>
          <div className="flex flex-col items-center">
            <label className="flex flex-col items-center cursor-pointer mb-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300">
              <UploadCloud className="w-8 h-8 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 mb-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium text-sm text-center">Elegir archivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                className="hidden"
              />
            </label>
            <div className="w-full flex justify-center">
              {firmaAnterior && (
                <Image
                  src={firmaAnterior}
                  alt="Firma instructor anterior"
                  className="h-20 w-auto object-contain border border-gray-300 dark:border-gray-600 rounded-md"
                  width={80}
                  height={80}
                />
              )}
            </div>
          </div>
        </div>

        {/* Firma Instructor Técnico Nuevo */}
        <div className="bg-gray-50 dark:bg-[#001829] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">Instructor técnico nuevo</p>
          <div className="flex flex-col items-center">
            <label className="flex flex-col items-center cursor-pointer mb-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300">
              <UploadCloud className="w-8 h-8 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 mb-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium text-sm text-center">Elegir archivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                className="hidden"
              />
            </label>
            <div className="w-full flex justify-center">
              {firmaNuevo && (
                <Image
                  src={firmaNuevo}
                  alt="Firma instructor nuevo"
                  className="h-20 w-auto object-contain border border-gray-300 dark:border-gray-600 rounded-md"
                  width={80}
                  height={80}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}