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
import { listTeamsScrum, createTeamScrum, deleteTeamScrum } from '../../services/teamScrumService'; 
import ModalAddInformation from '../../components/Modals/modalAddInformation';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenModal] = useState(false);
  const [teams, setTeams] = useState([]); 
  const [alert, setAlert] = useState({show: false, type: '', message: ''}); 

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
      });
  };

  const handleCreateTeam = (team) => {
    if (!team.nameProject) {
      setAlert({show: true, type: 'error', message: 'Por favor completa correctamente todos los campos obligatorios.'});

      setTimeout(() => {
        setAlert({show: false, type: '', message: ''});
      }, 3000);

      return;
    }

    createTeamScrum(team)
      .then(() => {
        fetchTeams(); 
        setAlert({show: true, type: 'success', message: 'Proyecto registrado exitosamente.'});
        handleCloseModal(); // Cierra el modal de nuevo proyecto después de la creación exitosa del Team

        setTimeout(() => {
          setAlert({show: false, type: '', message: ''});
        }, 3000);
      })
      .catch(error => {
        console.error('Error creating team:', error);
        setAlert({show: true,type: 'error', message: 'Error al crear equipo Scrum.'});

        setTimeout(() => {
          setAlert({show: false, type: '', message: ''});
        }, 3000);
      });
  };

  const handleDeleteTeam = (teamId) => {
    deleteTeamScrum(teamId)
      .then(() => {
        // Actualizar la lista de equipos después de la eliminación
        setTeams(teams.filter(team => team.team_scrum_id !== teamId));
        setAlert({show: true, type: 'success', message: 'Equipo eliminado exitosamente.'});
        setTimeout(() => {
          setAlert({show: false, type: '', message: ''});
        }, 3000);
      })
      .catch(error => {
        console.error('Error deleting team:', error);
        setAlert({show: true, type: 'error', message: 'Error al eliminar equipo.'});
        setTimeout(() => {
          setAlert({show: false, type: '', message: ''});
        }, 3000);
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

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
          <h1 className="font-serif text-4xl pb-3 border-b-2 border-gray-400 w-1/2">Teams Scrums</h1>
          <br />
          <li className="h-9 w-14 flex items-center justify-center border-2 rounded-lg bg-[#00324d] hover:bg-green-600 ml-auto">
            <a href="#" onClick={handleOpenModal}>
              <MdAdd className="w-8 h-8 text-white"/>
            </a>
          </li>

          {/* Alerta */}
          {alert.show && (
            <div className={`fixed top-4 right-4 z-60 max-w-lg mx-auto ${alert.type === 'success' ? 'bg-green-200' : 'bg-red-200'} px-6 py-4 my-4 rounded-md text-lg flex items-center`}>
              <svg viewBox="0 0 24 24" className={`${alert.type === 'success' ? 'text-green-600' : 'text-red-600'} w-12 h-12 sm:w-512 sm:h-12 mr-3`}>
                <path fill="currentColor"
                  d="M23.119,20,13.772,2.15h0a2,2,0,0,0-3.543,0L.881,20a2,2,0,0,0,1.772,2.928H21.347A2,2,0,0,0,23.119,20ZM11,8.423a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Zm1.05,11.51h-.028a1.528,1.528,0,0,1-1.522-1.47,1.476,1.476,0,0,1,1.448-1.53h.028A1.527,1.527,0,0,1,13.5,18.4,1.475,1.475,0,0,1,12.05,19.933Z">
                </path>
              </svg>
              <span className={`${alert.type === 'success' ? 'text-green-800' : 'text-red-800'} font-semibold`}>
                {alert.message}
              </span>
            </div>
          )}

          <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateTeam} />

          <div className="grid grid-cols-3 gap-4 mt-8">
            {teams.map((team) => (
              <div key={team.team_scrum_id} className="w-full rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-[#00324d] border-l-[240px] border-l-transparent -z-1"></div>
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

                    <button onClick={handleOpenAddInfoModal} className="ml-2">
                      <MdAddCircle className="inline-block text-2xl text-[#00324d]" />
                    </button>
                    <button onClick={() => handleDeleteTeam(team.team_scrum_id)} className="ml-2 ml-auto">
                      <FaTrashAlt className="inline-block text-2xl text-[#00324d]" />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
          <ModalAddInformation isOpen={openAddInfoModal} onClose={handleCloseAddInfoModal} />
          <ModalComponent isOpen={openAgregarInfo} onClose={CloseModal} />
        </div>
      </div>
    </div>
  );
}
