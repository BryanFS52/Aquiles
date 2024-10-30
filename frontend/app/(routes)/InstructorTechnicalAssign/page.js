"use client";

import React, { useState, useEffect } from 'react';
import { HeaderCoordinador } from "../../components/HeaderCoordinador";
import { Sidebarcoordinador } from '../../components/SidebarCoordinador';
import { FaUsers } from "react-icons/fa"; 
import { getAllSheets, assignInstructor } from '../../services/FichasCoordinadorService'; 

const FichasCoordinator = () => {
  const [sheets, setSheets] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState({});
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await getAllSheets();
        setSheets(response.data); 
      } catch (error) {
        console.error("Error fetching sheets:", error);
      }
    };

    const fetchInstructors = async () => {
      const response = await fetch('/api/instructors');
      const data = await response.json();
      setInstructors(data);
    };

    fetchSheets();
    fetchInstructors();
  }, []);

  const handleAssignInstructor = async (sheetId, instructorId) => {
    try {
      await assignInstructor(sheetId, instructorId);
      alert("Instructor asignado exitosamente");
    } catch (error) {
      console.error("Error asignando instructor:", error);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebarcoordinador />
      <div className="xl:col-span-5">
        <HeaderCoordinador />
        <div className="h-[90vh] p-4 md:p-8 lg:p-4 w-full bg-neutral-100 space-y-4">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
            Fichas y Asignación de Instructores
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sheets.map((sheet) => (
              <div key={sheet.idStudentSheet} className="flex flex-col border border-gray-300 shadow-md rounded-lg p-4 bg-white">
                <div className="flex-shrink-0 bg-[#0e324d] rounded-2xl h-20 w-20 flex items-center justify-center mx-auto border-[#01b001] border-4">
                  <FaUsers className="text-3xl text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold mt-2 mx-auto">Aprendices</p>
                  <p className="text-2xl font-bold mt-2 mx-auto">{sheet.token_number}</p>
                </div>
                <div className="flex flex-col ml-12 mx-auto">
                  <p className="text-lg font-bold">Número de la Ficha</p>
                  <p className="text-xl">{sheet.idStudentSheet}</p>
                  <p className="text-sm font-bold">Jornada</p>
                  <p className="text-md">{sheet.jornada}</p>
                  <p className="text-sm font-bold">Programa</p>
                  <p className="text-md">{sheet.program}</p>
                  <p className="text-sm font-bold">Instructor Técnico</p>
                  <p className="text-md">{sheet.instructorTecnico || "No asignado"}</p>
                </div>
                <div className="mt-4">
                  <label htmlFor={`instructor-${sheet.idStudentSheet}`} className="block text-sm font-bold">
                    Asignar Instructor:
                  </label>
                  <select
                    id={`instructor-${sheet.idStudentSheet}`}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedInstructor[sheet.idStudentSheet] || ""}
                    onChange={(e) =>
                      setSelectedInstructor((prev) => ({
                        ...prev,
                        [sheet.idStudentSheet]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Seleccionar Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                    ))}
                  </select>
                  <button
                    className="mt-2 p-2 bg-[#01b001] text-white rounded-md"
                    onClick={() => handleAssignInstructor(sheet.idStudentSheet, selectedInstructor[sheet.idStudentSheet])}
                  >
                    Asignar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichasCoordinator;
