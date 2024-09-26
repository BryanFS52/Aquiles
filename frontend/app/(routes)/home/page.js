"use client";

import React from 'react'; 
import { Header } from "../../components/header"; // Importaciones del Header
import AppSidebar from "../../components/AppSidebar"; // Cambiar a AppSidebar
import { ToastContainer } from "react-toastify"; // Importación de la librería ToastContainer para las alertas con la animación 
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <AppSidebar /> {/* Usar AppSidebar en lugar de Sidebar */}
      <div className="xl:col-span-5">
        <Header />
        <div className='bg-[#40b003]'>
          <span>Dashboard</span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
