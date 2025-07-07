"use client";

import { useEffect, useState } from "react";
import { MdAdd, MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import ModalNewProject from "@components/Modals/modalNewProject";
import ModalComponent from "@components/Modals/modalComponent";
import ModalAddInformation from "@components/Modals/modalAddInformation";
import ModalEliminarTeam from "@components/Modals/modalEliminarTeam";
import PageTitle from "@components/UI/pageTitle";
import { TeamScrumItem } from "@type/slices/teamScrum";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchTeamsScrums, addTeamScrum, deleteTeamScrum } from '@slice/teamScrumSlice'

interface TeamsScrumPageProps {
  teams: TeamScrumItem[];
  loading?: boolean;
  onCreateTeam?: (team: any) => void;
  onDeleteTeam?: (teamId: string) => void;
}

export default function TeamsScrumPage({
  teams = [],
  loading = false,
  onCreateTeam,
  onDeleteTeam,
}: TeamsScrumPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [modalOpen, setModalOpen] = useState(false);
  const [openAgregarInfo, setOpenAgregarInfo] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<TeamScrumItem | null>(null);
  const [openAddInfoModal, setOpenAddInfoModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamScrumItem | null>(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenAgregarInfo = (team: TeamScrumItem) => {
    setSelectedTeam(team);
    setOpenAgregarInfo(true);
  };
  const handleCloseAgregarInfo = () => {
    setSelectedTeam(null);
    setOpenAgregarInfo(false);
  };

  const handleOpenAddInfoModal = () => setOpenAddInfoModal(true);
  const handleCloseAddInfoModal = () => setOpenAddInfoModal(false);

  const handleOpenConfirmModal = (team: TeamScrumItem) => {
    setTeamToDelete(team);
    setConfirmModalOpen(true);
  };
  const handleCloseConfirmModal = () => {
    setTeamToDelete(null);
    setConfirmModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (onDeleteTeam && teamToDelete) {
      onDeleteTeam(teamToDelete.id);
    }
    handleCloseConfirmModal();
  };

  const handleCreateTeam = (team: any) => {
    if (onCreateTeam) onCreateTeam(team);
    handleCloseModal();
  };

  useEffect(() => {
    dispatch(fetchTeamsScrums({ page: 0, size: 5 }));
  }, [dispatch]);

  return (
    <div>
      <PageTitle>Teams Scrum</PageTitle>

      <div className="flex items-center justify-between relative z-50">
        {loading ? (
          <p>Cargando equipos...</p>
        ) : teams.length === 0 ? (
          <p className="dark:text-white">No hay equipos disponibles.</p>
        ) : (
          <p>Teams disponibles.</p>
        )}

        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center justify-center bg-[#40b003] hover:bg-[#2a7d02] text-white px-4 py-2 rounded-lg transition-colors duration-300"
        >
          <MdAdd className="mr-2" /> Añadir Team
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="w-full rounded-2xl overflow-hidden shadow-md bg-white dark:bg-[#003044] relative p-6 hover:shadow-lg transition duration-300 border border-gray-200 dark:border-gray-600 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-[#00324d] dark:border-t-[#40b003] border-l-[240px] border-l-transparent z-0" />

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#00324d] dark:text-white">
                  {team.teamName}
                </h2>
              </div>

              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Team ID</h3>
                <p className="text-gray-800 dark:text-gray-200">{team.id}</p>
              </div>

              {team.students && team.students.length > 0 && (
                <div className="mb-4 max-h-28 overflow-y-auto">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Miembros del equipo
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                    {team.students.map((student, index) => (
                      <li key={index}>{student.person?.name ?? `Estudiante ${index + 1}`}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleOpenAddInfoModal}
                  className="flex items-center gap-2 text-[#00324d] dark:text-[#40b003] hover:text-[#40b003] dark:hover:text-[#2a7d02] transition-colors duration-300"
                >
                  <MdAddCircle className="text-2xl" />
                  <span className="text-sm font-medium">Agregar Información</span>
                </button>
                <button
                  onClick={() => handleOpenConfirmModal(team)}
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
      <ModalEliminarTeam
        isOpen={confirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
