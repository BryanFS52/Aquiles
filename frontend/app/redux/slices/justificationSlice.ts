import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RejectedPayload } from '@type/slices/common/errores'
import {
    GET_ALL_JUSTIFICATIONS,
    GET_JUSTIFICATION_BY_ID,
    ADD_JUSTIFICATION,
    UPDATE_JUSTIFICATION,
    DELETE_JUSTIFICATION,
} from '@graphql/justificationsGraph';
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
} from '@graphql/generated';
import {
    JustificationItem,
    JustificationState,
    DownloadFilePayload,
    FiltroType,
    initialJustificationState
} from '@type/slices/justification';


// Función para transformar datos de GraphQL a JustificationItem
const transformGraphQLToJustificationItem = (graphqlData: any): JustificationItem => {
    return {
        id: graphqlData.id,
        documentNumber: graphqlData.documentNumber,
        name: graphqlData.name,
        description: graphqlData.description,
        justificationFile: graphqlData.justificationFile,
        justificationDate: graphqlData.justificationDate,
        justificationHistory: graphqlData.justificationHistory,
        state: graphqlData.state,
        justificationType: graphqlData.justificationType ? {
            id: graphqlData.justificationType.id,
            name: graphqlData.justificationType.name
        } : null
    };
};

// Función para obtener el MIMETYPE base64
function getMimeTypeFromBase64(base64: string): string {
    if (!base64) return "application/octet-stream";

    const signatures: Record<string, string> = {
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
            return signatures[sig];
        }
    }

    return "application/octet-stream";
}

// Función para descargar archivo base64
function downloadBase64File(base64Data: string, fileName: string, mimeType = "application/octet-stream"): void {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

export const fetchJustifications = createAsyncThunk<
    GetAllJustificationsQuery['allJustifications'],
    GetAllJustificationsQueryVariables
>(
    'justification/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>({
            query: GET_ALL_JUSTIFICATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });

        // Transformar los datos según la lógica 
        const transformedData: JustificationItem[] = data.allJustifications.data.map((j) => ({
            id: j.id,
            programa: j.justificationType?.name || "Sin programa",
            ficha: j.notificationId || "N/A",
            documento: j.documentNumber,
            aprendiz: j.name,
            fecha: new Date(j.justificationDate).toLocaleDateString("es-CO"),
            estado: j.state ? "Activo" : "Inactivo",
            archivoAdjunto: j.justificationFile,
            archivoMime: j.fileType || getMimeTypeFromBase64(j.justificationFile),
        }));

        return {
            ...data.allJustifications,
            data: transformedData
        };
    }
);

export const fetchJustificationById = createAsyncThunk<
    GetJustificationByIdQuery['justificationById'],
    GetJustificationByIdQueryVariables
>(
    'justification/fetchById',
    async ({ id }) => {
        const { data } = await client.query<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>({
            query: GET_JUSTIFICATION_BY_ID,
            variables: { id },
        });
        return data.justificationById;
    }
);

export const addJustification = createAsyncThunk<
    AddJustificationMutation['addJustification'],
    AddJustificationMutationVariables['input'],
    { rejectValue: RejectedPayload }
