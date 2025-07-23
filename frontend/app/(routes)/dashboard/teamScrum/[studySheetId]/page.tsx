"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchStudySheetWithTeamScrum } from "@slice/olympo/studySheetSlice";
import { addTeamScrum, deleteTeamScrum, updateTeamScrum } from "@slice/teamScrumSlice";
import { AddTeamScrumMutationVariables } from "@/graphql/generated";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { FaTrashAlt, FaUsers, FaCode, FaEye } from "react-icons/fa";
import { TeamsScrum } from "@graphql/generated";
import { MdAddCircle, MdInfo, MdGroup } from "react-icons/md";
import { useLoader } from "@context/LoaderContext";
import { TeamHistoryModal } from "@components/Modals/modalComposition";
import { fetchProfiles } from "@/redux/slices/atlas/profileSlice";
import PageTitle from "@/components/UI/pageTitle";
import ModalNewTeam from "@components/Modals/modalNewTeam";
import ModalAddInformation from "@components/Modals/modalAddInformation";
import ModalTeamInformation from "@components/Modals/modalTeamScrumInfo";
import ModalEliminarTeam from "@components/Modals/modalEliminarTeam";

interface TeamInfoData {
    projectName: string;
    teamName: string;
    description: string;
    objectives: string;
    problem: string;
    projectJustification: string;
}

