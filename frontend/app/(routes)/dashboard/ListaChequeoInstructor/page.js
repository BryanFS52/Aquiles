'use client'

import { useState, useMemo } from "react";
import { Check, FileDown, Save, UploadCloud, X } from "lucide-react";
import { checklistData, teams } from "@data/checklistData";
import { toast } from "react-toastify";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";

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
    toast.success("La lista de chequeo ha sido guardada exitosamente.");
  }

  return (
    <div className="w-full">
      {/* Contenido principal adaptado al layout */}
      <div className="p-6 space-y-6">
        <PageTitle>Lista de Chequeo - Vista del Instructor</PageTitle>

        {/* Información del centro y datos generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-[#002033] shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Centro de Formación:</p>
            <p className="text-base text-darkBlue dark:text-white">Centro de Servicios Financieros</p>
            <p className="text-2xl font-bold text-black dark:text-white">Fecha:</p>
            <p className="text-base text-darkBlue dark:text-white">05/02/2024 - 05/05/2024</p>
          </div>
          <div className="p-4 bg-white dark:bg-[#002033] shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Jornada:</p>
            <p className="text-base text-darkBlue dark:text-white">Diurna</p>
            <p className="text-2xl font-bold text-black dark:text-white">Ficha:</p>
            <p className="text-base text-darkBlue dark:text-white">2558735</p>
          </div>
          <div className="p-4 bg-white dark:bg-[#002033] shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Instructor Calificador:</p>
            <p className="text-base text-darkBlue dark:text-white">Juan Pérez</p>
            <p className="text-2xl font-bold text-black dark:text-white">Team</p>
            <select onChange={(e) => handleTeamChange(e.target.value)} className="border rounded p-2 w-full bg-white dark:bg-[#001829] text-darkBlue dark:text-white border-darkGreen/20 dark:border-shadowBlue/40 focus:ring-2 focus:ring-darkGreen/40">
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
              className="p-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 border rounded"
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
              className="p-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 border rounded"            >
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
          <table className="min-w-full text-sm  text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
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
                <tr key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
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
      </div>
    </div >
  )
}