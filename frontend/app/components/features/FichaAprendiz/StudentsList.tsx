"use client";

import React from "react";
import { FaUsers, FaUserGraduate } from "react-icons/fa";
import StudentCard from "./StudentCard";

interface Student {
  id?: string | number | null;
  person?: {
    name?: string | null;
    lastname?: string | null;
    email?: string | null;
    photo?: string | null;
  } | null;
}

interface StudentsListProps {
  students: Student[];
}

const StudentsList: React.FC<StudentsListProps> = ({ students }) => {
  return (
    <div className="bg-white dark:bg-shadowBlue rounded-3xl shadow-xl border border-lightGray dark:border-darkGray overflow-hidden">
      {/* Header con gradiente de la paleta */}
      <div className="bg-gradient-to-r from-primary via-lightGreen to-darkGreen px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <FaUserGraduate className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Compañeros de la Ficha</h2>
            <p className="text-white/80 mt-1">Conoce a tu comunidad de aprendizaje</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {students.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-lightGray dark:bg-darkGray/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-darkGray dark:text-grayText" />
            </div>
            <p className="text-darkGray dark:text-grayText text-lg">No hay compañeros registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student: Student, index: number) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS para animaciones personalizadas */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentsList;
