import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { client } from '@lib/apollo-client';
import { GET_EVALUATIONS_BY_CHECKLIST } from '@graphql/evaluationsGraph';
import { GET_TEAMS_SCRUMS } from '@graphql/teamsScrumGraph';

// Types
export interface StudentEvaluatedChecklist {
    evaluationId: string;
    observations: string;
    recommendations: string;
    valueJudgment: string;
    checklistId: string;
    trimester: string;
    component: string;
    state: string;
    dateAssigned: string;
    studySheets: string;
    trainingProjectName: string;
    teamScrumName: string;
    teamScrumProject: string;
    evaluatedBy: string;
    evaluatedAt: string;
    items: ChecklistItem[];
    completedItems: number;
    totalItems: number;
    completionPercentage: number;
}

interface ChecklistItem {
    id: string;
    code: string;
    indicator: string;
    active: boolean;
}

interface StudySheetData {
    id: string;
    number: string;
    teamsScrum: TeamScrum[];
}

interface TeamScrum {
    id: string;
    teamName: string;
    projectName: string;
    students: Student[];
}

interface Student {
    id: string;
    person: {
        name: string;
        lastname: string;
    };
}

// Service methods integrated into slice
const studentChecklistService = {
    getEvaluatedChecklists: async (studentId: string, teamScrumName: string, page: number = 0, size: number = 10) => {
        try {
            const { data } = await client.query({
                query: GET_EVALUATIONS_BY_CHECKLIST,
                variables: { 
                    studentId, 
                    teamScrumName,
                    page, 
                    size 
                },
                fetchPolicy: 'no-cache',
            });
            return data?.evaluatedChecklistsByStudent;
        } catch (error) {
            console.error("Error fetching student evaluated checklists:", error);
            throw error;
        }
    },

    getStudySheetWithTeamScrum: async (studySheetId: string) => {
        try {
            const { data } = await client.query({
                query: GET_TEAMS_SCRUMS,
                variables: { studySheetId },
                fetchPolicy: 'no-cache',
            });

            // Transform data to match expected structure
            const studySheetData = data?.teamsScrumByStudySheet?.data ? {
                id: studySheetId,
                number: data.teamsScrumByStudySheet.data[0]?.studySheet?.number || studySheetId,
                teamsScrum: data.teamsScrumByStudySheet.data
            } : null;

            return studySheetData;
        } catch (error) {
            console.error("Error fetching study sheet with team scrum:", error);
            throw error;
        }
    },

    filterChecklistsByTeamScrum: (checklists: StudentEvaluatedChecklist[], userTeamScrum: string): StudentEvaluatedChecklist[] => {
        if (!checklists || !userTeamScrum) return [];
        
        return checklists.filter(checklist => 
            checklist.teamScrumName === userTeamScrum
        );
    },

    getStudentTeamScrum: (studySheetData: StudySheetData | null, studentId: string): string | null => {
        if (!studySheetData?.teamsScrum || !studentId) return null;

        for (const team of studySheetData.teamsScrum) {
            const isStudentInTeam = team.students?.some(student => student.id === studentId);
            if (isStudentInTeam) {
                return team.teamName;
            }
        }

        return null;
    },

    getEvaluationStats: (checklists: StudentEvaluatedChecklist[]) => {
        if (!checklists || checklists.length === 0) {
            return {
                totalEvaluations: 0,
                averageCompletion: 0,
                passedEvaluations: 0,
                pendingEvaluations: 0,
            };
        }

        const totalEvaluations = checklists.length;
        const totalCompletion = checklists.reduce((sum, checklist) => sum + checklist.completionPercentage, 0);
        const averageCompletion = totalCompletion / totalEvaluations;
        
        const passedEvaluations = checklists.filter(checklist => 
            ['EXCELENTE', 'BUENO', 'ACEPTABLE'].includes(checklist.valueJudgment?.toUpperCase())
        ).length;
        
        const pendingEvaluations = totalEvaluations - passedEvaluations;

        return {
            totalEvaluations,
            averageCompletion: Math.round(averageCompletion),
            passedEvaluations,
            pendingEvaluations,
        };
    },
};

// Async thunks
export const fetchStudentEvaluatedChecklists = createAsyncThunk(
    'studentChecklist/fetchEvaluated',
    async ({ studentId, teamScrumName, page = 0, size = 10 }: { 
        studentId: string; 
        teamScrumName: string; 
        page?: number; 
        size?: number; 
    }) => {
        const { data } = await client.query({
            query: GET_EVALUATIONS_BY_CHECKLIST,
            variables: { 
                studentId, 
                teamScrumName,
                page, 
                size 
            },
            fetchPolicy: 'no-cache',
        });
        return data?.evaluatedChecklistsByStudent;
    }
);

export const fetchStudySheetWithTeamScrum = createAsyncThunk(
    'studentChecklist/fetchStudySheetWithTeamScrum',
    async (studySheetId: string) => {
        const { data } = await client.query({
            query: GET_TEAMS_SCRUMS,
            variables: { studySheetId },
            fetchPolicy: 'no-cache',
        });

        // Transform data to match expected structure
        const studySheetData = data?.teamsScrumByStudySheet?.data ? {
            id: studySheetId,
            number: data.teamsScrumByStudySheet.data[0]?.studySheet?.number || studySheetId,
            teamsScrum: data.teamsScrumByStudySheet.data
        } : null;

        return studySheetData;
    }
);

interface StudentChecklistState extends ReturnType<typeof createInitialPaginatedState> {
    evaluatedChecklists: StudentEvaluatedChecklist[];
    studySheetData: StudySheetData | null;
    evaluationStats: {
        totalEvaluations: number;
        averageCompletion: number;
        passedEvaluations: number;
        pendingEvaluations: number;
    };
}

const initialState: StudentChecklistState = {
    ...createInitialPaginatedState(),
    evaluatedChecklists: [],
    studySheetData: null,
    evaluationStats: {
        totalEvaluations: 0,
        averageCompletion: 0,
        passedEvaluations: 0,
        pendingEvaluations: 0,
    },
};

const studentChecklistSlice = createSlice({
    name: 'studentChecklist',
    initialState,
    reducers: {
        clearStudentChecklists: (state) => {
            state.evaluatedChecklists = [];
            state.studySheetData = null;
            state.loading = false;
            state.error = null;
        },
        updateEvaluationStats: (state) => {
            state.evaluationStats = studentChecklistService.getEvaluationStats(state.evaluatedChecklists);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch student evaluated checklists
            .addCase(fetchStudentEvaluatedChecklists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentEvaluatedChecklists.fulfilled, (state, action) => {
                state.evaluatedChecklists = action.payload?.data || [];
                state.evaluationStats = studentChecklistService.getEvaluationStats(state.evaluatedChecklists);
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchStudentEvaluatedChecklists.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching student checklists';
                state.loading = false;
            })
            // Fetch study sheet with team scrum
            .addCase(fetchStudySheetWithTeamScrum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetWithTeamScrum.fulfilled, (state, action) => {
                state.studySheetData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchStudySheetWithTeamScrum.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheet data';
                state.loading = false;
            });
    }
});

export const { clearStudentChecklists, updateEvaluationStats } = studentChecklistSlice.actions;

// Export service methods for compatibility
export { studentChecklistService };

export default studentChecklistSlice.reducer;
