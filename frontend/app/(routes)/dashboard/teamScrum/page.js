"use client";

import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ModalNewProject from "@components/Modals/modalNewProject";
import ModalComponent from "@components/Modals/modalComponent";
import ModalAddInformation from "@components/Modals/modalAddInformation";
import ModalEliminarTeam from "@components/Modals/modalEliminarTeam";
import PageTitle from '@components/UI/pageTitle';

import {
  fetchTeamsScrums,
  addTeamScrum,
  deleteTeamScrum
} from "@services/teamScrumService";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenAgregarInfo] = useState(false);
  const [teams, setTeams] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [openAddInfoModal, setOpenAddInfoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current && loading && teams.length === 0) {
      toast.info('Cargando equipos...');
      firstRun.current = false;
    }
  }, [loading, teams.length]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetchTeamsScrums(0, 10);
      const mapped = response.data?.map(team => ({
        id: team.id,
        name: team.name,
        checklist: team.checklist,
        members: team.members
      })) || [];
      setTeams(mapped);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("No se pudo cargar los equipos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (team) => {
    if (!team.nameProject) {
      toast.error('Por favor completa correctamente todos los campos obligatorios.');
      return;
    }

    const input = {
      name: team.nameProject,
      problem: '',
      objectives: '',
      description: '',
      justification: '',
      checklist: team.checklist || null,
    };

    try {
      await addTeamScrum(input);
      toast.success('¡Nuevo Team creado con éxito!');
      handleCloseModal();
      await fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Error al crear equipo Scrum.');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeamScrum(teamId);
      setTeams(prev => prev.filter(team => team.id !== teamId));
      toast.success('Equipo eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Error al eliminar equipo.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;
    await handleDeleteTeam(teamToDelete);
    handleCloseConfirmModal();
  };

  // --- MODALS CONTROL ---
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenAddInfoModal = () => setOpenAddInfoModal(true);
  const handleCloseAddInfoModal = () => setOpenAddInfoModal(false);

  const handleOpenAgregarInfo = (team) => {
    setSelectedTeam(team);
    setOpenAgregarInfo(true);
  };
  const handleCloseAgregarInfo = () => {
    setOpenAgregarInfo(false);
    setSelectedTeam(null);
  };

  const handleOpenConfirmModal = (teamId) => {
    setTeamToDelete(teamId);
    setConfirmModalOpen(true);
  };
  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setTeamToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <PageTitle>Teams Scrum</PageTitle>

      {/* Sección de información y botón añadir */}
      <div className="flex items-center justify-between relative z-50">
        {loading ? (
          <p>Cargando equipos...</p>
        ) : teams.length === 0 ? (
          <p className='dark:text-white'>No hay equipos disponibles.</p>
        ) : (
          <p>Teams disponibles.</p>
        )}

        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center justify-center bg-[#40b003] hover:bg-[#2a7d02] dark:bg-[#40b003] dark:hover:bg-[#2a7d02] text-white px-4 py-2 rounded-lg transition-colors duration-300"
        >
          <MdAdd className="mr-2" /> Añadir Team
        </button>
      </div>

      {/* Grid de equipos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="w-full rounded-2xl overflow-hidden shadow-md bg-white dark:bg-[#003044] relative p-6 hover:shadow-lg transition duration-300 border border-gray-200 dark:border-gray-600 flex flex-col"
          >
            {/* Línea diagonal decorativa */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-[#00324d] dark:border-t-[#40b003] border-l-[240px] border-l-transparent z-0" />

            <div className="relative z-10 flex flex-col flex-grow">
              {/* Título y botón "Ver más" */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#00324d] dark:text-white">{team.name}</h2>
              </div>

              {/* Team ID */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Team ID</h3>
                <p className="text-gray-800 dark:text-gray-200">{team.id}</p>
              </div>

              {/* Miembros */}
              {team.members && (
                <div className="mb-4 max-h-28 overflow-y-auto">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Miembros del equipo</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                    {team.members.split(',').map((member, index) => (
                      <li key={index}>{member.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleOpenAddInfoModal()}
                  className="flex items-center gap-2 text-[#00324d] dark:text-[#40b003] hover:text-[#40b003] dark:hover:text-[#2a7d02] transition-colors duration-300"
                >
                  <MdAddCircle className="text-2xl" />
                  <span className="text-sm font-medium">Agregar Información</span>
                </button>
                <button
                  onClick={() => handleOpenConfirmModal(team.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                  title="Eliminar equipo"
                >
                  <FaTrashAlt className="text-xl" />
                </button>
                <button
                  onClick={() => handleOpenAgregarInfo(team)}
                  className="text-sm font-medium text-white bg-[#40b003] hover:bg-[#2a7d02] px-3 py-1 rounded-md shadow transition-colors duration-300 ml-2"
                >
                  Ver Más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateTeam} />
      <ModalAddInformation isOpen={openAddInfoModal} onClose={handleCloseAddInfoModal} />
      <ModalComponent isOpen={openAgregarInfo} onClose={handleCloseAgregarInfo} team={selectedTeam} />
      <ModalEliminarTeam isOpen={confirmModalOpen} onClose={handleCloseConfirmModal} onConfirm={handleConfirmDelete} />
    </div>
  );
}