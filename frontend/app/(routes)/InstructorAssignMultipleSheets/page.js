"use client";

import { Clipboard, UserPlus, Users } from "lucide-react";
import React, { useState } from "react";
import { HeaderCoordinador } from "../../components/HeaderCoordinador";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import {  FaRegClock, FaGraduationCap, FaCalendarDay, FaRegListAlt } from "react-icons/fa"; // Iconos
import { Sidebarcoordinador } from '../../components/SidebarCoordinador';

// Implementación de los componentes personalizados

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`border-b p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={`border-t p-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`font-bold ${className}`}>{children}</h2>
);

const Checkbox = ({ id, checked, onChange }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={onChange}
    className="form-checkbox h-5 w-5 text-[#40b003]"
  />
);

// Componente principal con las implementaciones personalizadas
export default function Component({
  numeroAprendices = 25,
  numeroFicha = "2557678",
  tipoJornada = "Diurna",
  programa = "Desarrollo de Software",
  trimestre = 3,
  instructores = ["Juan Pérez", "María Gómez"],
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebarcoordinador />
      <div className="xl:col-span-5">
        <HeaderCoordinador />

         <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-3xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Asignación de Instructores a Múltiples Fichas</h1>

          <Card className="font-inter w-80 max-w-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[#0e324d] text-xl font-semibold">
                Ficha de Aprendizaje
              </CardTitle>
              <Checkbox
                id={`select-${numeroFicha}`}
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <FaRegListAlt className="text-[#0e324d] h-14 w-14 text-muted-foreground" />
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-semibold">{numeroAprendices}</span>
                    <span className="font-normal text-base text-muted-foreground">Aprendices</span>
                  </div>
               
                  <p className="font-normal text-lg text-muted-foreground">
                  <strong className="text-[#40b003] font-bold">Ficha: </strong> {numeroFicha}
                </p>

                </div>
              </div>
              <div className="mt-4 space-y-2">   

                <div className="flex items-center space-x-2">
                <FaRegClock className="text-[#0e324d] h-5 w-5 text-muted-foreground"/>
                <p className="text-base">
                <strong className="text-[#40b003] font-bold">Jornada:</strong> {tipoJornada}
                </p>
                </div>

                <div className="flex items-center space-x-2">
                <FaGraduationCap className="text-[#0e324d] h-5 w-5 text-muted-foreground"/>
                <p className="text-base">
                <strong className="text-[#40b003] font-bold">Programa:</strong> {programa}
                </p>
                </div>

                <div className="flex items-center space-x-2">
                <FaCalendarDay className="text-[#0e324d] h-5 w-5 text-muted-foreground"/>
                <p className="text-base">
                <strong className="text-[#40b003] font-bold">Trimestre:</strong> {trimestre}
                </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-[#0e324d] h-5 w-5 text-muted-foreground" />
                  <p className="text-sm">
                  <strong className="text-[#40b003] font-bold">Instructores:</strong> {instructores.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full flex justify-center items-center">
                <UserPlus className="mr-2 h-6 w-6" />
                Agregar Instructor
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
