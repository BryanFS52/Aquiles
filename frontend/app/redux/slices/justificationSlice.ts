import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_JUSTIFICATIONS, GET_JUSTIFICATION_BY_ID, ADD_JUSTIFICATION, UPDATE_JUSTIFICATION, DELETE_JUSTIFICATION } from '@graphql/justificationsGraph'
import { JustificationItem } from '@type/slices/justification'
import {
    GetAllJustificationsQuery,
    GetAllJustificationsQueryVariables,
    GetJustificationByIdQuery,
    GetJustificationByIdQueryVariables,
    AddJustificationMutation,
    AddJustificationMutationVariables,
    UpdateJustificationMutation,
    UpdateJustificationMutationVariables,
    DeleteJustificationMutation,
    DeleteJustificationMutationVariables
} from '@graphql/generated'

// Tipos para el estado extendido
interface TransformedJustificationItem {
    id: number;
    programa: string;
    ficha: string;
    documento: string;
    aprendiz: string;
    fecha: string;
    estado: string;
    archivoAdjunto: string;
    archivoMime: string;
}

interface FilterOptions {
    selectedFiltro: string;
    searchTerm: string;
}

interface JustificationState extends ReturnType<typeof createInitialPaginatedState> {
    data: JustificationItem[];
    transformedData: TransformedJustificationItem[];
    filteredData: TransformedJustificationItem[];
    filterOptions: FilterOptions;
    localCurrentPage: number;
    itemsPerPage: number;
}

// Utilidades movidas al slice
const getMimeTypeFromBase64 = (base64: string): string => {
    if (!base64) return "application/octet-stream";

    const signatures = {
        "iVBORw0KGgo": "image/png",
        "/9j/": "image/jpeg",
        "JVBERi0": "application/pdf",
        "R0lGODdh": "image/gif",
        "R0lGODlh": "image/gif",
        "UEsDBBQ": "application/zip",
    };

    const prefix = base64.substring(0, 20);

    for (const sig in signatures) {
        if (prefix.startsWith(sig)) {
            const key = sig as keyof typeof signatures;
            return signatures[key];
        }
    }


    return "application/octet-stream";
};

const getExtensionFromMime = (mimeType: string): string => {
    const map = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "application/pdf": "pdf",
        "image/gif": "gif",
        "application/zip": "zip",
    };
    return map[mimeType as keyof typeof map] || "bin";
};

// Función para transformar datos de GraphQL a JustificationItem
const transformGraphQLToJustificationItem = (graphqlData: any): JustificationItem => {
    return {
        id: graphqlData.justificationId || graphqlData.id,
        description: graphqlData.description,
        justificationDate: graphqlData.justificationDate,
        name: graphqlData.name,
        documentNumber: graphqlData.documentNumber,
        justificationFile: graphqlData.justificationFile,
        justificationHistory: graphqlData.justificationHistory,
        state: graphqlData.state,
        notificationId: graphqlData.notificationId,
        justificationType: graphqlData.justificationType ? {
            id: graphqlData.justificationType.id,
            name: graphqlData.justificationType.name
        } : { id: 0, name: '' }
    };
};

// Función para transformar datos al formato del componente
const transformToComponentFormat = (justifications: JustificationItem[]): TransformedJustificationItem[] => {
    return justifications.map((j) => ({
        id: j.id,
        programa: j.justificationType?.name || "Sin programa",
        ficha: j.notificationId || "N/A",
        documento: j.documentNumber,
        aprendiz: j.name,
        fecha: new Date(j.justificationDate).toLocaleDateString("es-CO"),
        estado: j.state ? "Activo" : "Inactivo",
        archivoAdjunto: j.justificationFile,
        archivoMime: getMimeTypeFromBase64(j.justificationFile),
    }));
};

// Función para filtrar datos
const filterJustifications = (
    data: TransformedJustificationItem[],
    filterOptions: FilterOptions
): TransformedJustificationItem[] => {
    const { selectedFiltro, searchTerm } = filterOptions;

    if (!searchTerm) return data;

    // Si el filtro es "todo" o no se seleccionó ninguno, buscar en todos los campos
    if (!selectedFiltro || selectedFiltro === "todo") {
        return data.filter((j) =>
            j.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.ficha.toString().includes(searchTerm) ||
            j.documento.includes(searchTerm) ||
            j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.fecha.includes(searchTerm) ||
            j.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Si hay un filtro específico, buscar solo en ese campo
    return data.filter((j) => {
        switch (selectedFiltro) {
            case "programa":
                return j.programa.toLowerCase().includes(searchTerm.toLowerCase());
            case "ficha":
                return j.ficha.toString().includes(searchTerm);
            case "documento":
                return j.documento.includes(searchTerm);
            case "aprendiz":
                return j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase());
            case "fecha":
                return j.fecha.includes(searchTerm);
            case "estado":
                if (searchTerm === "true") return j.estado === "Activo";
                if (searchTerm === "false") return j.estado === "Inactivo";
                return true;
                default:
                return true;
        }
    });
};

// Función para descargar archivo
export const downloadBase64File = (base64Data: string, fileName: string, mimeType: string = "application/octet-stream") => {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
};

// Función para generar nombre de archivo
export const generateFileName = (id: number, mimeType: string): string => {
    const extension = getExtensionFromMime(mimeType);
    return `justificacion_${id}.${extension}`;
};

// Función para formatear mensaje de error
export const formatErrorMessage = (error: any): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'Error desconocido';
};

