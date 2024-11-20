"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeaderCoordinador } from "../../components/HeaderCoordinador";
import { Sidebarcoordinador } from '../../components/SidebarCoordinador';

// Definición del componente Card
const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-xl rounded-lg p-8 w-full md:w-auto lg:w-auto ${className}`}>
    {children}
  </div>
  );
};

// Definición del componente CardHeader
const CardHeader = ({ children }) => {
  return (
    <div className="mb-4 border-b pb-2">
      {children}
    </div>
  );
};

// Definición del componente CardTitle
const CardTitle = ({ children }) => {
  return (
    <h2 className="text-xl font-semibold">
      {children}
    </h2>
  );
};

// Definición del componente CardContent
const CardContent = ({ children }) => {
  return (
    <div className="text-gray-700">
      {children}
    </div>
  );
};

// Definición del componente Button
const Button = ({ children, onClick, className }) => {
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

const FichasCoordinator = () => {
  const router = useRouter();

  // Funciones para redirigir a las rutas correspondientes
  const handleInstructorAsignacion = () => {
    router.push('/InstructorTechnicalAssign'); // Ruta para la asignación de instructor técnico
  };

  const handleMultipleAsignacion = () => {
    router.push('/InstructorAssignMultipleSheets'); // Ruta para la asignación a múltiples fichas
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebarcoordinador />
      <div className="xl:col-span-5">
        <HeaderCoordinador />
        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Asignación de Instructores a Fichas
          </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="w-[300px]">
                <CardHeader>
                  <CardTitle>Asignación de Instructor Técnico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Asigne un instructor técnico a una ficha específica.</p>
                  <Button onClick={handleInstructorAsignacion} className="mt-4 w-full">Asignar</Button>
                </CardContent>
              </Card>
              <Card className="w-[300px]">
                <CardHeader>
                  <CardTitle>Asignación de Instructor a Múltiples Fichas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Asigne un instructor a varias fichas simultáneamente.</p>
                  <Button onClick={handleMultipleAsignacion} className="mt-4 w-full">Asignar</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FichasCoordinator;
