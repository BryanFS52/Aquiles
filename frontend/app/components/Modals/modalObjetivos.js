"use client"
import React from 'react';

const ModalObjetivos = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
<div>
    <h1 className='font-serif text-center'>Objetivos</h1>
    <div className="rounded-lg border-solid border-2 text-custom-blue">
        <div id="editableArea" contentEditable="true" className='text-base text-gray-950 p-4'>
        El proyecto Desarrollo de la Aplicación Móvil de Gestión de Asistencia propone una solución digital integral para abordar las problemáticas identificadas
        en la gestión tradicional de la asistencia. La aplicación móvil proporcionará una plataforma moderna y eficiente que optimizará el proceso de registro,
        seguimiento y análisis de la asistencia. A continuación, se detallan las características clave de la solución:<br/>
        1) Automatización del Registro de Asistencia: La aplicación permitirá registrar la asistencia de manera rápida y precisa mediante el uso de tecnologías avanzadas
         como códigos QR, tarjetas NFC y entradas manuales. Esto reducirá significativamente los errores humanos y el tiempo necesario para el registro.<br/>
        2) Accesibilidad en Tiempo Real: Los datos de asistencia estarán disponibles en tiempo real, permitiendo a los usuarios autorizados acceder y compartir 
        información de manera instantánea desde cualquier lugar y en cualquier momento. Esto mejorará la transparencia y la comunicación entre estudiantes, empleados, padres y administradores.
        </div>
    </div>
</div>
  );
};

export default ModalObjetivos;