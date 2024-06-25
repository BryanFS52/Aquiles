import React, { useState } from 'react';
import ModalComponent from './modalComponent'; // Ajusta la ruta según tu estructura de archivos


const ModalsContainer = () => {


  const [modals, setModals] = useState([
    { id: 1, isOpen: false, content: 'Contenido del Modal 1' },
    { id: 2, isOpen: false, content: 'Contenido del Modal 2' },
    { id: 3, isOpen: false, content: 'Contenido del Modal 3' },
    { id: 4, isOpen: false, content: 'Contenido del Modal 4' }
  ]);


  const openModal = (modalId) => {
    const updatedModals = modals.map(modal =>
      modal.id === modalId ? { ...modal, isOpen: true } : modal
    );
    setModals(updatedModals);
  };


  const closeModal = (modalId) => {
    const updatedModals = modals.map(modal =>
      modal.id === modalId ? { ...modal, isOpen: false } : modal
    );
    setModals(updatedModals);
  };


  return (
    <div>
      {modals.map(modal => (
        <ModalComponent
          key={modal.id}
          isOpen={modal.isOpen}
          closeModal={() => closeModal(modal.id)}
          modalContent={modal.content}
        />
      ))}


      <div>
        {modals.map(modal => (
          <button key={modal.id} onClick={() => openModal(modal.id)}>
            Abrir Modal {modal.id}
          </button>
        ))}
      </div>
    </div>
  );
};


export default ModalsContainer;