export default function TeamScrumDetailsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const studySheetId = Number(params.studySheetId);

    const { data, loading: studySheetLoading } = useSelector(
        (state: RootState) => state.studySheet
    );
    const { data: profiles } = useSelector(
        (state: RootState) => state.profile
    );
    const { showLoader, hideLoader } = useLoader();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [, setOpenAgregarInfo] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [openAddInfoModal, setOpenAddInfoModal] = useState<boolean>(false);
    const [openTeamInfoModal, setOpenTeamInfoModal] = useState<boolean>(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
    const [teamToDelete, setTeamToDelete] = useState<TeamsScrum | null>(null);
    const [, setSelectedTeam] = useState<TeamsScrum | null>(null);
    const [selectedTeamForInfo, setSelectedTeamForInfo] = useState<TeamsScrum | null>(null);
    const [selectedTeamForHistory, setSelectedTeamForHistory] = useState<TeamsScrum | null>(null);

    useEffect(() => {
        if (studySheetId) {
            dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
            dispatch(fetchProfiles({ page: 0, size: 10 }));
        }
    }, [dispatch, studySheetId]);

    useEffect(() => {
        if (studySheetLoading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [studySheetLoading, showLoader, hideLoader]);

    const studySheet = data?.[0] ?? null;

    const teams: TeamsScrum[] =
        (studySheet?.teamsScrum as TeamsScrum[]) ?? [];


    // Modal handlers
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleOpenAgregarInfo = (team: TeamsScrum) => {
        setSelectedTeam(team);
        setOpenAgregarInfo(true);
    };

    const handleCloseAgregarInfo = () => {
        setSelectedTeam(null);
        setOpenAgregarInfo(false);
    };

    const handleCloseAddInfoModal = () => setOpenAddInfoModal(false);

    const handleOpenHistoryModal = (team: TeamsScrum) => {
        setSelectedTeamForHistory(team);
        setIsHistoryModalOpen(true);
    };
    const handleCloseHistoryModal = () => {
        setSelectedTeamForHistory(null);
        setIsHistoryModalOpen(false);
    };

    const handleOpenTeamInfoModal = (team: TeamsScrum) => {
        setSelectedTeamForInfo(team);
        setOpenTeamInfoModal(true);
    };

    const handleCloseTeamInfoModal = () => {
        setSelectedTeamForInfo(null);
        setOpenTeamInfoModal(false);
    };

    const handleOpenConfirmModal = (team: TeamsScrum) => {
        setTeamToDelete(team);
        setConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setTeamToDelete(null);
        setConfirmModalOpen(false);
    };

    // Handler para asignar perfiles (solo para visualización)
    const handleProfileAssign = (studentId: string, profile: any) => {
        console.log(`Visualizando asignación: Perfil ${profile.name} para estudiante ${studentId}`);
        console.log('Perfil seleccionado:', profile);
        toast.info(`Rol "${profile.name}" seleccionado para este estudiante`, {
            position: "top-right",
            autoClose: 2000,
        });
        // Solo para mostrar la selección - aquí iría la lógica real de asignación
    };

    const handleConfirmDelete = () => {
        if (teamToDelete) {
            handleDisableTeamScrum(teamToDelete.id, teamToDelete.teamName ?? "Sin nombre");
        }
        handleCloseConfirmModal();
    };

    const handleSaveTeamInfo = async (teamId: string, data: TeamInfoData): Promise<boolean> => {
        try {
            const res = await dispatch(updateTeamScrum({
                id: teamId,
                input: {
                    projectName: data.projectName,
                    teamName: data.teamName,
                    description: data.description,
                    objectives: data.objectives,
                    problem: data.problem,
                    projectJustification: data.projectJustification
                }
            }));

            if (updateTeamScrum.rejected.match(res)) {
                const message =
                    res.payload?.message ||
                    res.error?.message ||
                    "Error desconocido al actualizar la información del equipo";
                toast.error(`Error al actualizar: ${message}`);
                return false;
            }

            toast.success("Información del team scrum actualizada exitosamente");

            if (studySheetId) {
                dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
            }

            return true;
        } catch (e: any) {
            toast.error(
                `Excepción no controlada: ${e?.message || "Error desconocido"}`
            );
            return false;
        }
    };

    const handleAddTeamScrum = async (
        input: AddTeamScrumMutationVariables["input"]
    ) => {
        try {
            if (!input.memberIds || input.memberIds.length === 0) {
                toast.warning("Debes seleccionar al menos un miembro para el equipo");
                return false;
            }

            if (input.memberIds.length > 4) {
                toast.warning("Un equipo Scrum no puede tener más de 4 miembros");
                return false;
            }

            const res = await dispatch(addTeamScrum(input));
            if (addTeamScrum.rejected.match(res)) {
                const message =
                    res.payload?.message ||
                    res.error?.message ||
                    "Error desconocido al registrar el team scrum";
                toast.error(`Error al registrar el team scrum: ${message}`);
                return false;
            }

            toast.success("Team scrum registrado exitosamente");
            if (studySheetId) {
                dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
            }
            return true;
        } catch (e: any) {
            toast.error(
                `Excepción no controlada: ${e?.message || "Error desconocido"}`
            );
            return false;
        }
    };


    const handleDisableTeamScrum = async (teamId: string, teamName: string) => {
        try {
            const res = await dispatch(deleteTeamScrum(teamId));
            if (deleteTeamScrum.rejected.match(res)) {
                const message =
                    res.payload?.message ||
                    res.error?.message ||
                    "Error desconocido al eliminar el team scrum";
                toast.error(`Error al eliminar el team scrum: ${message}`);
                return false;
            }
            toast.success(`Team Scrum "${teamName}" eliminado correctamente`);
            if (studySheetId) {
                dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
            }
            return true;
        } catch (e: any) {
            toast.error(
                `Excepción no controlada al eliminar la tarea: ${e?.message || "Error desconocido"
                }`
            );
            return false;
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <PageTitle>
                    Teams Scrum de la Ficha {studySheet ? `N° ${studySheet.number}` : ""}
                </PageTitle>

                {/* Modales */}
                <ModalNewTeam
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onCreate={handleAddTeamScrum}
                    studySheetId={studySheetId}
                />
                <ModalAddInformation
                    isOpen={openAddInfoModal}
                    onClose={handleCloseAddInfoModal}
                />
                <ModalEliminarTeam
                    isOpen={confirmModalOpen}
                    onClose={handleCloseConfirmModal}
                    onConfirm={handleConfirmDelete}
                />
                <ModalTeamInformation
                    isOpen={openTeamInfoModal}
                    onClose={handleCloseTeamInfoModal}
                    team={selectedTeamForInfo}
                    onSave={handleSaveTeamInfo}
                />
                <TeamHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={handleCloseHistoryModal}
                    teamData={selectedTeamForHistory}
                    profiles={profiles || []}
                    onSelectProfile={handleProfileAssign}
                />

                <div className="mt-8">
                    <button
                        onClick={handleOpenModal}
                        className="flex items-center gap-3 text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 px-6 py-3 rounded-xl hover:-translate-y-1 mb-8 font-semibold transition-all duration-300 transform"
                    >
                        <MdAddCircle className="text-2xl" />
                        <span>Crear Nuevo Equipo</span>
                    </button>

                    {teams.length === 0 ? (
                        <div className="bg-white dark:bg-shadowBlue rounded-xl p-12 text-center border border-lightGray dark:border-grayText">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MdGroup className="w-8 h-8 text-grayText dark:text-lightGray" />
                            </div>
                            <h3 className="text-xl font-semibold text-darkGray dark:text-white mb-2">
                                No hay equipos de Scrum disponibles
                            </h3>
                            <p className="text-grayText dark:text-white">
                                Aún no se han creado equipos para esta ficha.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                            {teams.map((team) => (
                                <div
                                    key={team.id}
                                    className="group relative bg-white dark:bg-shadowBlue rounded-2xl overflow-hidden border border-lightGray dark:border-grayText hover:bg-black/5 dark:hover:bg-white/10 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300"
                                >
                                    {/* Gradient Header */}
                                    <div className="h-24 bg-gradient-to-br from-primary via-lightGreen to-darkGreen dark:from-secondary dark:to-darkBlue relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                                        <div className="absolute top-4 right-4">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <FaCode className="text-white text-lg" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 relative -mt-4">
                                        {/* Team Avatar */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-full flex items-center justify-center mb-4 mx-auto">
                                            <FaUsers className="text-white text-xl" />
                                        </div>

                                        {/* Team Name */}
                                        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                                            {team.teamName}
                                        </h2>

                                        {/* Team ID */}
                                        <div className="bg-gray-50 dark:bg-shadowBlue/50 rounded-lg p-3 mb-4">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <div className="w-2 h-2 bg-primary dark:bg-darkBlue rounded-full"></div>
                                                <span className="text-xs font-medium text-grayText dark:text-white uppercase tracking-wide">
                                                    Team ID
                                                </span>
                                            </div>
                                            <p className="text-sm font-mono text-black dark:text-white bg-white dark:bg-shadowBlue px-2 py-1 rounded">
                                                {team.id}
                                            </p>
                                        </div>

                                        {/* Members Section */}
                                        {team.students && team.students.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <MdGroup className="text-black dark:text-darkBlue" />
                                                        <h3 className="text-sm font-semibold text-black dark:text-white">
                                                            Miembros del equipo
                                                        </h3>
                                                    </div>
                                                    <span className="bg-gray-200 text-black dark:bg-darkBlue/20 dark:text-darkBlue text-xs font-semibold px-2 py-1 rounded-full">
                                                        {team.students.length}
                                                    </span>
                                                </div>
                                                <div className="max-h-32 overflow-y-auto space-y-2">
                                                    {team.students.map((student, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-shadowBlue/30 rounded-lg hover:bg-gray-100 dark:hover:bg-darkBlue/50 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-lightGreen/20 dark:from-secondary/20 dark:to-darkBlue/20 rounded-full flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-black dark:text-darkBlue">
                                                                    {(student?.person?.name ?? `E${index + 1}`).charAt(0)}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-black dark:text-white">
                                                                {student?.person?.name ?? `Estudiante ${index + 1}`}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => handleOpenTeamInfoModal(team)}
                                                className="flex items-center gap-2 text-black dark:text-darkBlue hover:text-black dark:hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-darkBlue/10"
                                                title="Información del equipo"
                                            >
                                                <MdInfo className="text-xl" />
                                                <span className="text-sm font-medium">Info</span>
                                            </button>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleOpenConfirmModal(team)}
                                                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Eliminar equipo"
                                                >
                                                    <FaTrashAlt className="text-lg" />
                                                </button>

                                                <button
                                                    onClick={() => handleOpenHistoryModal(team)}
                                                    className="flex items-center gap-2 text-black dark:text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 px-4 py-2 rounded-lg hover:-translate-y-0.5 text-sm font-medium transition-all duration-300 transform"
                                                >
                                                    <FaEye className="text-sm" />
                                                    Ver Más
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-lightGreen/5 dark:from-secondary/10 dark:to-darkBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
