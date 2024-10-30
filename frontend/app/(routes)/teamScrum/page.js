"use client";

import React, { useState, useEffect } from 'react'; 
import { Header } from "../../components/header"; 
import { Sidebar } from "../../components/Sidebar";
import { MdAdd } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";
import ModalNewProject from '../../components/Modals/modalNewProject';
import { FaTrashAlt } from "react-icons/fa";
import ModalComponent from '../../components/Modals/modalComponent';
import { listTeamsScrum, createTeamScrum, deleteTeamScrum } from '../../services/teamScrumService'; 
import ModalAddInformation from '../../components/Modals/modalAddInformation';
import ModalEliminarTeam from "../../components/Modals/modalEliminarTeam";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenAgregarInfo] = useState(false);
  const [teams, setTeams] = useState([]); 
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [openAddInfoModal, setOpenAddInfoModal] = useState(false);

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
      return;
    }

    createTeamScrum(team)
      .then(() => {
        fetchTeams(); 
        toast.success('¡Nuevo Proyecto creado con éxito!');
        handleCloseModal(); 
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

  const handleOpenAddInfoModal = () => {
    setOpenAddInfoModal(true);
  };

  const handleCloseAddInfoModal = () => {
    setOpenAddInfoModal(false);
  };

  const handleOpenAgregarInfo = () => {
    setOpenAgregarInfo(true);
  };

  const handleCloseAgregarInfo = () => {
    setOpenAgregarInfo(false);
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

        <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">Team Scrums</h1>
          
          <div className="flex items-center justify-between mb-6">
            {teams.length === 0 ? (
              <p className="text-gray-600">No hay equipos de trabajo disponibles. Pulsa el botón + para crear un nuevo team.</p>
            ) : (
              <p className="text-gray-600">Teams disponibles. Puedes seguir creando nuevos teams.</p>
            )}
            <button onClick={handleOpenModal} className="flex items-center justify-center bg-[#00324d] hover:bg-[#40b003] text-white px-4 py-2 rounded-lg">
              <MdAdd className="mr-2" /> Añadir Team
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {teams.length > 0 ? (
              teams.map((team) => (
                <div key={team.team_scrum_id} className="w-full rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-[#00324d] border-l-[240px] border-l-transparent -z-1"></div>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#40b003] font-inter font-semibold text-xl sm:text-2xl">Nombre del Proyecto</span>
                      <button onClick={handleOpenAgregarInfo} className="font-inter font-semibold text-xl text-white bg-[#00324d] hover:bg-[#00263d] px-2 py-1 rounded-lg">
                        Ver Más
                      </button>
                    </div>

                    <p className="text-black-700 text-base mb-2">{team.nameProject}</p>
                    
                    <div className="text-[#0e324d] font-inter font-semibold text-lg sm:text-xl mb-2">Team Número</div>
                    <p className="text-black-700 text-base mb-4">{team.team_scrum_id}</p>
                    
                    <div className="text-[#000000] font-inter font-medium text-xl flex items-center justify-between">
                      <div className="font-inter flex items-center gap-2">
                        <span>Agregar Información</span>
                        <button onClick={handleOpenAddInfoModal}>
                          <MdAddCircle className="text-3xl text-[#00324d]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenConfirmModal(team.team_scrum_id)}>
                          <FaTrashAlt className="text-2xl text-[#00324d]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>

          <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateTeam} />
          <ModalAddInformation isOpen={openAddInfoModal} onClose={handleCloseAddInfoModal} />
          <ModalComponent isOpen={openAgregarInfo} onClose={handleCloseAgregarInfo} />
          <ModalEliminarTeam isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleConfirmDelete}/> 
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
