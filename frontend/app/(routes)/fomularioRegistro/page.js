"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Importamos useRouter para redirección
import { Header } from '../../components/header';
import { Sidebar } from '../../components/sidebar';
import { createApprentice } from '../../services/apprenticeService';

const RegisterPersonForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellidos || !documentNumber) {
      toast.error('Por favor, completa todos los campos.');
      return; 
    }

    const newApprentice = { 
      name: nombre, 
      lastName: apellidos, 
      documentNumber
    };

    console.log('JSON to be sent:', JSON.stringify(newApprentice));

    try {
      await createApprentice(newApprentice);
      toast.success('¡Persona registrada con éxito!');

      setTimeout(() => {
        router.push('/asistencia');
      }, 2000); 

      setNombre('');
      setApellidos('');
      setDocumentNumber('');
    } catch (error) {
      console.error('Error creating apprentice:', error);
      toast.error('Error al registrar la persona.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className='pt-20'>
          <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md border-2 border-zinc-200">
            <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Aprendiz: </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombres del Aprendiz</label>
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
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos del Aprendiz:</label>
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

              <button 
                type="submit" 
                className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg"
              >
                Agregar Aprendiz
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPersonForm;
