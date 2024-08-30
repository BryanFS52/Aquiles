"use client"
import React from 'react';

const ModalJustificacion = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
<div>
    <h1 className='font-serif text-center'>Justificacion</h1>
    <div className="rounded-lg border-solid border-2 text-custom-blue">
        <div id="editableArea" contentEditable="true" className='text-base text-gray-950 p-4'>
        Características del Proyecto:<br/>
        1) Interfaz de Usuario Intuitiva: La aplicación contará con un diseño limpio y fácil de navegar, permitiendo a los usuarios registrar la asistencia con unos pocos
         toques. La interfaz será compatible con dispositivos iOS y Android.<br/>
        2) Funcionalidad de Registro Rápido: Los usuarios podrán registrar la asistencia mediante diversas opciones, como códigos QR, tarjetas NFC, o introducción manual
         de datos. Esto garantizará flexibilidad y rapidez en el proceso de registro.<br/>
        3) Gestión de Usuarios: La aplicación permitirá la creación y gestión de perfiles para estudiantes, empleados, maestros y administradores, con diferentes niveles 
        de acceso y permisos.<br/>
        4) Notificaciones y Recordatorios: Se implementarán notificaciones automáticas para alertar a los usuarios sobre ausencias, retardos y eventos importantes,
         ayudando a mantener una comunicación efectiva entre todas las partes involucradas.
        </div>
    </div>
</div>
  );
};

export default ModalJustificacion;