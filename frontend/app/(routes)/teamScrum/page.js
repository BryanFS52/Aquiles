"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createApprentice } from '../../services/apprenticeService';

const RegisterPersonForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [documento, setDocumento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellidos || !documento) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    const newApprentice = { nombre, apellidos, documento };

    try {
      await createApprentice(newApprentice);
      toast.success('¡Persona registrada con éxito!');
      setNombre('');
      setApellidos('');
      setDocumento('');
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
          <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento</label>
          <input
            id="documento"
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3"
            required
          />
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
