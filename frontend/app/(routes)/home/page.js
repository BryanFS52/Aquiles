"use client"

import React, { useState, useEffect } from 'react'; 
import Link from "next/link";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { MdAdd } from "react-icons/md";
import ModalNewProject from '../../components/Modals/modalNewProject';
import { MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import ModalComponent from '../../components/Modals/modalComponent';
import { listTeamsScrum, createTeamScrum } from '../../services/teamScrumService'; // Importacion de los métodos del servicio
import { MdAdd } from "react-icons/md";
import {GoChecklist} from "react-icons/GoChecklist";
import ModalAddinformation from '../../components/modalAddInformation/modalAddinformation';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenModal] = useState(false);
  const [teams, setTeams] = useState([]); 

  useEffect(() => {
    fetchTeams(); 
  }, []);

  const fetchTeams = () => {
    listTeamsScrum() // Aqui se llama al servicio para obtener la lista de equipos
      .then(data => {
        setTeams(data); // Se actualiza el estado de equipos con la respuesta del servidor
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
      });
  };

  const handleCreateTeam = (team) => {
    createTeamScrum(team)
      .then(() => {
        fetchTeams(); 
        handleCloseModal(); // Cierra el modal de nuevo proyecto después de la creación exitosa del Team
      })
      .catch(error => {
        console.error('Error creating team:', error);
      });
  };

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

  const modalsOpen = () => {
    openModals(true);
  };

  const modalClose = () => {
    openModals(false);
  };


  return (
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <Sidebar />
        <div className="xl:col-span-5">
          <Header />
    
          <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
            <h1 className="font-serif text-4xl pb-3 border-b-2 border-gray-400 w-1/2">Teams Scrums</h1>
            <br />
            <li className="h-9 w-14 flex items-center justify-center border-2 rounded-lg bg-cyan-900 hover:bg-green-600 ml-auto">
              <a href="#" onClick={handleOpenModal}>
                <MdAdd className="w-8 h-8" />
              </a>
            </li>
            <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateTeam} />
    
            <div className="grid grid-cols-3 gap-4 mt-8">
              {teams.map((team) => (
                <div key={team.team_scrum_id} className="w-full rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
                  <div className="px-6 py-4">
                    <div className="flex">
                      <span className="font-serif text-xl mb-2">Nombre del Proyecto</span>
                      <button onClick={OpenModal} className="font-serif text-xl mb-2 relative z-20 ml-auto text-white after:block after:w-full after:h-[1px] after:bg-white after:mt-[4px]">
                        Ver Más
                      </button>
                    </div>
    
                    <p className="text-black-700 text-base text-sm">{team.nameProject}</p>
                    <br />
                    <div className="font-serif text-xl mb-2">Team Número</div>
                    <p className="text-black-700 text-base text-sm">{team.team_scrum_id}</p>
                    <br />
                    <div className="font-serif text-xl mb-2 flex">
                      <span>Agregar Información</span>
                      <Link href="/home" className="ml-2">
                        <MdAddCircle className="inline-block text-2xl text-cyan-900" />
                      </Link>
                      <Link href="/home" className="ml-2 ml-auto">
                        <FaTrashAlt className="inline-block text-2xl text-cyan-900" />
                      </Link>
                      <button onClick={OpenModal} className="ml-2">
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ModalComponent isOpen={openAgregarInfo} onClose={CloseModal} />
          </div>
        </div>
      </div>
    );
  }