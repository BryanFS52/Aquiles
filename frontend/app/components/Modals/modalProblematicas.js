"use client"
import React from 'react';

const ModalProblematicas = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
<div>
    <h1 className='font-serif text-center'>Problematica</h1>
    <div className="rounded-lg border-solid border-2 text-custom-blue">
        <div id="editableArea" contentEditable="true" className='text-base text-gray-950 p-4'>
        La gestión tradicional de la asistencia en instituciones educativas y empresas presenta varios desafíos y limitaciones que impactan negativamente 
        en la eficiencia, precisión y efectividad del proceso. A continuación, se detallan las principales problemáticas que el proyecto Desarrollo de la Aplicación 
        Móvil de Gestión de Asistencia pretende abordar:
        Errores Humanos: El registro manual de la asistencia, ya sea en hojas de papel o mediante sistemas arcaicos, es propenso a errores humanos. 
        Estos errores pueden incluir omisiones, registros incorrectos o duplicados, lo que afecta la precisión de los datos y dificulta la toma de decisiones informadas.
        Pérdida de Tiempo: Los métodos tradicionales de registro y seguimiento de asistencia son lentos y laboriosos, requiriendo una inversión considerable de 
        tiempo por parte de maestros, administradores y empleados. Este tiempo podría aprovecharse mejor en actividades educativas o productivas.
        </div>
    </div>
</div>
  );
};

export default ModalProblematicas;