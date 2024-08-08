"use client"
import React, { useState, react } from 'react';
import Link from 'next/link';
import { createTeamScrum } from "../../services/teamScrumService";

const ModalNewProject = ({ isOpen, onClose }) => {

const [teamData, setTeamData] = useState({
  nameProject: '',
});

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
      });
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco gris */}
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

      {/* Contenedor del modal */}
      <div className="relative md:w-2/6 h-[40%] max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg ">
        <div className="p-5 w-full h-full">
            <div className='flex justify-center items-center'>
              <h1 className="text-2xl font-serif border-b-2 border-black ">Nuevo Proyecto</h1>

            </div>
            <div className='flex flex-col justify-center items-center h-full w-full'>
              <div className='pb-12'>
                  <p className="text-sm font-serif text-black-700">Nombre del Proyecto</p>

                  <div className="rounded-lg border-solid border-2 text-custom-blue ">
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
                  <button className='hover:bg-gray-500 rounded-md transition-colors bg-white px-8 py-4 border text-black ' 
                  onClick={onClose}>
                      Cancelar
                  </button>
                  <button
                        className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border text-white'
                        onClick={handleCreateTeam} // Asocia la función handleCreateTeam al evento de clic del botón
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