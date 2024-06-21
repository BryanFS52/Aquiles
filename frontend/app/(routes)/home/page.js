"use client"

import React, { useState } from 'react'; 
import Link from "next/link";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { MdAdd } from "react-icons/md";
import Modal from '../../components/modal';
import ModalagregarInfo from '../../components/modal-agregarinfo';
import { GoChecklist } from "react-icons/go";

export default function 
Home () {

  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const OpenModal = () => {
    setOpenModal(true);
  };

  const CloseModal = () => {
    setOpenModal(false);
  };



    return(
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar/>
    <div className="xl:col-span-5 ">
      <Header/>

    <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
        <h1 className="font-serif text-1xl md:text-4xl pb-3 border-b-2 border-gray-400 w-1/2">Teams Scrums </h1>
        <br/>
          <li className="h-8 w-12 flex items-center justify-center rounded-xl bg-custom-blue hover:bg-cyan-900 ml-auto mb-8 text-white">
                <a href="#" onClick={handleOpenModal}>
                      {""}
                      <MdAdd className="w-8 h-8"/>
                </a>
          </li>
        <Modal isOpen={modalOpen} onClose={handleCloseModal} /> {/* se llama la funcion del modal para que pueda abrir y cerrar */}

        
        <div class="md:w-1/3 h-56 rounded-lg overflow-hidden shadow-lg bg-zinc-200 ">
          <div class="px-6 py-4">
            <div class="font-serif text-xl mb-2">Nombre del Proyecto</div>
                <p class="text-black-700 text-base text-xs">Desarrollo de la Aplicación Móvil</p><br/>
                <div class="font-serif text-xl mb-2">Team Número</div>
                <p class="text-black-700 text-base text-xs">Equipo 5</p><br/>
                <div class="font-serif text-xl mb-2 flexbox">
                  <span>Agregar Información</span>
                    <button onClick={OpenModal} className="ml-2"> {/*se llama la funcion de javascript para que el modal se abra en la imagen */}
                        <GoChecklist className="inline-block text-xl" />
                    </button>
                </div>
          </div>  
        </div>
            <ModalagregarInfo isOpen={openAgregarInfo} onClose={CloseModal} /> {/* se llama la funcion del modal para que pueda abrir y cerrar */}
      </div>
    </div>
  </div>

    );
}