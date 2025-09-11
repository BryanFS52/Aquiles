"use client";

import { useState } from 'react';
import { FaUsers, FaUserTie, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";

// Tipos
interface Sheet {
  idStudentSheet: string;
  token_number: number;
  jornada: string;
  program: string;
  instructorTecnico: string | null;
}

interface Instructor {
  id: string;
  name: string;
}

// Datos mock
const mockSheets: Sheet[] = [
  {
    idStudentSheet: "2784512",
    token_number: 32,
    jornada: "Diurna",
    program: "Desarrollo de Software",
    instructorTecnico: null
  },
  {
    idStudentSheet: "2784513", 
    token_number: 28,
    jornada: "Nocturna",
    program: "Administración de Redes",
    instructorTecnico: "Carlos Mendoza"
  }
];

const mockInstructors: Instructor[] = [
  { id: "1", name: "Ana García López" },
  { id: "2", name: "Carlos Mendoza Silva" },
  { id: "3", name: "María Rodríguez Torres" },
  { id: "4", name: "José Luis Martín" }
];

const FichasCoordinator = () => {
  const [sheets, setSheets] = useState<Sheet[]>(mockSheets);
  const [selectedInstructor, setSelectedInstructor] = useState<Record<string, string>>({});

  const handleAssignInstructor = (sheetId: string, instructorId: string) => {
    if (!instructorId) {
      alert("Selecciona un instructor primero");
      return;
    }

    const instructorName = mockInstructors.find(inst => inst.id === instructorId)?.name;
    
    if (!instructorName) {
      alert("Instructor no encontrado");
      return;
    }
    
    setSheets(prev => prev.map(sheet => 
      sheet.idStudentSheet === sheetId 
        ? { ...sheet, instructorTecnico: instructorName }
        : sheet
    ));

    setSelectedInstructor(prev => ({
      ...prev,
      [sheetId]: ""
    }));

    alert("Instructor asignado exitosamente");
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">
          Asignación de Instructores
        </h1>
        <p className="text-darkGray">Gestiona la asignación técnica de instructores a las fichas</p>
      </div>

      {/* Stats rápidas */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-primary">
          <p className="text-sm text-darkGray">Total Fichas</p>
          <p className="text-2xl font-bold text-secondary">{sheets.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-lightGreen">
          <p className="text-sm text-darkGray">Con Instructor</p>
          <p className="text-2xl font-bold text-secondary">{sheets.filter(s => s.instructorTecnico).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-sm text-darkGray">Sin Asignar</p>
          <p className="text-2xl font-bold text-secondary">{sheets.filter(s => !s.instructorTecnico).length}</p>
        </div>
      </div>

      {/* Grid de fichas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sheets.map((sheet) => (
          <div key={sheet.idStudentSheet} className="bg-white rounded-2xl shadow-lg border border-lightGray overflow-hidden hover:shadow-xl transition-all duration-300">
            
            {/* Header de la ficha */}
            <div className="bg-gradient-to-r from-primary to-lightGreen p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <FaUsers className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ficha {sheet.idStudentSheet}</h3>
                    <p className="text-white/90">Programa de Formación</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <span className="text-3xl font-bold">{sheet.token_number}</span>
                    <p className="text-sm text-white/90">Aprendices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido de la ficha */}
            <div className="p-6 space-y-6">
              
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-darkGray">Jornada</p>
                    <p className="font-semibold text-secondary">{sheet.jornada}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaGraduationCap className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-darkGray">Programa</p>
                    <p className="font-semibold text-secondary truncate">{sheet.program}</p>
                  </div>
                </div>
              </div>

              {/* Instructor actual */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <FaUserTie className={`text-xl ${sheet.instructorTecnico ? 'text-primary' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-darkGray">Instructor Técnico</p>
                    <p className={`font-semibold ${sheet.instructorTecnico ? 'text-secondary' : 'text-gray-400'}`}>
                      {sheet.instructorTecnico || "Sin asignar"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Asignación de instructor */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-secondary">
                  {sheet.instructorTecnico ? 'Reasignar Instructor:' : 'Asignar Instructor:'}
                </label>
                
                <select
                  className="w-full p-3 border border-lightGray rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 bg-white"
                  value={selectedInstructor[sheet.idStudentSheet] || ""}
                  onChange={(e) =>
                    setSelectedInstructor((prev) => ({
                      ...prev,
                      [sheet.idStudentSheet]: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar Instructor</option>
                  {mockInstructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>

                <button
                  className="w-full bg-gradient-to-r from-primary to-lightGreen text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleAssignInstructor(sheet.idStudentSheet, selectedInstructor[sheet.idStudentSheet])}
                  disabled={!selectedInstructor[sheet.idStudentSheet]}
                >
                  {sheet.instructorTecnico ? 'Reasignar' : 'Asignar'} Instructor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FichasCoordinator;