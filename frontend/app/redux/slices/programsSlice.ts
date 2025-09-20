import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createInitialPaginatedState } from '@type/slices/common/generic';

// Service methods integrated into slice
interface Program {
    id: number;
    name: string;
    description?: string;
    [key: string]: any;
}

const programsService = {
    getProgramById: async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/programs/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching program:", error);
            throw error;
        }
    },

    getAllPrograms: async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/programs/all');
            return response.data;
        } catch (error) {
            console.error("Error fetching programs:", error);
            throw error;
        }
    }
};

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

interface ProgramsState {
    data: Program[];
    loading: boolean;
    error: string | null;
    selectedProgram: Program | null;
}

const initialState: ProgramsState = {
    data: [],
    loading: false,
    error: null,
    selectedProgram: null,
};

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
