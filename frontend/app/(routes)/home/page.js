"use client"

import React, { useState } from 'react'; 
import Link from "next/link";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { MdAdd } from "react-icons/md";
import ModalNewProject from '../../components/Modals/modalNewProject';
import { MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import ModalComponent from '../../components/Modals/modalComponent';
import { MdAdd } from "react-icons/md";
import {GoChecklist} from "react-icons/GoChecklist";

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

    <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
        <h1 className="font-serif text-4xl pb-3 border-b-2 border-gray-400 w-1/2">Teams Scrums </h1>
        <br/>
          <li className="h-9 w-14 flex items-center justify-center border-2 rounded-lg bg-cyan-900 hover:bg-green-600 ml-auto">
                <a href="#" onClick={handleOpenModal}>
                      {""}
                      <MdAdd className="w-8 h-8"/>
                </a>
          </li>
        <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} /> {/* se llama la funcion del modal para que pueda abrir y cerrar */}

        
        <div class="w-1/3 h-56 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div> {/*linea de codigo para la linea azul */}
          <div class="px-6 py-4">
          <div className="flex ">
								<span className="font-serif text-xl mb-2">Nombre del Proyecto</span>
								<button onClick={OpenModal} className="font-serif text-xl mb-2 relative z-20 ml-auto text-white after:block after:w-full after:h-[1px] after:bg-white after:mt-[4px]">
                  Ver Más 
                  </button>
							</div>

                <p class="text-black-700 text-base text-xs">Desarrollo de la Aplicación Móvil</p><br/>
                <div class="font-serif text-xl mb-2">Team Número</div>
                <p class="text-black-700 text-base text-xs">Equipo 5</p><br/>
                <div class="font-serif text-xl mb-2 flex">
                  <span>Agregar Información</span>
                  <Link href="/home" className="ml-2">
									<MdAddCircle className="inline-block text-2xl text-cyan-900" />
								</Link>
								<Link href="/home" className="ml-2 ml-auto">
									<FaTrashAlt className="inline-block text-2xl text-cyan-900" />
								</Link>
                    <button onClick={OpenModal} className="ml-2"> {/*se llama la funcion de javascript para que el modal se abra en la imagen */}
                    </button>
                </div>
          </div>  
        </div>
            <ModalComponent isOpen={openAgregarInfo} onClose={CloseModal} /> {/* se llama la funcion del modal para que pueda abrir y cerrar */}
      </div>
    </div>
  </div>

    );
}