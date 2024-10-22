"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceForm = () => {
  const [component, setComponent] = useState('');
  const [sheet, setSheet] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!documentNumber || !documentType || !component || !sheet) {
      toast.error('Por favor, completa todos los campos.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const attendanceData = {
      component,
      sheet,
      documentType,
      documentNumber,
    };

    console.log('Attendance data:', attendanceData);
    toast.success('Asistencia registrada con éxito!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Reset fields
    setComponent('');
    setSheet('');
    setDocumentType('');
    setDocumentNumber('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Hora de tomar la asistencia aprendiz</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="component" className="block text-sm font-medium text-gray-700">Componente</label>
            <input
              type="text"
              id="component"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              placeholder="Componente (Default)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="sheet" className="block text-sm font-medium text-gray-700">Ficha</label>
            <input
              type="text"
              id="sheet"
              value={sheet}
              onChange={(e) => setSheet(e.target.value)}
              placeholder="Ficha (Default)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de documento</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="" disabled>Seleccione un tipo de documento</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="TI">Tarjeta de identidad</option>
              {/* Puedes agregar más opciones según sea necesario */}
            </select>
          </div>

          <div>
            <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Número de documento</label>
            <input
              type="text"
              id="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ingrese el número de documento..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Enviar asistencia
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AttendanceForm;
