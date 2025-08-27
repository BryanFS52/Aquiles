import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clientLAN } from '@lib/apollo-client';
import { GET_ATTENDANCES_BY_COMPETENCE_QUARTER_AND_JUSTIFICATIONS } from '@graphql/attendancesGraph';
import {
    GetAttendancesByCompetenceQuarterAndJustificationsQuery,
    GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables,
} from '@graphql/generated';
import { RejectedPayload } from '@type/slices/common/generic';
import { updateJustificationStatus } from './justificationSlice'; // Importar el thunk del otro slice

export interface CompetenceQuarterJustification {
    id: number;
    ficha: string;
    absenceDate: string;
    justificationDate: string;
    estado: string;
    state: boolean;
    justificationType: string;
    archivoAdjunto: string;
    archivoMime: string;
    documento: string;
    aprendiz: string;
    attendanceId?: string;
    justificationStatusId?: string;
    justificationStatus: string;
}

interface CompetenceQuarterJustificationsState {
    data: CompetenceQuarterJustification[];
    loading: boolean;
    error: string | null;
}

// Función de transformación
const transformToJustificationFormat = (data: any[]): CompetenceQuarterJustification[] => {
    return data
        .filter(item => item.justification) // Solo items con justificación
        .map(item => ({
            id: parseInt(item.justification?.id || '0'),
            ficha: '', // No disponible en esta consulta
            absenceDate: item.justification?.absenceDate || '',
            justificationDate: item.justification?.justificationDate || '',
            estado: item.justification?.justificationStatus?.name || 'En proceso',
            state: true,
            justificationType: '',
            archivoAdjunto: item.justification?.justificationFile || '',
            archivoMime: '',
            documento: item.student?.person?.document || '',
            aprendiz: `${item.student?.person?.name || ''} ${item.student?.person?.lastname || ''}`.trim(),
            attendanceId: item.id || '',
            justificationStatusId: item.justification?.justificationStatus?.id || '',
            justificationStatus: item.justification?.justificationStatus?.name || 'En proceso',
        }));
};

// Async thunk
export const fetchJustificationsByCompetenceQuarter = createAsyncThunk<
    CompetenceQuarterJustification[],
    GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables
>(
    'competenceQuarterJustifications/fetch',
    async ({ competenceQuarterId }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<
                GetAttendancesByCompetenceQuarterAndJustificationsQuery,
                GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables
            >({
                query: GET_ATTENDANCES_BY_COMPETENCE_QUARTER_AND_JUSTIFICATIONS,
                variables: { competenceQuarterId },
                fetchPolicy: 'no-cache',
            });

            const rawData = data.allAttendanceByCompetenceQuarterIdWithJustifications?.data || [];
            const cleanData = rawData.filter((item): item is NonNullable<typeof item> => item !== null);
            
            return transformToJustificationFormat(cleanData);
        } catch (error) {
            console.error("Error al obtener justificaciones por competence quarter", error);
            return rejectWithValue({ message: (error as Error).message || 'Unknown error' });
        }
    }
);

const initialState: CompetenceQuarterJustificationsState = {
    data: [],
    loading: false,
    error: null,
};

const competenceQuarterJustificationsSlice = createSlice({
    name: 'competenceQuarterJustifications',
    initialState,
    reducers: {
        clearJustifications: (state) => {
            state.data = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJustificationsByCompetenceQuarter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationsByCompetenceQuarter.fulfilled, (state, action: PayloadAction<CompetenceQuarterJustification[]>) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchJustificationsByCompetenceQuarter.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as RejectedPayload)?.message ?? action.error.message ?? 'Error al cargar justificaciones';
            })
            // Escuchar cambios de estado de justificaciones del slice principal
            .addCase(updateJustificationStatus.fulfilled, (state, action) => {
                // Obtener los datos de los argumentos del thunk
                if (action.meta.arg && action.payload) {
                    const { id, statusId, statusName } = action.meta.arg;
                    
                    // Convertir el ID a número para comparación consistente
                    const targetId = parseInt(id);
                    const justificationIndex = state.data.findIndex(j => j.id === targetId);
                    
                    if (justificationIndex !== -1) {
                        console.log("🔄 Actualizando competence quarter justificación:", {
                            id: targetId,
                            newStatusName: statusName,
                            estadoAnterior: state.data[justificationIndex].estado
                        });
                        
                        // Actualizar el estado local inmediatamente
                        state.data[justificationIndex] = {
                            ...state.data[justificationIndex],
                            estado: statusName || 'Estado actualizado',
                            justificationStatus: statusName || 'Estado actualizado',
                            justificationStatusId: statusId
                        };
                        
                        console.log("✅ Estado actualizado en competence quarter slice para justificación:", targetId);
                    }
                }
            });
    }
});

// Actions
export const { clearJustifications } = competenceQuarterJustificationsSlice.actions;

// Selectores
export const selectJustifications = (state: any) => state.competenceQuarterJustifications?.data || [];
export const selectJustificationsLoading = (state: any) => state.competenceQuarterJustifications?.loading || false;
export const selectJustificationsError = (state: any) => state.competenceQuarterJustifications?.error || null;
export const selectHasJustifications = (state: any) => {
    const data = state.competenceQuarterJustifications?.data || [];
    return data.length > 0;
};

export default competenceQuarterJustificationsSlice.reducer;
