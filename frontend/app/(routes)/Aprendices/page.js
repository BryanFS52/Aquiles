// ListaApprentices.js
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "../../components/header";
import { Sidebar } from "../../components/Sidebar";
import { getAllApprentices } from "../../services/apprenticeService";
import { useApprentices } from '../../context/ApprenticeContext';

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
      <Sidebar />
      <div className="xl:col-span-5 w-full">
        <Header />
        <div className="text-custom-blue font-bold text-2xl sm:text-3xl lg:text-4xl ml-4 sm:ml-10 py-4 sm:py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">
          Aprendices
        </div>

        <div className="flex justify-center mr-auto mb-6 px-4 sm:px-10">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg w-full max-w-xl"
          />
        </div>

        <div className="flex justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border-2 border-gray-200 overflow-x-auto max-h-[35rem]">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 w-16 sm:w-20 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white">
                      Foto
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 w-16 sm:w-20 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white">
                      Tipo de Documento
                    </th>
                    <th className="px-2 sm:px-4 w-48 sm:w-96 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white text-center">
                      Número de Identificación
                    </th>
                    <th className="px-2 sm:px-4 w-48 sm:w-96 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white text-center">
                      Programa
                    </th>
                    <th className="px-2 sm:px-4 w-24 sm:w-20 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white">
                      Nombres
                    </th>
                    <th className="px-2 sm:px-4 w-24 sm:w-20 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white">
                      Apellidos
                    </th>
                    <th className="px-2 sm:px-4 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white">
                      Correo Institucional
                    </th>
                    <th className="px-2 sm:px-4 border-2 border-gray-300 bg-sky-950 text-xs sm:text-sm font-semibold text-white">
                      Número del Team
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {filteredApprentices.map((apprentice) => (
                    <tr key={apprentice.documentNumber}>
                      <td className="px-2 sm:px-4 py-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.profilePicture ? (
                          <img src={apprentice.profilePicture} alt="Profile" className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-full" />
                        ) : 'N/A'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.documentType}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.documentNumber}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.program}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.name}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.lastName}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
                        {apprentice.email || 'N/A'}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-xs sm:text-sm text-center">
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
