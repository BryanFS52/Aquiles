import React, { useState } from 'react';
import ModalDescripcion from '@components/Modals/modalDescripcion';
import ModalProblematicas from '@components/Modals/modalProblematicas';
import ModalObjetivos from '@components/Modals/modalObjetivos';
import ModalJustificacion from '@components/Modals/modalJustificacion';
import ModalVerMas from '@components/Modals/modalVerMas';

const ModalComponent = ({ isOpen, onClose }) => {
  const [buttonText, setButtonText] = useState('Descripción');
  const [currentModal, setCurrentModal] = useState('Descripcion');

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
          {/* Botones superiores */}
          <div className='flex text-xs md:space-x-6 justify-center flex-col md:flex-row'>
            {/* Botón dinámico para Descripción/Información */}
            <button
              onClick={() => handleButtonClick(currentModal === 'Descripcion' ? 'VerMas' : 'Descripcion')}
              className={`rounded-lg transition-colors md:px-4 py-1 my-1 border font-medium ${currentModal === 'Descripcion'
                ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              {buttonText}
            </button>
            {/* Otros botones para diferentes modales */}
            <button
              onClick={() => handleButtonClick('Problematicas')}
              className={`rounded-lg transition-colors md:px-4 py-1 my-1 border font-medium ${currentModal === 'Problematicas'
                ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              Problemática
            </button>
            <button
              onClick={() => handleButtonClick('Objetivos')}
              className={`rounded-lg transition-colors md:px-4 py-1 my-1 border font-medium ${currentModal === 'Objetivos'
                ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              Objetivos
            </button>
            <button
              onClick={() => handleButtonClick('Justificacion')}
              className={`rounded-lg transition-colors md:px-4 py-1 my-1 border font-medium ${currentModal === 'Justificacion'
                ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              Justificación
            </button>
          </div>

          {/* Título dinámico */}
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-darkBlue md:mt-10">
              {currentModal === 'Descripcion' && 'Descripción'}
              {currentModal === 'Problematicas' && 'Problemáticas'}
              {currentModal === 'Objetivos' && 'Objetivos'}
              {currentModal === 'Justificacion' && 'Justificación'}
              {currentModal === 'VerMas' && 'Información del Team'}
            </h1>
          </div>

          {/* Contenido del modal */}
          <div className='flex flex-col my-6 items-center'>
            {currentModal === 'Descripcion' && <ModalDescripcion isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'Problematicas' && <ModalProblematicas isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'Objetivos' && <ModalObjetivos isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'Justificacion' && <ModalJustificacion isOpen={isOpen} onClose={onClose} />}
            {currentModal === 'VerMas' && <ModalVerMas isOpen={isOpen} onClose={onClose} />}
          </div>

          {/* Botones inferiores */}
          <div className='flex justify-between w-full text-xs space-x-4 text-white mt-12 px-32'>
            <button
              className='bg-lightGreen hover:bg-darkGreen rounded-md transition-colors px-8 py-4 font-medium'
            >
              Editar Información
            </button>
            <button
              onClick={onClose}
              className='bg-darkGray hover:bg-shadowBlue rounded-md transition-colors px-8 py-4 font-medium'
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