>(
    'justification/add',
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

export const updateJustification = createAsyncThunk<
    UpdateJustificationMutation['updateJustification'],
    UpdateJustificationMutationVariables,
    { rejectValue: RejectedPayload }
>(
    'justification/update',
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

export const deleteJustification = createAsyncThunk<
    string,
    string,
    { rejectValue: RejectedPayload }
>(
    'justification/delete',
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

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const justificationSlice = createSlice({
    name: 'justification',
    initialState: initialJustificationState,
    reducers: {
        // Filtros y búsqueda
        setSelectedFiltro: (state, action: PayloadAction<FiltroType>) => {
            state.selectedFiltro = action.payload;
            state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
        },
        clearFilters: (state) => {
            state.selectedFiltro = "";
            state.searchTerm = "";
            state.filteredData = state.data;
        },
        // Paginación
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 1; // Reset a la primera página
        },
        nextPage: (state) => {
            if (state.currentPage < state.totalPages) {
                state.currentPage += 1;
            }
        },
        previousPage: (state) => {
            if (state.currentPage > 1) {
                state.currentPage -= 1;
            }
        },
        // Utilidades
        downloadFile: (state, action: PayloadAction<DownloadFilePayload>) => {
            const { base64Data, fileName, mimeType } = action.payload;
            downloadBase64File(base64Data, fileName, mimeType);
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchJustifications
            .addCase(fetchJustifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustifications.fulfilled, (state, action: PayloadAction<GetAllJustificationsQuery['allJustifications']>) => {
                const payload = action.payload;
                if (payload?.data) {
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(item => item as JustificationItem);
                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 1;
                    // Aplicar filtros a los nuevos datos
                    state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
                } else {
                    state.data = [];
                    state.filteredData = [];
                    state.totalItems = 0;
                    state.totalPages = 0;
                    state.currentPage = 1;
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
                state.error = null;
            })
            .addCase(fetchJustificationById.fulfilled, (state, action: PayloadAction<GetJustificationByIdQuery['justificationById']>) => {
                if (action.payload) {
                    state.data = [action.payload as JustificationItem];
                    state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
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
            .addCase(addJustification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addJustification.fulfilled, (state, action: PayloadAction<AddJustificationMutation['addJustification']>) => {
                if (action.payload) {
                    const newJustification = action.payload as JustificationItem;
                    state.data.push(newJustification);
                    // Actualizar datos filtrados
                    state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(addJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // updateJustification
            .addCase(updateJustification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJustification.fulfilled, (state, action: PayloadAction<UpdateJustificationMutation['updateJustification']>) => {
                if (action.payload) {
                    const updatedItem = action.payload as JustificationItem;
                    const index = state.data.findIndex((justification) => justification.id === updatedItem.id);
                    if (index !== -1) {
                        state.data[index] = { ...state.data[index], ...updatedItem };
                        // Actualizar datos filtrados
                        state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
                    }
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updateJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // deleteJustification
            .addCase(deleteJustification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJustification.fulfilled, (state, action: PayloadAction<string>) => {
                const deletedId = action.payload;
                state.data = state.data.filter((justification) => justification.id !== deletedId);
                // Actualizar datos filtrados
                state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            });
    }
});

// Función helper para filtrar justificaciones con mejor tipado
function filterJustifications(
    data: JustificationItem[],
    selectedFiltro: string,
    searchTerm: string
): JustificationItem[] {
    if (!searchTerm || !selectedFiltro) return data;

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return data.filter((justification) => {
        switch (selectedFiltro) {
            case "programa":
                return justification.programa?.toLowerCase().includes(normalizedSearchTerm) ?? false;
            case "ficha":
                return justification.ficha?.includes(searchTerm) ?? false;
            case "documento":
                return justification.documento?.includes(searchTerm) ?? false;
            case "aprendiz":
                return justification.aprendiz?.toLowerCase().includes(normalizedSearchTerm) ?? false;
            case "fecha":
                return justification.fecha?.includes(searchTerm) ?? false;
            default:
                return true;
        }
    });
}

export const {
    setSelectedFiltro,
    setSearchTerm,
    clearFilters,
    setCurrentPage,
    setItemsPerPage,
    nextPage,
    previousPage,
    downloadFile,
    clearError
} = justificationSlice.actions;

// Selectores tipados con mejor tipo de retorno
export const selectJustifications = (state: { justification: JustificationState }): JustificationItem[] =>
    state.justification.data;

export const selectFilteredJustifications = (state: { justification: JustificationState }): JustificationItem[] =>
    state.justification.filteredData;

export const selectJustificationLoading = (state: { justification: JustificationState }): boolean =>
    state.justification.loading;

export const selectJustificationError = (state: { justification: JustificationState }): JustificationState['error'] =>
    state.justification.error;

export const selectCurrentPage = (state: { justification: JustificationState }): number =>
    state.justification.currentPage;

export const selectTotalPages = (state: { justification: JustificationState }): number =>
    state.justification.totalPages;

export const selectTotalItems = (state: { justification: JustificationState }): number =>
    state.justification.totalItems;

export const selectItemsPerPage = (state: { justification: JustificationState }): number =>
    state.justification.itemsPerPage;

export const selectSelectedFiltro = (state: { justification: JustificationState }): string =>
    state.justification.selectedFiltro;

export const selectSearchTerm = (state: { justification: JustificationState }): string =>
    state.justification.searchTerm;

// Selector computado para obtener los elementos de la página actual
export const selectPaginatedJustifications = (state: { justification: JustificationState }): JustificationItem[] => {
    const { filteredData, currentPage, itemsPerPage } = state.justification;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
};

// Selector para verificar si hay más páginas
export const selectHasNextPage = (state: { justification: JustificationState }): boolean =>
    state.justification.currentPage < state.justification.totalPages;

export const selectHasPreviousPage = (state: { justification: JustificationState }): boolean =>
    state.justification.currentPage > 1;

export default justificationSlice.reducer;