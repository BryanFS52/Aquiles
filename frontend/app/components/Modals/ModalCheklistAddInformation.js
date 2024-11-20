import React, { useState } from 'react';
import Modal from 'react-modal'; // Usando react-modal para el modal
import { MdClose } from 'react-icons/md';

Modal.setAppElement('#root'); // Importante para accesibilidad

const ModalChecklistAddInformation = ({ isOpen, onClose, onSubmit }) => {
  const [information, setInformation] = useState('');

  const handleInputChange = (e) => {
    setInformation(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (information.trim() === '') {
      alert('Por favor ingresa la información');
      return;
    }
    onSubmit(information); // Llamar la función pasada para agregar la información
    setInformation(''); // Limpiar el campo de texto
    onClose(); // Cerrar el modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Información"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#00324d]">Agregar Información</h2>
        <button onClick={onClose} className="text-[#00324d] text-xl">
          <MdClose />
        </button>
      </div>
      <form onSubmit={handleFormSubmit} className="modal-body">
        <div className="mb-4">
          <label htmlFor="information" className="block text-[#00324d] font-medium">
            Información:
          </label>
          <textarea
            id="information"
            value={information}
            onChange={handleInputChange}
            placeholder="Escribe la información aquí..."
            className="w-full p-3 border rounded-lg mt-2"
            rows="4"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-white rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00324d] hover:bg-[#40b003] text-white rounded-lg"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalChecklistAddInformation;
