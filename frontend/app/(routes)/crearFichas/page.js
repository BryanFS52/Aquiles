"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components/header"; 
import { Sidebarcoordinador } from "../../components/SidebarCoordinador";
import { TbArrowBigRight } from "react-icons/tb";
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';
import ModalFichas from "../../components/Modals/modalFichas"; 
import axios from 'axios'; 

export default function Options() {
  const [fichas, setFichas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const response = await axios.get('/api/fichas'); 
        setFichas(response.data); 
      } catch (error) {
        console.error("Error al obtener fichas:", error);
        toast.error('Error al obtener fichas.');
      }
    };

    fetchFichas(); 
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateFicha = (newFicha) => {
    setFichas([...fichas, { ...newFicha, id: fichas.length + 1 }]); 
    toast.success('¡Nueva Ficha creada con éxito!'); 
    handleCloseModal(); 
  };

  const handleDeleteFicha = async (fichaId) => {
    try {
      await axios.delete(`/api/fichas/${fichaId}`); 
      setFichas(fichas.filter(ficha => ficha.id !== fichaId)); 
      toast.success('Ficha eliminada exitosamente.');
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
      toast.error('Error al eliminar ficha.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebarcoordinador />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-4 sm:p-6 lg:p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Fichas Asignadas{" "}</h1>
          <div className="flex justify-end mb-6">
            <button onClick={handleOpenModal} className="flex items-center justify-center bg-[#00324d] hover:bg-[#40b003] text-white px-4 py-2 rounded-lg">
              <MdAdd className="mr-2" /> Añadir Ficha
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ml-0 sm:ml-4 lg:ml-8 py-4 sm:py-6 lg:py-7">
            {fichas.length > 0 ? (
              fichas.map((ficha) => (
                <div key={ficha.id} className="flex w-full sm:w-80 lg:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4">
                  <div className="z-50 justify-end p-4 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[#40b003] font-inter font-semibold text-xl sm:text-3xl">Ficha</span>
                      <p className="font-inter font-normal text-black text-sm sm:text-base">{ficha.numero}</p>
                    </div>
                    <div className="text-[#0e324d] font-inter font-semibold text-lg sm:text-xl space-y-2">
                      <span className="text-xl sm:text-2xl">Programa</span>
                      <p className="font-inter font-normal text-black text-sm sm:text-base">{ficha.programa}</p>
                    </div>
                  </div>
                  <a href="/teamScrum" className="z-50 text-4xl sm:text-5xl text-white ml-auto">
                    <TbArrowBigRight />
                  </a>
                  <button onClick={() => handleDeleteFicha(ficha.id)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2">
                    <span className="text-xs">Eliminar</span>
                  </button>
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] sm:border-t-[130px] border-t-[#0e324d] border-l-[180px] sm:border-l-[240px] border-l-transparent -z-1"></div>
                </div>
              ))
            ) : (
              <p>No hay fichas asignadas. Pulsa el botón + para crear una nueva ficha.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      <ModalFichas isOpen={isModalOpen} onClose={handleCloseModal} onCreate={handleCreateFicha} />
    </div>
  );
}
