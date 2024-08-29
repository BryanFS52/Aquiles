"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createApprentice } from '../../services/apprenticeService';

const RegisterPersonForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentType, setDocumentType] = useState('CC'); // Añadido un campo para tipo de documento

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nombre || !apellidos || !documentNumber || !documentType) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }
  
    const newApprentice = { 
      name: nombre, 
      lastName: apellidos, // Asegúrate de que esta clave coincida con la del backend
      documentType,
      documentNumber
    };
  
    console.log('JSON to be sent:', JSON.stringify(newApprentice)); // Imprime el JSON que se va a enviar
  
    try {
      await createApprentice(newApprentice);
      toast.success('¡Persona registrada con éxito!');
      setNombre('');
      setApellidos('');
      setDocumentNumber('');
      setDocumentType('CC');
    } catch (error) {
      console.error('Error creating apprentice:', error);
      toast.error('Error al registrar la persona.');
    }
  };
  

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Registrar Persona</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3"
            required
          />
        </div>
        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            id="apellidos"
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3"
            required
          />
        </div>
        <div>
          <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Documento</label>
          <input
            id="documentNumber"
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3"
            required
          />
        </div>
        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3"
            required
          >
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjero</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Registrar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterPersonForm;
