"use client";
import React, { useState } from 'react';
import { createTeamScrum } from "../../services/teamScrumService";

const ModalNewProject = ({ isOpen, onClose }) => {
  const [teamData, setTeamData] = useState({
    nameProject: '',
  });

  const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad de la alerta

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  const handleCreateTeam = () => {
    createTeamScrum(teamData)
      .then(() => {
        console.log('Equipo Scrum creado exitosamente');
        window.location.href = '/home';
      })
      .catch(error => {
        console.error('Error al crear equipo Scrum', error);
        setShowAlert(true); // Mostrar la alerta en caso de error
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco azul */}
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

      {/* Alerta colocada fuera del contenedor blanco, en el fondo azul opaco */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-60 max-w-lg mx-auto">
          <div className="bg-red-200 px-6 py-4 my-4 rounded-md text-lg flex items-center">
            <svg viewBox="0 0 24 24" className="text-red-600 w-12 h-12 sm:w-512 sm:h-12 mr-3">
              <path fill="currentColor"
                d="M23.119,20,13.772,2.15h0a2,2,0,0,0-3.543,0L.881,20a2,2,0,0,0,1.772,2.928H21.347A2,2,0,0,0,23.119,20ZM11,8.423a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Zm1.05,11.51h-.028a1.528,1.528,0,0,1-1.522-1.47,1.476,1.476,0,0,1,1.448-1.53h.028A1.527,1.527,0,0,1,13.5,18.4,1.475,1.475,0,0,1,12.05,19.933Z">
              </path>
            </svg>
            <span className="text-red-800 font-semibold">
            Por favor completa correctamente todos los campos obligatorios.
            </span>
          </div>
        </div>
      )}

      {/* Contenedor del modal */}
      <div className="relative md:w-2/6 h-[40%] max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5 w-full h-full">
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-black">Nuevo Proyecto</h1>
          </div>
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <div className='pb-12'>
              <p className="text-sm font-serif text-black-700">Nombre del Proyecto</p>
              <div className="rounded-lg border-solid border-2 text-custom-blue">
                <input
                  type="text"
                  name="nameProject"
                  placeholder="Nombre del Proyecto"
                  value={teamData.nameProject}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex text-xs space-x-4'>
              <button className='hover:bg-gray-500 rounded-md transition-colors bg-white px-8 py-4 border text-black'
                onClick={onClose}>
                Cancelar
              </button>
              <button
                className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border text-white'
                onClick={handleCreateTeam}
              >
                Registrar Equipo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewProject;
