"use client";

import React, { useEffect, useState } from 'react'; 
import { Header } from "../../components/header"; 
import SidebarRole from "../../components/SidebarRole"; 
import { ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol

  useEffect(() => {
    // Obtener el rol del localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role); // Guardar el rol en el estado
  }, []);

  // Mostrar carga o mensaje si el rol aún no está disponible
  if (!userRole) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <SidebarRole /> {/* Sidebar dinámico basado en los roles */}
      <div className="xl:col-span-5">
        <Header />
        <div className='bg-[#40b003]'>
          {userRole === 'instructor' && (
            <InstructorDashboard />
          )}
          {userRole === 'aprendiz' && (
            <AprendizDashboard />
          )}
          {userRole !== 'instructor' && userRole !== 'aprendiz' && (
            <NoAccess />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const InstructorDashboard = () => (
  <div>
    <h2>Bienvenido, Instructor</h2>
    <p>Aquí está el dashboard para instructores.</p>
  </div>
);

const AprendizDashboard = () => (
  <div>
    <h2>Bienvenido, Aprendiz</h2>
    <p>Aquí está el dashboard para aprendices.</p>
  </div>
);

const NoAccess = () => (
  <div>
    <h2>No tienes acceso a esta página</h2>
  </div>
);
