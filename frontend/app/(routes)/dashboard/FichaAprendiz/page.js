"use client";

import { useState } from 'react';
import InfoBox from "@components/infoBox";
import { FaUsers, FaRegClock, FaGraduationCap, FaRegListAlt } from "react-icons/fa"; // Iconos

const ApprenticeView = () => {
  // Datos simulados  
  const [apprenticeData,] = useState({
    ficha: "123456",
    jornada: "Mañana",
    programa: "Analisís y Desarrollo de Software",
    compañeros: [
      { name: "Juan", lastName: "Pérez", documentNumber: "001", email: "juan.perez@example.com", profilePicture: null },
      { name: "Ana", lastName: "García", documentNumber: "002", email: "ana.garcia@example.com", profilePicture: null },
      { name: "Luis", lastName: "Rodríguez", documentNumber: "003", email: "luis.rodriguez@example.com", profilePicture: null }
    ]
  });

  const { ficha, compañeros, jornada, programa } = apprenticeData;

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <div className="xl:col-span-5">
        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-lightGreen dark:text-darkBlue ">
            Ficha y Aprendices
          </h1>

          <div className="flex flex-col items-center justify-center space-y-5 w-full max-w-full md:flex-row md:flex-wrap md:justify-center md:space-y-0 md:space-x-8">

            {/* Ficha */}
            <InfoBox title="Ficha" textInfo={ficha} icon={FaRegListAlt} />
            {/* Compañeros */}
            <InfoBox title="Compañeros" textInfo={compañeros.length} icon={FaUsers} />
            {/* Jornada */}
            <InfoBox title="Jornada" textInfo={jornada} icon={FaRegClock} />
            {/* Programa */}
            <InfoBox title="Programa" textInfo={programa} icon={FaGraduationCap} className="md:w-64" />

          </div>

          {/* Listado de compañeros */}
          <div className="mt-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Compañeros de la ficha:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {compañeros.map(compañero => (
                <div key={compañero.documentNumber} className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg">
                  <img
                    src={
                      compañero.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(compañero.name + ' ' + compañero.lastName)}&background=0D8ABC&color=fff`
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                  <p className="text-lg font-semibold">{compañero.name} {compañero.lastName}</p>
                  <p className="text-sm text-gray-500">{compañero.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApprenticeView;