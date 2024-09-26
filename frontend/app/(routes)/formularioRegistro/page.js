"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; 
import { Header } from '../../components/header';
import { Sidebar } from '../../components/Sidebar';
import { createApprentice } from '../../services/apprenticeService';

const RegisterPersonForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [errors, setErrors] = useState({
    nombre: false,
    apellidos: false,
    documentNumber: false,
  });
  const router = useRouter(); 

  const handleDocumentNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setDocumentNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      nombre: !nombre,
      apellidos: !apellidos,
      documentNumber: !documentNumber || documentNumber.length !== 10,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      toast.error('Por favor, completa todos los campos correctamente.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
      toast.success('¡Persona registrada con éxito!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        router.push('/asistencia');
      }, 2000); 

      setNombre('');
      setApellidos('');
      setDocumentNumber('');
      setErrors({
        nombre: false,
        apellidos: false,
        documentNumber: false,
      });
    } catch (error) {
      console.error('Error creating apprentice:', error);
      toast.error('Error al registrar la persona.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombres del Aprendiz</label>
                <input id="nombre"type="text"value={nombre}onChange={(e) => setNombre(e.target.value)} className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.nombre ? 'border-red-500 animate-shake' : 'border-gray-300'}`}required/>
              </div>
              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos del Aprendiz:</label>
                <input id="apellidos" type="text"value={apellidos}onChange={(e) => setApellidos(e.target.value)}className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.apellidos ? 'border-red-500 animate-shake' : 'border-gray-300'}`}required/>
              </div>
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Documento</label>
                <input id="documentNumber"type="text"value={documentNumber}onChange={handleDocumentNumberChange} className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.documentNumber ? 'border-red-500 animate-shake' : 'border-gray-300'}`}required/>
              </div>

              <button type="submit" className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg">
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