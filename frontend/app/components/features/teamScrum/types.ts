// Importar tipos generados por GraphQL CodeGen
import type {
    StudySheet,
    TeamsScrum,
    Student,
    Profile,
    ProcessMethodology,
    TeamsScrumDto,
    MutationAddTeamScrumArgs,
    TeamScrumMemberId
} from '@/graphql/generated';

// Interfaces específicas para el módulo de Team Scrum
export interface TeamInfoData {
    projectName: string;
    teamName: string;
    description: string;
    objectives: string;
    problem: string;
    projectJustification: string;
    memberIds: { studentId: number; profileId: string }[];
}

export interface TeamScrumState {
    studySheet: StudySheet | null;
    teams: TeamsScrum[];
    loading: boolean;
    error: string | null;
}

export interface TeamCardProps {
    team: TeamsScrum;
    onOpenTeamInfo: (team: TeamsScrum) => void;
    onOpenHistory: (team: TeamsScrum) => void;
    onOpenConfirmDelete: (team: TeamsScrum) => void;
}

export interface TeamScrumContainerProps {
    studySheetId: number;
}

export interface ProfileAssignmentData {
    teamScrumId: string;
    studentId: number;
    profileId: string;
    isActive: boolean;
    isUnique: boolean;
}

// Handlers types para mejor tipado
export interface TeamHandlers {
    onAddTeam: (input: TeamsScrumDto) => Promise<boolean>;
    onUpdateTeam: (teamId: string, data: TeamInfoData) => Promise<boolean>;
    onDeleteTeam: (teamId: string, teamName: string) => Promise<boolean>;
    onAssignProfile: (studentId: string, profile: Profile) => Promise<void>;
    onRemoveProfile: (studentId: string) => Promise<void>;
}

export interface ModalHandlers {
    onOpenModal: () => void;
    onCloseModal: () => void;
    onOpenTeamInfo: (team: TeamsScrum) => void;
    onCloseTeamInfo: () => void;
    onOpenHistory: (team: TeamsScrum) => void;
    onCloseHistory: () => void;
    onOpenConfirmDelete: (team: TeamsScrum) => void;
    onCloseConfirmDelete: () => void;
}

// Re-exportar tipos para facilitar el uso
export type {
    StudySheet,
    TeamsScrum,
    Student,
    Profile,
    ProcessMethodology,
    TeamsScrumDto,
    MutationAddTeamScrumArgs,
    TeamScrumMemberId
};
