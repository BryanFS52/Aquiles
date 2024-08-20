"use client"
import React from 'react';

const ModalDescripcion = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
<div>
    <h1 className='font-serif text-center'>Descripción</h1>
    <div className="rounded-lg border-solid border-2 text-custom-blue">
        <div id="editableArea" contentEditable="true" className='text-base text-gray-950 p-4'>
        Desarrollo de la Aplicación Móvil de Gestión de Asistencia
        tiene como objetivo crear una solución integral para el seguimiento y la gestión de la asistencia
        en instituciones educativas y empresas.
        Esta aplicación proporcionará a los usuarios una plataforma fácil de usar para registrar, monitorear y analizar la asistencia de estudiantes y empleados en tiempo real.
        </div>
    </div>
</div>

  );
};

export default ModalDescripcion;