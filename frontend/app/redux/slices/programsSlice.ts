/*

// Cambiar de axios a redux

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic';

// Service methods integrated into slice
interface Program {
    id: number;
    name: string;
    description?: string;
    [key: string]: any;
}

// Async thunks
export const fetchProgramById = createAsyncThunk<Program, number>(
    'programs/fetchById',
    async (id) => {
        const response = await axios.get(`http://localhost:8081/api/programs/${id}`);
        return response.data;
    }
);

export const fetchAllPrograms = createAsyncThunk<Program[]>(
    'programs/fetchAll',
    async () => {
        const response = await axios.get('http://localhost:8081/api/programs/all');
        return response.data;
    }
);

const programsSlice = createSlice({
    name: 'programs',
    initialState,
    reducers: {
        clearPrograms: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
            state.selectedProgram = null;
        },
        setSelectedProgram: (state, action) => {
            state.selectedProgram = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Fetch all programs
        builder
            .addCase(fetchAllPrograms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPrograms.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAllPrograms.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching programs';
                state.loading = false;
            });

        // Fetch program by ID
        builder
            .addCase(fetchProgramById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProgramById.fulfilled, (state, action) => {
                state.selectedProgram = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchProgramById.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching program by ID';
                state.loading = false;
            });
    }
});

export const { clearPrograms, setSelectedProgram } = programsSlice.actions;

// Export service methods for compatibility
export { programsService };

export default programsSlice.reducer;
*/