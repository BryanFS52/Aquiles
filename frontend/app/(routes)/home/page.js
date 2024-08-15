"use client";

import React, { useState, useEffect } from 'react'; 
import { Header } from "../../components/header"; //importaciones del Header y el Sidebar
import { Sidebar } from "../../components/sidebar";
import { ToastContainer, toast } from "react-toastify"; //importacion de la libreria ToastContainer para las alertas con la animacion 
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
 

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />
      <div className='bg-orange-600' ><span>Dashboard</span></div>
        
      </div>
      <ToastContainer />
    </div>
  );
}
