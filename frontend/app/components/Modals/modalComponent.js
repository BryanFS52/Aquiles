import React, { useState, useEffect } from 'react';
import ModalDescripcion from '@components/Modals/modalDescripcion';
import ModalProblematicas from '@components/Modals/modalProblematicas';
import ModalObjetivos from '@components/Modals/modalObjetivos';
import ModalJustificacion from '@components/Modals/modalJustificacion';
import ModalVerMas from '@components/Modals/modalVerMas';
import { fetchProjectById } from '@/services/projectService'; // ajusta la ruta si es necesario

const ModalComponent = ({ isOpen, onClose, projectId }) => {
  const [buttonText, setButtonText] = useState('Descripción');
  const [currentModal, setCurrentModal] = useState('Descripcion');
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !projectId) {
      setProjectData(null);
      return;
    }

    setLoading(true);
    setError(null);
    fetchProjectById(projectId)
      .then(data => {
        setProjectData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error al cargar el proyecto');
        setLoading(false);
      });
  }, [isOpen, projectId]);

  const handleButtonClick = (modalType) => {
    if (modalType === 'Descripcion') {
      setButtonText('Información');
    } else {
      setButtonText('Descripción');
    }
    setCurrentModal(modalType);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white p-4">
        <p>{error}</p>
        <button
          onClick={onClose}
          className="mt-4 underline"
        >
          Cerrar
        </button>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white p-4">
        <p>No se encontró el proyecto</p>
        <button
          onClick={onClose}
          className="mt-4 underline"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative w-[90%] md:w-[35%] mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-6 h-full">
          {/* Botones superiores */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-sm">
            <button
              onClick={() => handleButtonClick(currentModal === 'Descripcion' ? 'VerMas' : 'Descripcion')}
              className={`px-4 py-1 rounded-md border font-medium transition-colors ${currentModal === 'Descripcion'
                  ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                  : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              {buttonText}
            </button>
            <button
              onClick={() => handleButtonClick('Problematicas')}
              className={`px-4 py-1 rounded-md border font-medium transition-colors ${currentModal === 'Problematicas'
                  ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                  : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              Problemática
            </button>
            <button
              onClick={() => handleButtonClick('Objetivos')}
              className={`px-4 py-1 rounded-md border font-medium transition-colors ${currentModal === 'Objetivos'
                  ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                  : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              Objetivos
            </button>
            <button
              onClick={() => handleButtonClick('Justificacion')}
              className={`px-4 py-1 rounded-md border font-medium transition-colors ${currentModal === 'Justificacion'
                  ? 'bg-darkBlue text-white border-darkBlue hover:bg-shadowBlue'
                  : 'bg-white text-darkGray border-lightGray hover:bg-lightGray'
                }`}
            >
              Justificación
            </button>
          </div>

          {/* Título dinámico */}
          <div className="flex justify-center mt-6">
            <h1 className="text-xl font-semibold border-b-2 border-darkBlue">
              {currentModal === 'Descripcion' && 'Descripción'}
              {currentModal === 'Problematicas' && 'Problemáticas'}
              {currentModal === 'Objetivos' && 'Objetivos'}
              {currentModal === 'Justificacion' && 'Justificación'}
              {currentModal === 'VerMas' && 'Información del Team'}
            </h1>
          </div>

          {/* Contenido del modal */}
          <div className="flex flex-col items-center my-6">
            {currentModal === 'Descripcion' && (
              <ModalDescripcion isOpen={isOpen} onClose={onClose} data={projectData.description} />
            )}
            {currentModal === 'Problematicas' && (
              <ModalProblematicas isOpen={isOpen} onClose={onClose} data={projectData.problem} />
            )}
            {currentModal === 'Objetivos' && (
              <ModalObjetivos isOpen={isOpen} onClose={onClose} data={projectData.objectives} />
            )}
            {currentModal === 'Justificacion' && (
              <ModalJustificacion isOpen={isOpen} onClose={onClose} data={projectData.justification} />
            )}
            {currentModal === 'VerMas' && (
              <ModalVerMas isOpen={isOpen} onClose={onClose} data={projectData.members} />
            )}
          </div>

          {/* Botones inferiores */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              className="bg-lightGreen text-white px-6 py-2 rounded-md font-medium hover:bg-darkGreen transition-colors"
            >
              Editar Información
            </button>
            <button
              onClick={onClose}
              className="bg-darkGray text-white px-6 py-2 rounded-md font-medium hover:bg-shadowBlue transition-colors"
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
