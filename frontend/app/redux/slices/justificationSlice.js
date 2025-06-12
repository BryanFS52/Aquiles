import { client } from '@/lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    GET_ALL_JUSTIFICATIONS,
    GET_JUSTIFICATION_BY_ID,
    ADD_JUSTIFICATION,
    UPDATE_JUSTIFICATION,
    DELETE_JUSTIFICATION,
} from '@graphql/justificationsGraph';

// Función para obtener el MIMETYPE base64
function getMimeTypeFromBase64(base64) {
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
            return signatures[sig];
        }
    }

    return "application/octet-stream";
}

// Función para descargar archivo base64
function downloadBase64File(base64Data, fileName, mimeType = "application/octet-stream") {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

export const fetchJustifications = createAsyncThunk(
    'justification/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_ALL_JUSTIFICATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });

        // Transformar los datos según la lógica 
        const transformedData = data.allJustifications.data.map((j) => ({
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

export const fetchJustificationById = createAsyncThunk(
    'justification/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_JUSTIFICATION_BY_ID,
            variables: { id },
        });
        return data.justificationById;
    }
);

export const addJustification = createAsyncThunk(
    'justification/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_JUSTIFICATION,
                variables: { input }
            });
            const { addJustification } = data;
            // Verificamos el código de la respuesta
            if (addJustification.code !== "200") {
                // Si el código no es 200, retornamos el mensaje de error
                return rejectWithValue({ code: addJustification.code, message: addJustification.message });
            }
            // Si el código es 200, retornamos los datos
            return { ...input, id: addJustification.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateJustification = createAsyncThunk(
    'justification/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_JUSTIFICATION,
                variables: { id, input },
            });
            return data.updateJustification;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteJustification = createAsyncThunk(
    'justification/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_JUSTIFICATION,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const justificationSlice = createSlice({
    name: 'justification',
    initialState: {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
        error: null,
        selectedFiltro: "",
        searchTerm: "",
        itemsPerPage: 6,
        filteredData: [],
    },
    reducers: {
        // Filtros y búsqueda
        setSelectedFiltro: (state, action) => {
            state.selectedFiltro = action.payload;
            state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
        },
        clearFilters: (state) => {
            state.selectedFiltro = "";
            state.searchTerm = "";
            state.filteredData = state.data;
        },
        // Paginación
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
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
        downloadFile: (state, action) => {
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
            .addCase(fetchJustifications.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
                // Aplicar filtros a los nuevos datos
                state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
            })
            .addCase(fetchJustifications.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchJustificationById
            .addCase(fetchJustificationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationById.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchJustificationById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addJustification
            .addCase(addJustification.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
                // Actualizar datos filtrados
                state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
            })
            .addCase(addJustification.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateJustification
            .addCase(updateJustification.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((justification) => justification.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
                // Actualizar datos filtrados
                state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
            })
            .addCase(updateJustification.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteJustification
            .addCase(deleteJustification.fulfilled, (state, action) => {
                state.data = state.data.filter((justification) => justification.id !== action.payload);
                state.error = null;
                // Actualizar datos filtrados
                state.filteredData = filterJustifications(state.data, state.selectedFiltro, state.searchTerm);
            })
            .addCase(deleteJustification.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

// Función helper para filtrar justificaciones
function filterJustifications(data, selectedFiltro, searchTerm) {
    if (!searchTerm || !selectedFiltro) return data;

    return data.filter((j) => {
        switch (selectedFiltro) {
            case "programa":
                return j.programa.toLowerCase().includes(searchTerm.toLowerCase());
            case "ficha":
                return j.ficha.includes(searchTerm);
            case "documento":
                return j.documento.includes(searchTerm);
            case "aprendiz":
                return j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase());
            case "fecha":
                return j.fecha.includes(searchTerm);
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

// Selectores
export const selectJustifications = (state) => state.justification.data;
export const selectFilteredJustifications = (state) => state.justification.filteredData;
export const selectJustificationLoading = (state) => state.justification.loading;
export const selectJustificationError = (state) => state.justification.error;
export const selectCurrentPage = (state) => state.justification.currentPage;
export const selectTotalPages = (state) => state.justification.totalPages;
export const selectTotalItems = (state) => state.justification.totalItems;
export const selectItemsPerPage = (state) => state.justification.itemsPerPage;
export const selectSelectedFiltro = (state) => state.justification.selectedFiltro;
export const selectSearchTerm = (state) => state.justification.searchTerm;

export default justificationSlice.reducer;