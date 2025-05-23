"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@components/header";
import { Sidebaraprendiz } from "@components/SidebarAprendiz";
import { Check, FileDown, X, UploadCloud } from "lucide-react";

// Moving checklistData outside the component to prevent unnecessary re-renders
const checklistData = {
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
      { id: 2, indicator: "Utiliza JWT para la autenticación de servicios.", completed: false, observations: "" }
    ],
    "Componente Funcional": [
      { id: 1, indicator: "Implementa pruebas unitarias.", completed: true, observations: "" },
      { id: 2, indicator: "Utiliza herramientas de integración continua.", completed: false, observations: "" }
    ]
  }
};

export default function ChecklistComponent() {
  // State management
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 5");
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
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header role="Aprendiz" />

        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Lista de Chequeo
          </h1>

          {/* Información */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white shadow-md rounded-lg space-y-2">
              <p className="text-2xl font-semibold text-[#0e324b]">Centro de Formación:</p>
              <p>Centro de Servicios Financieros</p>
              <p className="text-2xl font-semibold text-[#0e324b]">Fecha:</p>
              <p>05/02/2024 - 05/05/2024</p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg space-y-2">
              <p className="text-2xl font-semibold text-[#0e324b]">Jornada:</p>
              <p>Diurna</p>
              <p className="text-2xl font-semibold text-[#0e324b]">Ficha:</p>
              <p>2558735</p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg space-y-2">
              <p className="text-2xl font-semibold text-[#0e324b]">Team Scrum:</p>
              <p>Team 3</p>
              <p className="text-2xl font-semibold text-[#0e324b]">Integrantes:</p>
              <p>Andres Ruiz, Alejandra Gonzalez, Juan Pullido, Sebastian Pineda</p>
            </div>
          </div>

          {/* Selectores */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <select
                className="w-full md:w-[200px] p-2 border rounded-md"
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
                className="w-full md:w-[200px] p-2 border rounded-md"
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
              <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-[#0e324b] text-white hover:bg-[#01b001] transition-colors duration-300">
                <FileDown className="w-4 h-4" /> PDF
              </button>
              <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-[#0e324b] text-white hover:bg-[#01b001] transition-colors duration-300">
                <FileDown className="w-4 h-4" /> Excel
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-300">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-xl font-bold text-[#00324d] p-3 text-center">Item</th>
                  <th className="text-xl font-bold text-[#00324d] p-3 text-left">Indicadores y/o Variables</th>
                  <th className="text-xl font-bold text-[#00324d] p-3 text-center">Sí</th>
                  <th className="text-xl font-bold text-[#00324d] p-3 text-center">No</th>
                  <th className="text-xl font-bold text-[#00324d] p-3 text-left">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-4 text-center">{item.id}</td>
                      <td className="p-4">{item.indicator}</td>
                      <td className="p-3 text-center">
                        {item.completed ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : null}
                      </td>
                      <td className="p-3 text-center">
                        {!item.completed ? <X className="w-5 h-5 text-red-500 mx-auto" /> : null}
                      </td>
                      <td className="p-3">{item.observations}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {currentItems.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <div className="text-lg">
                Página {currentPage} de {totalPages}
              </div>
              <button
                className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Firmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {/* Firma Instructor Técnico Anterior */}
            <div className="bg-white p-1 rounded-lg shadow-md border border-gray-300">
              <p className="text-lg font-semibold text-[#00324d] text-center mb-3">Instructor técnico anterior</p>
              <div className="flex flex-col items-center">
                <label className="flex flex-col items-center cursor-pointer mb-3">
                  <UploadCloud className="w-6 h-6 text-[#00324d] hover:text-[#01b001] transition-colors duration-300 mb-1" />
                  <span className="text-[#00324d] font-semibold text-sm text-center">Elegir archivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                    className="hidden"
                  />
                </label>
                <div className="w-full flex justify-center">
                  {firmaAnterior && (
                    <img
                      src={firmaAnterior}
                      alt="Firma instructor anterior"
                      className="h-16 w-auto object-contain border border-[#00324d] rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Firma Instructor Técnico Nuevo */}
            <div className="bg-white p-1 rounded-lg shadow-md border border-gray-300">
              <p className="text-lg font-semibold text-[#00324d] text-center mb-3">Instructor técnico nuevo</p>
              <div className="flex flex-col items-center">
                <label className="flex flex-col items-center cursor-pointer mb-3">
                  <UploadCloud className="w-6 h-6 text-[#00324d] hover:text-[#01b001] transition-colors duration-300 mb-1" />
                  <span className="text-[#00324d] font-semibold text-sm text-center">Elegir archivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                    className="hidden"
                  />
                </label>
                <div className="w-full flex justify-center">
                  {firmaNuevo && (
                    <img
                      src={firmaNuevo}
                      alt="Firma instructor nuevo"
                      className="h-16 w-auto object-contain border border-[#00324d] rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}