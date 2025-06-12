"use client";

import { useState } from "react";
import { FaUsers, FaRegClock, FaGraduationCap, FaRegListAlt } from "react-icons/fa";
import InfoBox from "@components/infoBox";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";

const ApprenticeView = () => {
  const [apprenticeData] = useState({
    ficha: "123456",
    jornada: "Mañana",
    programa: "Análisis y Desarrollo de Software",
    compañeros: [
      { name: "Juan", lastName: "Pérez", documentNumber: "001", email: "juan.perez@example.com", profilePicture: null },
      { name: "Ana", lastName: "García", documentNumber: "002", email: "ana.garcia@example.com", profilePicture: null },
      { name: "Luis", lastName: "Rodríguez", documentNumber: "003", email: "luis.rodriguez@example.com", profilePicture: null }
    ]
  });

  const { ficha, compañeros, jornada, programa } = apprenticeData;

  return (
    <div className="space-y-8 w-full">
      {/* Título */}
      <PageTitle>Ficha y Aprendices</PageTitle>

      {/* InfoBoxes */}
      <div className="flex flex-col items-center justify-center space-y-5 w-full max-w-full md:flex-row md:flex-wrap md:justify-center md:space-y-0 md:space-x-8">
        <InfoBox title="Ficha" textInfo={ficha} icon={FaRegListAlt} />
        <InfoBox title="Compañeros" textInfo={compañeros.length} icon={FaUsers} />
        <InfoBox title="Jornada" textInfo={jornada} icon={FaRegClock} />
        <InfoBox title="Programa" textInfo={programa} icon={FaGraduationCap} className="md:w-64" />
      </div>

      {/* Lista de compañeros */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Compañeros de la ficha:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {compañeros.map((compañero) => (
            <div key={compañero.documentNumber} className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <Image
                src={
                  compañero.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(compañero.name + ' ' + compañero.lastName)}&background=0D8ABC&color=fff`
                }
                alt="Profile"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-darkGreen/20 dark:border-blue-400"
              />
              <p className="text-lg font-semibold text-black dark:text-white">{compañero.name} {compañero.lastName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">{compañero.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprenticeView;
