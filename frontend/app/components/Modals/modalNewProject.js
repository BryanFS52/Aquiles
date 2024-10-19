"use client";
import React, { useState, useEffect } from 'react';

const ModalNewProject = ({ isOpen, onClose, onCreate }) => {
  const [teamData, setTeamData] = useState({ nameProject: '' });
  const [inputError, setInputError] = useState(false);
  const [modalTransition, setModalTransition] = useState(false); // Estado para controlar la transición

  useEffect(() => {
    if (isOpen) {
      setModalTransition(true); // Activa la transición cuando el modal se abre
    } else {
      setModalTransition(false); // Desactiva la transición cuando se cierra
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTeamData({ nameProject: '' });
      setInputError(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
    setInputError(false);
  };

  const handleCreateTeam = () => {
    if (!teamData.nameProject) {
      setInputError(true);
      return;
    }
    onCreate(teamData);
    handleClose(); // Cierra el modal al registrar el equipo
  };

  const handleClose = () => {
    setModalTransition(false); // Inicia la transición de cierre
    setTimeout(() => {
      onClose(); // Cierra el modal después de la transición
    }, 300); // Ajusta el tiempo según la duración de la transición
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black opacity-20"></div>
      <div
        className={`relative md:w-2/6 h-[40%] max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg transition-transform
          ${modalTransition ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}
      >
        <div className="p-6 w-full h-full">
          <div className='flex justify-center items-center'>
            <h1 className="text-[#0e324d] font-inter font-bold text-2xl flex">Nuevo Proyecto</h1>
          </div>
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <p className=" text-center text-lg font-inter font-medium text-black-700 py-3 ">¿Cuál es el nombre de tu proyecto?</p>
            <div className='pb-12'>
              <div className={`rounded-md border-double border-2 text-custom-blue ${inputError ? 'border-red-500' : 'border-gray-300'}`}>
                <input type="text" name="nameProject" placeholder="Escribe aquí" value={teamData.nameProject} onChange={handleInputChange} className={`${inputError ? 'text-red-500' : 'text-black'}`} />
              </div>
              {inputError && <p className="text-red-500 text-xs">Este campo es obligatorio.</p>}
            </div>
            
            <div className='flex text-xs space-x-4'>
            <button
            className={`text-sm hover:bg-[#F44336] hover:text-white transition-colors duration-300 focus:outline-none rounded-md bg-white px-8 py-4 border text-black
              ${modalTransition ? "scale-100 opacity-100" : "scale-75 opacity-0"}
            `}
            onClick={handleClose}
            > 
                Cancelar
              </button>
              <button
                className={`text-sm hover:bg-[#01b001] transition-colors duration-300 focus:outline-none rounded-md bg-custom-blue px-8 py-4 border text-white
                  ${modalTransition ? "scale-100 opacity-100" : "scale-75 opacity-0"}
                `}
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
