"use client"

import React from 'react';

const ModalEliminarTeam = ({ isOpen, onClose, onConfirm }) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-custom-blue bg-opacity-50">
      <div className="bg-white p-6 md:p-16 w-full md:w-2/5 mx-4 md:mx-0 rounded-lg shadow-lg border-2 border-gray-400 shadow-gray-400/50">
        <h1 className="text-lg md:text-xl mb-4 font-medium text-center">
          ¡Está a punto de eliminar un Proyecto!
          <br />¿Está seguro de que deseas proceder?
        </h1>
        <h2 className="text-center text-sm md:text-base w-full md:w-96 mx-auto pt-6">
          Ten en cuenta que al eliminar un proyecto, no habrá forma de recuperarlo.
          <br />Esta acción es irreversible y significará la pérdida permanente de toda la información y el progreso relacionado con el proyecto. Asegúrate de estar completamente seguro antes de proceder con la eliminación.
        </h2>
        <div className="flex flex-col md:flex-row justify-center pt-6 md:pt-16 space-y-4 md:space-y-0 md:space-x-24">
          <button onClick={onClose} className="px-6 md:px-10 py-2 bg-gray-300 border-2 border-gray-400 rounded-lg font-medium text-lg md:text-xl">Cancelar</button>
          <button onClick={onConfirm} className="px-6 md:px-10 py-2 bg-red-600 border-2 border-red-400 text-white rounded-lg font-medium text-lg md:text-xl">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarTeam;
