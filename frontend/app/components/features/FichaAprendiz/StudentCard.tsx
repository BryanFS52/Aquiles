"use client";

import React from "react";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import { HiSparkles, HiAcademicCap } from "react-icons/hi";

interface StudentCardProps {
  student: {
    id?: string | number | null;
    person?: {
      name?: string | null;
      lastname?: string | null;
      email?: string | null;
      photo?: string | null;
    } | null;
  };
  index: number;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, index }) => {
  return (
    <div
      className="group relative bg-gradient-to-br from-white to-lightGray/50 dark:from-darkBlue dark:to-shadowBlue rounded-2xl p-6 shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Gradiente de hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-lightGreen/5 to-darkGreen/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center">
        {/* Avatar con estilo personalizado */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-lightGreen rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative">
            <Image
              src={
                student.person?.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(`${student.person?.name} ${student.person?.lastname}`)}&background=398F0F&color=fff&size=128`
              }
              alt={`${student.person?.name} ${student.person?.lastname}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-white dark:ring-shadowBlue shadow-lg group-hover:ring-primary/50 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-lightGreen rounded-full border-2 border-white dark:border-shadowBlue flex items-center justify-center">
              <div className="w-3 h-3 bg-darkGreen rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Información del estudiante */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-primary dark:group-hover:text-lightGreen transition-colors duration-300">
            {student.person?.name} {student.person?.lastname}
          </h3>

          <div className="flex items-center justify-center gap-2 text-sm text-darkGray dark:text-grayText">
            <FaEnvelope className="w-3 h-3 text-primary" />
            <span className="truncate max-w-full">{student.person?.email}</span>
          </div>
        </div>

        {/* Badge de estudiante con colores personalizados */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-lightGreen/10 dark:from-primary/20 dark:to-lightGreen/20 rounded-full text-xs font-medium text-primary dark:text-lightGreen border border-primary/20">
          <HiAcademicCap className="w-3 h-3" />
          Aprendiz SENA
        </div>
      </div>

      {/* Efecto decorativo */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <HiSparkles className="w-5 h-5 text-lightGreen animate-pulse" />
      </div>

      {/* Borde decorativo */}
      <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-primary/20 via-lightGreen/20 to-darkGreen/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default StudentCard;
