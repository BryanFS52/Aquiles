"use client";

import React, { useState, useEffect } from 'react'; 
import Link from "next/link";
import { Header } from "../../components/header"; //importaciones del Header y el Sidebar
import { Sidebar } from "../../components/sidebar";
import { MdAdd } from "react-icons/md";
import ModalNewProject from '../../components/Modals/modalNewProject';
import { MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import ModalComponent from '../../components/Modals/modalComponent';
import { listTeamsScrum, createTeamScrum, deleteTeamScrum } from '../../services/teamScrumService'; 
import ModalAddInformation from '../../components/Modals/modalAddInformation';
import ModalEliminarTeam from "../../components/Modals/modalEliminarTeam";
import { ToastContainer, toast } from "react-toastify"; //importacion de la libreria ToastContainer para las alertas con la animacion 
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenModal] = useState(false);
  const [teams, setTeams] = useState([]); 
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    fetchTeams(); 
  }, []);

  const fetchTeams = () => {
    listTeamsScrum() 
      .then(data => {
        setTeams(data); 
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        toast.error('Error al obtener los equipos.');
      });
  };

  const handleCreateTeam = (team) => {
    if (!team.nameProject) {
      toast.error('Por favor completa correctamente todos los campos obligatorios.');
      toast.error('Error al crear equipo.');
      return;
    }

    createTeamScrum(team)
      .then(() => {
        fetchTeams(); 
        toast.success('¡Nuevo Proyecto creado con éxito!');
        handleCloseModal(); // Cierra el modal de nuevo proyecto después de la creación exitosa del Team
      })
      .catch(error => {
        console.error('Error creating team:', error);
        toast.error('Error al crear equipo Scrum.');
      });
  };

  const handleDeleteTeam = (teamId) => {
    deleteTeamScrum(teamId)
      .then(() => {
        setTeams(teams.filter(team => team.team_scrum_id !== teamId));
        toast.success('Equipo eliminado exitosamente.');
      })
      .catch(error => {
        console.error('Error deleting team:', error);
        toast.error('Error al eliminar equipo.');
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

  const [openAddInfoModal, setOpenAddInfoModal] = useState(false);

  const handleOpenAddInfoModal = () => {
    setOpenAddInfoModal(true);
  };

  const handleCloseAddInfoModal = () => {
    setOpenAddInfoModal(false);
  };

  const handleOpenConfirmModal = (teamId) => {
    setTeamToDelete(teamId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteTeam(teamToDelete);
    setConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Teams Scrums</h1>
          <br />
          <li className="h-9 w-14 flex items-center justify-center border-y-gray-950 rounded-lg bg-[#00324d] hover:bg-[#40b003] ml-auto">
            <a href="#" onClick={handleOpenModal}>
              <MdAdd className="w-8 h-8 text-white"/>
            </a>
          </li>

          {/* Modal para nuevo proyecto */}
          <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateTeam} />

          <div className="grid grid-cols-3 gap-4 mt-8">
            {teams.map((team) => (
              <div key={team.team_scrum_id} className="w-full rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-[#00324d] border-l-[240px] border-l-transparent -z-1"></div>
                <div className="px-6 py-4">
                  <div className="flex">
                    <span className="text-[#40b003] font-inter font-semibold text-xl sm:text-2xl mb-2">Nombre del Proyecto</span>
                    <button onClick={OpenModal} className="font-inter font-semibold text-xl mb-2 relative z-20 ml-auto text-white after:block after:w-full after:h-[1px] after:bg-white after:mt-[4px]">
                      Ver Más
                    </button>
                  </div>

                  <p className="text-black-700 text-base ">{team.nameProject}</p>
                  <br />
                  <div className="text-[#0e324d] font-inter font-semibold text-lg sm:text-xl mb-2">Team Número</div>
                  <p className="text-black-700 text-base ">{team.team_scrum_id}</p>
                  <br />
                  <div className="text-[#000000] font-inter font-medium text-xl mb-2 flex">
                    <span>Agregar Información</span>

                    <button onClick={handleOpenAddInfoModal} className="ml-2">
                      <MdAddCircle className="inline-block text-2xl text-[#00324d]" />
                    </button>
                    <button onClick={() => handleDeleteTeam(team.team_scrum_id)} className="ml-44">
                      <FaTrashAlt className="inline-block text-2xl text-[#00324d]" />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
          <ModalAddInformation isOpen={openAddInfoModal} onClose={handleCloseAddInfoModal} />
          <ModalComponent isOpen={openAgregarInfo} onClose={CloseModal} />
          <ModalEliminarTeam isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleConfirmDelete}/> 

        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
