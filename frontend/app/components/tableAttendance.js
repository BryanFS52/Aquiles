import React, { useEffect, useState } from 'react';
import { getAllApprentices } from "../services/apprenticeService";

const TablaApprentices = () => {
  const [apprentices, setApprentices] = useState([]);

  useEffect(() => {
    // Llamada al servicio para obtener todos los aprendices
    const fetchApprentices = async () => {
      try {
        const apprenticesData = await getAllApprentices();
        setApprentices(apprenticesData);
      } catch (error) {
        console.error('Error al obtener la lista de aprendices:', error);
      }
    };

    fetchApprentices();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Apellidos</th>
            <th className="py-2 px-4 border-b">Documento</th>
          </tr>
        </thead>
        <tbody>
          {apprentices.length > 0 ? (
            apprentices.map((apprentice, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{apprentice.name}</td>
                <td className="py-2 px-4 border-b">{apprentice.lastName}</td>
                <td className="py-2 px-4 border-b">{apprentice.documentNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No hay aprendices registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaApprentices;
