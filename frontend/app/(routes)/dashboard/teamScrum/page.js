"use client";

import { useState, useEffect } from 'react';
import { MdAdd, MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import ModalNewProject from "@components/Modals/modalNewProject";
import ModalComponent from "@components/Modals/modalComponent";
import ModalAddInformation from "@components/Modals/modalAddInformation";
import ModalEliminarTeam from "@components/Modals/modalEliminarTeam";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

  useEffect(() => {
    fetchTeams();
  }, []);

  loading && toast.info('Cargando equipos...');
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetchTeamsScrums(0, 10);
      const mapped = response.data?.map(team => ({
        id: team.id,
        name: team.name,
        checklist: team.checklist,
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
      problem: "",
      objectives: "",
      description: "",
      justification: "",
      checklist: team.checklist || null,
    };



    try {
      await addTeamScrum(input);
      toast.success('¡Nuevo Team creado con éxito!');
      handleCloseModal();
      fetchTeams();
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

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenAddInfoModal = () => setOpenAddInfoModal(true);
  const handleCloseAddInfoModal = () => setOpenAddInfoModal(false);
  const handleOpenAgregarInfo = () => setOpenAgregarInfo(true);
  const handleCloseAgregarInfo = () => setOpenAgregarInfo(false);

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

      <div className="xl:col-span-5">

        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Team Scrums
          </h1>

          <div className="flex items-center justify-between mb-6">
            {teams.length === 0 ? (
              <p className="text-gray-600">No hay equipos de trabajo disponibles. Pulsa el botón + para crear un nuevo team.</p>
            ) : (
              <p className="text-gray-600">Teams disponibles. Puedes seguir creando nuevos teams.</p>
            )}
            <button
              onClick={handleOpenModal}
              className="flex items-center justify-center bg-[#00324d] hover:bg-[#40b003] text-white px-4 py-2 rounded-lg"
            >
              <MdAdd className="mr-2" /> Añadir Team
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {teams.map((team) => (
              <div
                key={team.id}
                className="w-full rounded-2xl overflow-hidden shadow-md bg-white relative p-6 hover:shadow-lg transition duration-300 border border-gray-200 flex flex-col"
              >
                {/* Línea diagonal decorativa */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-[#00324d] border-l-[240px] border-l-transparent z-0" />

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Título y botón "Ver más" */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#00324d]">{team.name}</h2>
                    <button
                      onClick={handleOpenAgregarInfo}
                      className="text-sm font-medium text-white bg-[#40b003] hover:bg-[#2a7d02] px-3 py-1 rounded-md shadow"
                    >
                      Ver Más
                    </button>
                  </div>

                  {/* Team ID */}
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-500">Team ID</h3>
                    <p className="text-gray-800">{team.id}</p>
                  </div>

                  {/* Miembros con altura limitada y scroll si hay muchos */}
                  {team.members && (
                    <div className="mb-4 max-h-28 overflow-y-auto">
                      <h3 className="text-sm font-semibold text-gray-500">Miembros del equipo</h3>
                      <ul className="list-disc list-inside text-gray-700 text-sm">
                        {team.members.split(',').map((member, index) => (
                          <li key={index}>{member.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Botones alineados abajo */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                    <button
                      onClick={handleOpenAddInfoModal}
                      className="flex items-center gap-2 text-[#00324d] hover:text-[#40b003] transition"
                    >
                      <MdAddCircle className="text-2xl" />
                      <span className="text-sm font-medium">Agregar Información</span>
                    </button>
                    <button
                      onClick={() => handleOpenConfirmModal(team.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Eliminar equipo"
                    >
                      <FaTrashAlt className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <ModalNewProject isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateTeam} />
          <ModalAddInformation isOpen={openAddInfoModal} onClose={handleCloseAddInfoModal} />
          <ModalComponent isOpen={openAgregarInfo} onClose={handleCloseAgregarInfo} />
          <ModalEliminarTeam isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleConfirmDelete} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
