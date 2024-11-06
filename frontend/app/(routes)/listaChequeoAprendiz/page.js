"use client";

import React, { useState, useEffect } from "react";
import { HeaderAprendiz } from "../../components/HeaderAprendiz";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import { Check, FileDown, X } from "lucide-react";

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

export default function Component() {
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 5");
  const [selectedComponent, setSelectedComponent] = useState("Componente Técnico");
  const [items, setItems] = useState(checklistData[selectedTrimester][selectedComponent]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setItems(checklistData[selectedTrimester][selectedComponent]);
    setCurrentPage(1);
  }, [selectedTrimester, selectedComponent]);

  const handleTrimesterChange = (value) => {
    setSelectedTrimester(value);
  };

  const handleComponentChange = (value) => {
    setSelectedComponent(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <HeaderAprendiz />

        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Lista de Chequeo
          </h1>

          {/* Información del Centro de Formación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="p-4 bg-white shadow-md rounded-lg space-y-2 ">
              <p className="text-2xl font-semibold text-[#0e324b]">Centro de Formación:</p>
              <p className="text-base">Centro de Servicios Financieros</p>
              <p className="text-2xl font-semibold text-[#0e324b]">Fecha:</p>
              <p className="text-base">05/02/2024 - 05/05/2024</p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg space-y-2">
              <p className="text-2xl font-semibold text-[#0e324b]">Jornada:</p>
              <p className="text-base">Diurna</p>
              <p className="text-2xl font-semibold text-[#0e324b]">Ficha:</p>
              <p className="text-base">2558735</p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg space-y-2">
              <p className="text-2xl font-semibold text-[#0e324b]">Team Scrum:</p>
              <p className="text-base">Team 3</p>
              <p className="text-2xl font-semibold text-[#0e324b]">Integrantes:</p>
              <p className="text-base">Andres Ruiz, Alejandra Gonzalez, Juan Pullido, Sebastian Pineda</p>
            </div>
          </div>

          {/* Selectores de Trimestre y Componente */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <select
                className="w-full md:w-[200px] p-2 border rounded-md"
                value={selectedTrimester}
                onChange={(e) => handleTrimesterChange(e.target.value)}
              >
                <option value="Trimestre 5">Trimestre 5</option>
                <option value="Trimestre 6">Trimestre 6</option>
              </select>

              <select
                className="w-full md:w-[200px] p-2 border rounded-md"
                value={selectedComponent}
                onChange={(e) => handleComponentChange(e.target.value)}
              >
                <option value="Componente Técnico">Componente Técnico</option>
                <option value="Componente Funcional">Componente Funcional</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md hover:border-[#01b001] bg-[#0e324b] text-white hover:bg-[#01b001] transition-coors duration-300  focus:outline-none">
                <FileDown className="w-4 h-4" /> PDF
              </button>
              <button className="flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md hover:border-[#01b001] bg-[#0e324b] text-white hover:bg-[#01b001] transition-coors duration-300  focus:outline-none">
                <FileDown className="w-4 h-4" /> Excel
              </button>
            </div>
          </div>

          {/* Tabla de Chequeo */}
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
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">{item.id}</td>
                    <td className="p-4">{item.indicator}</td>
                    <td className="p-3 text-center">
                      {item.completed ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : null}
                    </td>
                    <td className="p-3 text-center">
                      {!item.completed ? <X className="w-5 h-5 text-red-500 mx-auto" /> : null}
                    </td>
                    <td className="p-3">{item.observations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'disabled:opacity-50' : ''}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <div className="text-lg">
              Página {currentPage} de {totalPages}
            </div>
            <button
              className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'disabled:opacity-50' : ''}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 ">
            <div className="space-y-2">
              <p className="text-xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">Instructor técnico anterior</p>
              <div className="h-20 border rounded-md bg-gray-100 flex items-center justify-center">
                <img src="/signature1.png" alt="Firma del instructor anterior" className="max-h-16" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">Instructor técnico nuevo</p>
              <div className="h-20 border rounded-md bg-gray-100 flex items-center justify-center">
                <img src="/signature2.png" alt="Firma del instructor nuevo" className="max-h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