// Thunks existentes
export const fetchJustifications = createAsyncThunk<GetAllJustificationsQuery['allJustifications'], GetAllJustificationsQueryVariables
>(
    'justifications/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>({
            query: GET_ALL_JUSTIFICATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allJustifications;
    }
);

export const fetchJustificationById = createAsyncThunk<GetJustificationByIdQuery['justificationById'], GetJustificationByIdQueryVariables
>(
    'justifications/fetchById',
    async ({ id }) => {
        const { data } = await client.query<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>({
            query: GET_JUSTIFICATION_BY_ID,
            variables: { id },
        });
        return data.justificationById;
    }
);

export const addJustification = createAsyncThunk<AddJustificationMutation['addJustification'], AddJustificationMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'justifications/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<AddJustificationMutation, AddJustificationMutationVariables>({
                mutation: ADD_JUSTIFICATION,
                variables: { input }
            });
            const res = data?.addJustification;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateJustification = createAsyncThunk<UpdateJustificationMutation['updateJustification'], UpdateJustificationMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'justifications/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<UpdateJustificationMutation, UpdateJustificationMutationVariables>({
                mutation: UPDATE_JUSTIFICATION,
                variables: { id, input },
            });

            const res = data?.updateJustification;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteJustification = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'justifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<DeleteJustificationMutation, DeleteJustificationMutationVariables>({
                mutation: DELETE_JUSTIFICATION,
                variables: { id },
            });

            const res = data?.deleteJustification;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

// Estado inicial extendido
const initialState: JustificationState = {
    ...createInitialPaginatedState<JustificationItem>(),
    transformedData: [],
    filteredData: [],
    filterOptions: {
        selectedFiltro: "",
        searchTerm: ""
    },
    localCurrentPage: 1,
    itemsPerPage: 6
};

const justificationSlice = createSlice({
    name: 'justifications',
    initialState,
    reducers: {
        // Actualizar filtros
        setFilterOptions: (state, action: PayloadAction<Partial<FilterOptions>>) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload };
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
        },

        // Limpiar filtros
        clearFilters: (state) => {
            state.filterOptions = { selectedFiltro: "", searchTerm: "" };
            state.filteredData = state.transformedData;
        },

        // Actualizar página local
        setLocalCurrentPage: (state, action: PayloadAction<number>) => {
            state.localCurrentPage = action.payload;
        },

        // Ir a página anterior
        goToPreviousPage: (state) => {
            state.localCurrentPage = Math.max(state.localCurrentPage - 1, 1);
        },

        // Ir a página siguiente
        goToNextPage: (state) => {
            const maxPages = state.totalPages || 1;
            state.localCurrentPage = Math.min(state.localCurrentPage + 1, maxPages);
        },

        // Actualizar items per page
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchJustifications
            .addCase(fetchJustifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustifications.fulfilled, (state, action: PayloadAction<GetAllJustificationsQuery['allJustifications']>) => {
                if (action.payload?.data) {
                    // Filtra nulls y transforma los datos
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToJustificationItem);

                    // Transforma datos para el componente
                    state.transformedData = transformToComponentFormat(state.data);

                    // Aplica filtros actuales
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);

                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchJustifications.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching justifications';
                state.loading = false;
            })
            // fetchJustificationById
            .addCase(fetchJustificationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustificationById.fulfilled, (state, action: PayloadAction<GetJustificationByIdQuery['justificationById']>) => {
                if (action.payload) {
                    state.data = [transformGraphQLToJustificationItem(action.payload)];
                    state.transformedData = transformToComponentFormat(state.data);
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                }
                state.loading = false;
            })
            .addCase(fetchJustificationById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addJustification
            .addCase(addJustification.fulfilled, (state, action: PayloadAction<AddJustificationMutation['addJustification']>) => {
                if (action.payload) {
                    const newJustification = transformGraphQLToJustificationItem(action.payload);
                    state.data.push(newJustification);
                    state.transformedData = transformToComponentFormat(state.data);
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                }
                state.error = null;
            })
            .addCase(addJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateJustification
            .addCase(updateJustification.fulfilled, (state, action: PayloadAction<UpdateJustificationMutation['updateJustification']>) => {
                if (action.payload) {
                    const updatedJustification = transformGraphQLToJustificationItem(action.payload);
                    const index = state.data.findIndex((justification: JustificationItem) => justification.id === updatedJustification.id);
                    if (index !== -1) {
                        state.data[index] = updatedJustification;
                        state.transformedData = transformToComponentFormat(state.data);
                        state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                    }
                }
                state.error = null;
            })
            .addCase(updateJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // deleteJustification
            .addCase(deleteJustification.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((justification: JustificationItem) => justification.id !== Number(action.payload));
                    state.transformedData = transformToComponentFormat(state.data);
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                }
                state.error = null;
            })
            .addCase(deleteJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
    }
});

export const {
    setFilterOptions,
    clearFilters,
    setLocalCurrentPage,
    goToPreviousPage,
    goToNextPage,
    setItemsPerPage
} = justificationSlice.actions;

export default justificationSlice.reducer;