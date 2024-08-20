import React, { useState } from 'react';
import ModalDescripcion from '../Modals/modalDescripcion';
import ModalProblematicas from './modalProblematicas';
import ModalObjetivos from './modalObjetivos';
import ModalJustificacion from './modalJustificacion';
import ModalVerMas from './modalVerMas';


  const ModalComponent = ({ isOpen, onClose, modalContent }) => {
  const [buttonText, setButtonText] = useState('Descripción');
  const [currentModal, setCurrentModal] = useState('Descripcion');   // Se cambia segun el estado de cada modalContent, de informacion y de descripcion//


  const handleButtonClick = (modalType) => {
    if (modalType === 'Descripcion') {
      setButtonText('Información');
    } else {
      setButtonText('Descripción');
    }
    setCurrentModal(modalType);
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative w-[90%] md:w-[35%] mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5 h-full">
          <div className='flex text-xs md:space-x-6 justify-center flex-col md:flex-row'>
            {/* Botón dinámico para Descripción/Información */}
            <button
              onClick={() => handleButtonClick(currentModal === 'Descripcion' ? 'VerMas' : 'Descripcion')}
              className={`rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black ${currentModal === 'Descripcion' ? 'border-black' : 'border-gray-300'}`}
            >
              {buttonText}
            </button>
            {/* Otros botones para diferentes modales */}
            <button
              onClick={() => handleButtonClick('Problematicas')}
              className={`rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black ${currentModal === 'Problematicas' ? 'border-black' : 'border-gray-300'}`}
            >
              Problemática
            </button>
            <button
              onClick={() => handleButtonClick('Objetivos')}
              className={`rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black ${currentModal === 'Objetivos' ? 'border-black' : 'border-gray-300'}`}
            >
              Objetivos
            </button>
            <button
              onClick={() => handleButtonClick('Justificacion')}
              className={`rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black ${currentModal === 'Justificacion' ? 'border-black' : 'border-gray-300'}`}
            >
              Justificación
            </button>
          </div>


          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-black md:mt-10">
              {/* Cambios dinamicos para cada uno de los titulos */}
              {currentModal === 'Descripcion' && 'Descripción'}
              {currentModal === 'Problematicas' && 'Problemáticas'}
              {currentModal === 'Objetivos' && 'Objetivos'}
              {currentModal === 'Justificacion' && 'Justificación'}
              {currentModal === 'VerMas' && 'Informacion del Team'}
            </h1>
          </div>


          <div className='flex flex-col my-6 items-center'>
            {/* Renderizado de modales según el estado actual */}
            {currentModal === 'Descripcion' && <ModalDescripcion isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'Problematicas' && <ModalProblematicas isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'Objetivos' && <ModalObjetivos isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'Justificacion' && <ModalJustificacion isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'VerMas' && <ModalVerMas isOpen={isOpen} onClose={onClose} />}
          </div>


          <div className='flex justify-between w-full text-xs space-x-4 text-white mt-12 px-32'>
            <button href="/home" className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border'>
              Editar Información
            </button>
            <button href="/home" className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border' onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ModalComponent;