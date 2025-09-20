import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Service methods integrated into slice
interface Role {
    id: number;
    name: string;
    description?: string;
    permissions?: string[];
    [key: string]: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const roleService = {
    // Función para obtener los roles desde el backend
    getRoles: async (): Promise<Role[]> => {
        try {
            const response = await axios.get(`${API_URL}/api/roles`);

            // Verifica si la respuesta contiene los roles
            if (response.data && Array.isArray(response.data.roles)) {
                return response.data.roles; // Devuelve el array de roles
            } else {
                console.error('Formato de respuesta inesperado:', response.data);
                return []; // Retorna un array vacío si el formato es incorrecto
            }
        } catch (error) {
            console.error('Error al obtener roles:', error);
            return []; // Retorna un array vacío en caso de error para evitar romper la aplicación
        }
    },
};

// Async thunks
export const fetchRoles = createAsyncThunk<Role[]>(
    'roles/fetchAll',
    async () => {
        const response = await axios.get(`${API_URL}/api/roles`);
        
        if (response.data && Array.isArray(response.data.roles)) {
            return response.data.roles;
        } else {
            console.error('Formato de respuesta inesperado:', response.data);
            return [];
        }
    }
);

interface RolesState {
    data: Role[];
    loading: boolean;
    error: string | null;
}

const initialState: RolesState = {
    data: [],
    loading: false,
    error: null,
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        clearRoles: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching roles';
                state.loading = false;
            });
    }
});

export const { clearRoles } = rolesSlice.actions;

// Export service methods for compatibility
export { roleService };

export default rolesSlice.reducer;
