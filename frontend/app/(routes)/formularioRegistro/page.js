"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Sidebar } from '../../components/sidebar';
import { createApprentice } from '../../services/apprenticeService';

const RegisterPersonForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [program, setProgram] = useState('');
  const [email, setEmail] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nombre || !apellidos || !documentNumber || !documentType || !program || !email || !teamNumber) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', nombre);
    formData.append('lastName', apellidos);
    formData.append('documentNumber', documentNumber);
    formData.append('documentType', documentType);
    formData.append('program', program);
    formData.append('email', email);
    formData.append('teamNumber', teamNumber);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
  
    try {
      await createApprentice(formData);
      toast.success('¡Persona registrada con éxito!');
  
      setTimeout(() => {
        router.push('/asistencia');
      }, 2000);
  
      // Reset form fields
      setNombre('');
      setApellidos('');
      setDocumentNumber('');
      setDocumentType('');
      setProgram('');
      setEmail('');
      setTeamNumber('');
      setProfilePicture(null);
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
                <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos del Aprendiz:</label>
                <input id="apellidos" type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Número de Documento</label>
                <input id="documentNumber" type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                <input id="documentType" type="text" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-gray-700">Programa</label>
                <input id="program" type="text" value={program} onChange={(e) => setProgram(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Institucional</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="teamNumber" className="block text-sm font-medium text-gray-700">Número del Team</label>
                <input id="teamNumber" type="text" value={teamNumber} onChange={(e) => setTeamNumber(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" required />
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
