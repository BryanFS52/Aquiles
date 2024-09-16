// ListaApprentices.js
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { getAllApprentices } from "../../services/apprenticeService";
import { useApprentices } from '../../context/ApprenticeContext'; // Importar el contexto
import { Sidebaraprendiz } from '@/components/sidebaraprendiz';

const ListaApprentices = () => {
  const { apprentices, setApprentices } = useApprentices();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const apprenticesData = await getAllApprentices();
        setApprentices(apprenticesData);
      } catch (error) {
        console.error('Error al obtener los aprendices:', error);
      }
    };

    fetchApprentices();
  }, [setApprentices]);

  const filteredApprentices = apprentices.filter(apprentice => 
    apprentice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.teamNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (apprentice.profilePicture ? apprentice.profilePicture.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header />
        <div className="text-custom-blue font-bold text-4xl ml-10 py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">
          Aprendices de la Ficha
        </div>

        <div className="flex justify-center mr-auto mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o número de identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg w-full max-w-xl"
          />
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-200 overflow-x-auto max-h-[35rem]">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  <tr>
                    <th className="px-4 py-3 w-28 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Foto
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Nombres
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Apellidos
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white text-center">
                      Programa
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Correo Institucional
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Número del Team
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {filteredApprentices.map((apprentice) => (
                    <tr key={apprentice.documentNumber}>
                      <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">
                      {apprentice.profilePicture ? (
                        <img src={apprentice.profilePicture} alt="Profile" className="w-16 h-16 object-cover" />
                        ) : 'N/A'}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.name}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.lastName}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.program} 
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.email || 'N/A'}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.teamNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaApprentices;
