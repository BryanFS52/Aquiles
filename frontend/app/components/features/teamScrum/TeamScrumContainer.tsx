'use client';

import React from 'react';
import { useLoader } from '@context/LoaderContext';
import { MdAddCircle, MdGroup } from 'react-icons/md';
import { TeamCard } from './TeamCard';
import { TeamDeleteConfirmation } from './TeamDeleteConfirmation';
import { ModalComposition } from '@/components/features/teamScrum/modalComposition';
import { useTeamScrum } from './useTeamScrum';
import { TeamScrumContainerProps } from './types';
import PageTitle from '@components/UI/pageTitle';
import EmptyState from '@components/UI/emptyState';
import ModalNewTeam from '@components/features/teamScrum/modalNewTeam';
import ModalTeamInformation from '@/components/features/teamScrum/modalTeamScrumInfo';
import { useRouter } from 'next/navigation';

export const TeamScrumContainer: React.FC<TeamScrumContainerProps> = ({ studySheetId }) => {
    const { showLoader, hideLoader } = useLoader();
    const router = useRouter();

    const {
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
    } = useTeamScrum(studySheetId);

    // Manejar loader
    React.useEffect(() => {
        if (studySheetLoading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [studySheetLoading, showLoader, hideLoader]);

    // Loading state
    if (isInitialLoad && studySheetLoading) {
        return (
            <div className="p-6">
                <PageTitle>
                    Teams Scrum de la Ficha {studySheet ? `N° ${studySheet.number}` : ""}
                </PageTitle>

                <div className="bg-white dark:bg-shadowBlue rounded-xl p-12 text-center border border-lightGray dark:border-grayText">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-darkGray dark:text-white mb-2">
                        Cargando información de la ficha...
                    </h3>
                    <p className="text-grayText dark:text-white">
                        Por favor espera mientras obtenemos los datos.
                    </p>
                </div>
            </div>
        );
    }

    // Render
    return (
        <div className="p-6">
            <PageTitle onBack={() => router.back()}>
                Teams Scrum de la Ficha {studySheet ? `N° ${studySheet.number}` : ""}
            </PageTitle>

            {/* Modales */}
            <ModalNewTeam
                isOpen={modalOpen}
                onClose={modalHandlers.onCloseModal}
                onCreate={teamHandlers.onAddTeam}
                studySheetId={studySheetId}
                processMethodologies={processMethodologies || []}
            />
            <TeamDeleteConfirmation
                isOpen={confirmModalOpen}
                onClose={modalHandlers.onCloseConfirmDelete}
                onConfirm={handleConfirmDelete}
                team={teamToDelete}
            />
            <ModalTeamInformation
                isOpen={openTeamInfoModal}
                onClose={modalHandlers.onCloseTeamInfo}
                team={selectedTeamForInfo}
                onSave={teamHandlers.onUpdateTeam}
            />
            <ModalComposition
                isOpen={isHistoryModalOpen}
                onClose={modalHandlers.onCloseHistory}
                teamData={selectedTeamForHistory}
                onSelectProfile={teamHandlers.onAssignProfile}
                profiles={scrumProfiles}
            />

            <div className="mt-8">
                {/* Botón para crear nuevo equipo */}
                <div className="mb-6">
                    <button
                        onClick={modalHandlers.onOpenModal}
                        className="px-6 py-3 text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 inline-flex items-center gap-2"
                    >
                        <MdAddCircle className="w-5 h-5" />
                        Crear Nuevo Equipo
                    </button>
                </div>

                {teams.length === 0 ? (
                    <EmptyState
                        message="No hay Teams Scrum disponibles para esta ficha"
                        icon="/img/LogoAquilesWhite.png"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {teams.map((team) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onOpenTeamInfo={modalHandlers.onOpenTeamInfo}
                                onOpenHistory={modalHandlers.onOpenHistory}
                                onOpenConfirmDelete={modalHandlers.onOpenConfirmDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
