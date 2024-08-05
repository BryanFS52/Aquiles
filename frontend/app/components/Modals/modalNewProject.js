"use client";
import React, { useState, useEffect } from 'react';

const ModalNewProject = ({ isOpen, onClose, onCreate }) => {
  const [teamData, setTeamData] = useState({nameProject: '',});
  const [inputError, setInputError] = useState(false); // Estado para controlar el estilo del input

  useEffect(() => {
    if (!isOpen) {
  
      setTeamData({ nameProject: '' });
      setInputError(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
    setInputError(false); // Restablecer el estado del error al cambiar el valor del input
  };

  const handleCreateTeam = () => {
    if (!teamData.nameProject) {
      setInputError(true); // Muestra el error si el campo está vacío
      return;
    }

    onCreate(teamData); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative md:w-2/6 h-[40%] max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5 w-full h-full">
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-black">Nuevo Proyecto</h1>
          </div>
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <div className='pb-12'>
              <p className="text-sm font-serif text-black-700">Nombre del Proyecto</p>
              <div className={`rounded-lg border-solid border-2 text-custom-blue ${inputError ? 'border-red-500' : 'border-gray-300'}`}>
                <input type="text" name="nameProject" placeholder="Nombre del Proyecto" value={teamData.nameProject} onChange={handleInputChange} className={`${inputError ? 'text-red-500' : 'text-black'}`}/>        
              </div>
              {inputError && <p className="text-red-500 text-xs">Este campo es obligatorio.</p>}

            </div>
            <div className='flex text-xs space-x-4'>
              <button className='hover:bg-gray-500 rounded-md transition-colors bg-white px-8 py-4 border text-black'
                onClick={onClose}>
                Cancelar
              </button>
              <button className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border text-white' onClick={handleCreateTeam}>
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
