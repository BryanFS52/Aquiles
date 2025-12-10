'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchStudySheetWithTeamScrum, clearStudySheetState } from '@slice/olympo/studySheetSlice';
import { addTeamScrum, deleteTeamScrum, updateTeamScrum, addProfileToStudent } from '@slice/teamScrumSlice';
import { fetchAllProcessMethodologiesAndProfiles } from '@slice/atlas/processMethodologiesSlice';
import { toast } from 'react-toastify';
import type {
    TeamsScrum,
    Profile,
    TeamsScrumDto,
    TeamInfoData,
    TeamHandlers,
    ModalHandlers
} from './types';

export const useTeamScrum = (studySheetId: number) => {
    const dispatch = useDispatch<AppDispatch>();

    // Redux state
    const { data, loading: studySheetLoading } = useSelector((state: RootState) => state.studySheet);
    const { data: processMethodologies } = useSelector((state: RootState) => state.processMethodologies);

    // Local state
    const [scrumProfiles, setScrumProfiles] = useState<Profile[]>([]);
    const [selectedTeamForHistory, setSelectedTeamForHistory] = useState<TeamsScrum | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [teamToDelete, setTeamToDelete] = useState<TeamsScrum | null>(null);
    const [selectedTeamForInfo, setSelectedTeamForInfo] = useState<TeamsScrum | null>(null);

    // Modal states
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [openTeamInfoModal, setOpenTeamInfoModal] = useState<boolean>(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

    // Computed values
    const studySheet = data?.[0] ?? null;
    const teams: TeamsScrum[] = useMemo(() => {
        const teamsArray = (studySheet?.teamsScrum as TeamsScrum[]) ?? [];
        return teamsArray;
    }, [studySheet?.teamsScrum]);

    // Effects
    useEffect(() => {
        if (studySheetId) {
            setIsInitialLoad(true);
            dispatch(clearStudySheetState());
            dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
            dispatch(fetchAllProcessMethodologiesAndProfiles({ page: 0, size: 10, search: "" }));
        }
    }, [dispatch, studySheetId]);

    useEffect(() => {
        if (isInitialLoad && !studySheetLoading) {
            setIsInitialLoad(false);
        }
    }, [studySheetLoading, isInitialLoad]);

    useEffect(() => {
        if (!selectedTeamForHistory || !processMethodologies.length) return;

        const processId =
            typeof selectedTeamForHistory.processMethodology === "object"
                ? selectedTeamForHistory.processMethodology?.id
                : selectedTeamForHistory.processMethodology ?? null;

        if (!processId) {
            setScrumProfiles([]);
            return;
        }

        const matchedProcess = processMethodologies.find(pm => pm.id === processId);
        const cleanProfiles: Profile[] = (matchedProcess?.profiles ?? []).filter(
            (p): p is Profile => !!p
        );

        setScrumProfiles(cleanProfiles);
    }, [selectedTeamForHistory, processMethodologies]);

    // Team handlers
    const teamHandlers: TeamHandlers = {
        onAddTeam: async (input: TeamsScrumDto) => {
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

                await dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
                toast.success("Team scrum registrado exitosamente");
                return true;
            } catch (e: any) {
                toast.error(`Excepción no controlada: ${e?.message || "Error desconocido"}`);
                return false;
            }
        },

        onUpdateTeam: async (teamId: string, data: TeamInfoData) => {
            try {
                const res = await dispatch(updateTeamScrum({
                    id: teamId,
                    input: {
                        projectName: data.projectName,
                        teamName: data.teamName,
                        description: data.description,
                        objectives: data.objectives,
                        problem: data.problem,
                        projectJustification: data.projectJustification,
                        memberIds: data.memberIds.map(member => ({
                            studentId: member.studentId,
                            profileId: member.profileId
                        }))
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

                await dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
                toast.success("Información del team scrum actualizada exitosamente");
                return true;
            } catch (e: any) {
                toast.error(`Excepción no controlada: ${e?.message || "Error desconocido"}`);
                return false;
            }
        },

        onDeleteTeam: async (teamId: string, teamName: string) => {
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

                await dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));
                toast.success(`Team Scrum "${teamName}" eliminado correctamente`);
                return true;
            } catch (e: any) {
                toast.error(`Excepción no controlada al eliminar la tarea: ${e?.message || "Error desconocido"}`);
                return false;
            }
        },

        onAssignProfile: async (studentId: string, profile: Profile) => {
            try {
                if (!profile.id) {
                    toast.error("Error: ID del perfil no válido");
                    return;
                }

                if (!selectedTeamForHistory?.id) {
                    toast.error("Error: No se ha seleccionado un equipo válido");
                    return;
                }

                // Validar si el rol es único y ya está asignado a OTRO estudiante
                if (profile.isUnique) {
                    const isAlreadyAssigned = selectedTeamForHistory.students?.some(
                        student => {
                            if (student?.id === studentId) return false; // Ignorar el estudiante actual
                            const memberIds = (selectedTeamForHistory as any).memberIds;
                            if (memberIds && Array.isArray(memberIds)) {
                                return memberIds.some((m: any) => 
                                    m.studentId !== parseInt(studentId) && m.profileId === profile.id
                                );
                            }
                            return student?.profiles?.some(p => p?.id === profile.id);
                        }
                    );

                    if (isAlreadyAssigned) {
                        toast.warning(`El rol "${profile.name}" es único y ya está asignado a otro miembro del equipo`, {
                            position: "top-center",
                            autoClose: 4000,
                        });
                        return;
                    }
                }

                // Verificar si el estudiante ya tiene un rol asignado
                const memberIds = (selectedTeamForHistory as any).memberIds;
                let currentProfileId: string | null = null;
                let currentProfileName: string | null = null;

                if (memberIds && Array.isArray(memberIds)) {
                    const currentMember = memberIds.find((m: any) => 
                        String(m.studentId) === studentId
                    );
                    if (currentMember?.profileId) {
                        currentProfileId = currentMember.profileId;
                        const currentProfile = scrumProfiles.find(p => p.id === currentProfileId);
                        currentProfileName = currentProfile?.name || null;
                    }
                }

                // Si ya tiene el mismo rol, no hacer nada
                if (currentProfileId === profile.id) {
                    toast.info(`Este estudiante ya tiene el rol "${profile.name}" asignado`, {
                        position: "top-center",
                        autoClose: 3000,
                    });
                    return;
                }

                // Mostrar mensaje informativo si está cambiando de rol
                if (currentProfileId) {
                    toast.info(
                        `Cambiando rol de "${currentProfileName}" a "${profile.name}"...`,
                        {
                            position: "top-center",
                            autoClose: 2000,
                        }
                    );
                }

                // Asignar o actualizar el rol (el backend ahora maneja ambos casos)
                const res = await dispatch(addProfileToStudent([
                    {
                        teamScrumId: selectedTeamForHistory.id,
                        studentId: parseInt(studentId),
                        profileId: String(profile.id),
                        isActive: true,
                        isUnique: profile.isUnique ?? false
                    } as any
                ]));

                if (addProfileToStudent.rejected.match(res)) {
                    const message =
                        res.payload?.message ||
                        res.error?.message ||
                        "Error desconocido al asignar el perfil";
                    toast.error(`Error al asignar perfil: ${message}`, {
                        position: "top-center",
                        autoClose: 5000,
                    });
                    return;
                }

                await dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));

                const roleType = profile.isUnique ? "único" : "compartido";
                const action = currentProfileId ? "cambiado" : "asignado";
                toast.success(`Rol ${roleType} "${profile.name}" ${action} exitosamente`, {
                    position: "top-center",
                    autoClose: 3000,
                });

            } catch (error: any) {
                toast.error(`Error inesperado: ${error?.message || "Error desconocido"}`, {
                    position: "top-center",
                    autoClose: 5000,
                });
            }
        },

        onRemoveProfile: async (studentId: string) => {
            try {
                if (!selectedTeamForHistory?.id) {
                    toast.error("Error: No se ha seleccionado un equipo válido");
                    return;
                }

                // Verificar el rol actual del estudiante desde memberIds o profiles
                const memberIds = (selectedTeamForHistory as any).memberIds;
                let currentProfile: Profile | null = null;
                let currentProfileId: string | null = null;

                if (memberIds && Array.isArray(memberIds)) {
                    const currentMember = memberIds.find((m: any) => 
                        String(m.studentId) === String(studentId)
                    );
                    if (currentMember?.profileId) {
                        currentProfileId = currentMember.profileId;
                        currentProfile = scrumProfiles.find(p => p.id === currentProfileId) || null;
                    }
                }

                // Si no se encontró en memberIds, buscar en los profiles del estudiante
                if (!currentProfile) {
                    const student = selectedTeamForHistory.students?.find(s => String(s?.id) === String(studentId));
                    if (student?.profiles && student.profiles.length > 0) {
                        const validProfile = student.profiles.find(p => p?.name && p.name !== null);
                        if (validProfile) {
                            currentProfile = validProfile as Profile;
                        }
                    }
                }

                if (!currentProfile || !currentProfile.name) {
                    toast.info("Este estudiante no tiene un rol asignado");
                    return;
                }

                // No permitir quitar roles únicos si están asignados
                if (currentProfile.isUnique) {
                    toast.warning(
                        `No puedes quitar el rol único "${currentProfile.name}". Solo puedes cambiarlo por otro rol.`,
                        {
                            position: "top-center",
                            autoClose: 4000,
                        }
                    );
                    return;
                }

                // Mostrar toast de confirmación
                toast.info(
                    `Quitando rol "${currentProfile.name}"...`,
                    {
                        position: "top-center",
                        autoClose: 2000,
                    }
                );

                // Asignar un rol vacío/null para remover
                const res = await dispatch(addProfileToStudent([
                    {
                        teamScrumId: selectedTeamForHistory.id,
                        studentId: parseInt(studentId),
                        profileId: "",
                        isActive: false,
                        isUnique: false
                    } as any
                ]));

                if (addProfileToStudent.rejected.match(res)) {
                    const message =
                        res.payload?.message ||
                        res.error?.message ||
                        "Error desconocido al quitar el perfil";
                    toast.error(`Error al quitar perfil: ${message}`, {
                        position: "top-center",
                        autoClose: 5000,
                    });
                    return;
                }

                await dispatch(fetchStudySheetWithTeamScrum({ id: studySheetId }));

                toast.success(`Rol "${currentProfile.name}" removido exitosamente`, {
                    position: "top-center",
                    autoClose: 3000,
                });

            } catch (error: any) {
                toast.error(`Error inesperado: ${error?.message || "Error desconocido"}`, {
                    position: "top-center",
                    autoClose: 5000,
                });
            }
        }
    };

    // Modal handlers
    const modalHandlers: ModalHandlers = {
        onOpenModal: () => setModalOpen(true),
        onCloseModal: () => setModalOpen(false),
        onOpenTeamInfo: (team: TeamsScrum) => {
            setSelectedTeamForInfo(team);
            setOpenTeamInfoModal(true);
        },
        onCloseTeamInfo: () => {
            setSelectedTeamForInfo(null);
            setOpenTeamInfoModal(false);
        },
        onOpenHistory: (team: TeamsScrum) => {
            setSelectedTeamForHistory({
                ...team,
                processMethodology: team.processMethodology ?? null
            });
            setIsHistoryModalOpen(true);
        },
        onCloseHistory: () => {
            setSelectedTeamForHistory(null);
            setIsHistoryModalOpen(false);
        },
        onOpenConfirmDelete: (team: TeamsScrum) => {
            setTeamToDelete(team);
            setConfirmModalOpen(true);
        },
        onCloseConfirmDelete: () => {
            setTeamToDelete(null);
            setConfirmModalOpen(false);
        }
    };

    const handleConfirmDelete = () => {
        if (teamToDelete) {
            teamHandlers.onDeleteTeam(
                teamToDelete.id ?? "",
                teamToDelete.teamName ?? "Sin nombre"
            );
        }
        modalHandlers.onCloseConfirmDelete();
    };

    return {
        // State
        studySheet,
        teams,
        scrumProfiles,
        selectedTeamForHistory,
        selectedTeamForInfo,
        teamToDelete,
        processMethodologies,
        studySheetLoading,
        isInitialLoad,

        // Modal states
        modalOpen,
        confirmModalOpen,
        openTeamInfoModal,
        isHistoryModalOpen,

        // Handlers
        teamHandlers,
        modalHandlers,
        handleConfirmDelete
    };
};
