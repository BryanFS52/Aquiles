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
  const [typeDocument, setTypeDocument] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [errors, setErrors] = useState({
    nombre: false,
    apellidos: false,
    documentNumber: false,
    typeDocument: false,
    dateOfBirth: false,
    bloodType: false,
    email: false,
    phone: false,
    address: false,
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
      typeDocument: !typeDocument,
      dateOfBirth: !dateOfBirth,
      bloodType: !bloodType,
      email: !email,
      phone: !phone,
      address: !address,
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
      documentNumber,
      typeDocument,
      dateOfBirth,
      bloodType,
      email,
      phone,
      address,
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

      // Reset fields
      setNombre('');
      setApellidos('');
      setDocumentNumber('');
      setTypeDocument('');
      setDateOfBirth('');
      setBloodType('');
      setEmail('');
      setPhone('');
      setAddress('');
      setErrors({
        nombre: false,
        apellidos: false,
        documentNumber: false,
        typeDocument: false,
        dateOfBirth: false,
        bloodType: false,
        email: false,
        phone: false,
        address: false,
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
                <label htmlFor="typeDocument" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                <input 
                  id="typeDocument"
                  type="text"
                  value={typeDocument}
                  onChange={(e) => setTypeDocument(e.target.value)} 
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.typeDocument ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
                  required
                />
              </div>

              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-700">Documento</label>
                <input 
                  id="document"
                  type="text"
                  value={documentNumber}
                  onChange={handleDocumentNumberChange} 
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.documentNumber ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombres</label>
                <input 
                  id="name"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)} 
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.nombre ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
                <input 
                  id="lastName"
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)} 
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.apellidos ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
                  required
                />
              </div>
             
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Fecha de Cumpleaños</label>
                <input 
                  id="dateOfBirth" 
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.dateOfBirth ? 'border-red-500 animate-shake' : 'border-gray-300'}`} 
                  required
                />
              </div>
             
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Tipo de Sangre</label>
                <input 
                  id="bloodType" 
                  type="text"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.bloodType ? 'border-red-500 animate-shake' : 'border-gray-300'}`} 
                  required
                />
              </div>
             
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.email ? 'border-red-500 animate-shake' : 'border-gray-300'}`} 
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input 
                  id="phone" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.phone ? 'border-red-500 animate-shake' : 'border-gray-300'}`} 
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                <input 
                  id="address" 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`mt-1 block w-full border rounded-lg py-2 px-3 ${errors.address ? 'border-red-500 animate-shake' : 'border-gray-300'}`} 
                  required
                />
              </div>

              <div className="mt-4">
                <button type="submit" className="w-full bg-custom-blue text-white py-2 rounded-lg hover:bg-green-600 transition">
                  Agregar Aprendiz
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPersonForm;
