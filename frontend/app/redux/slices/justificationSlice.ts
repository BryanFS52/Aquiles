import { client, clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_JUSTIFICATIONS, GET_JUSTIFICATION_BY_ID, ADD_JUSTIFICATION, UPDATE_JUSTIFICATION, DELETE_JUSTIFICATION } from '@graphql/justificationsGraph'
import { JustificationItem } from '@type/slices/justification'
import { AttendanceItem } from '@type/slices/attendance'
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
export interface TransformedJustificationItem {
    tipoNovedad: ReactNode
    id: number;
    programa: string;
    ficha: string;
    fecha: string;
    estado: string;
    archivoAdjunto: string;
    archivoMime: string;
}

interface FilterOptions {
    selectedFiltro: string;
    searchTerm: string;
}

// Nuevos tipos para el formulario
interface JustificationType {
    id: string;
    name: string;
}

export interface FormDataState {
    justificationTypeId: { id: string };
    numeroDocumento: string;
    nombreAprendiz: string;
    descripcion: string;
    justificacionFile: File | null;
    justificacionFileBase64: string;
    notificationId: string;
}

interface JustificationFormState {
    showForm: boolean;
    isSubmitting: boolean;
    formData: FormDataState;
    validationErrors: string[];
    currentAttendance: AttendanceItem | null;
}

interface JustificationState extends ReturnType<typeof createInitialPaginatedState> {
    data: JustificationItem[];
    transformedData: TransformedJustificationItem[];
    filteredData: TransformedJustificationItem[];
    filterOptions: FilterOptions;
    localCurrentPage: number;
    itemsPerPage: number;
    form: JustificationFormState;
}

// Utilidades existentes
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
        justificationFile: graphqlData.justificationFile,
        state: graphqlData.state,
        justificationType: graphqlData.justificationType
            ? {
                id: graphqlData.justificationType.id,
                name: graphqlData.justificationType.name
            }
            : { id: 0, name: '' },
        attendance: {
            student: {
                id: graphqlData.attendance?.student?.id ?? 0,
                person: {
                    name: graphqlData.attendance?.student?.person?.name ?? '',
                    lastname: graphqlData.attendance?.student?.person?.lastname ?? '',
                    document: graphqlData.attendance?.student?.person?.document ?? ''
                }
            }
        }
    };
};

// Función para transformar datos al formato del componente
const transformToComponentFormat = (justifications: JustificationItem[]): TransformedJustificationItem[] => {
    return justifications.map((j) => {
        const student = j.attendance?.student;
        const person = student?.person;
        const studySheet = student?.studySheet;
        const program = studySheet?.program;

        return {
            id: j.id,
            programa: program?.name || "Sin programa",
            ficha: studySheet?.number?.toString() || "Sin ficha",
            fecha: new Date(j.justificationDate).toLocaleDateString("es-CO"),
            estado: j.state ? "Activo" : "Inactivo",
            archivoAdjunto: j.justificationFile,
            archivoMime: getMimeTypeFromBase64(j.justificationFile),
            documento: person?.document || '',
            aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim()
        };
    });
};


// Función para filtrar datos
const filterJustifications = (
    data: TransformedJustificationItem[],
    filterOptions: FilterOptions
): TransformedJustificationItem[] => {
    const { selectedFiltro, searchTerm } = filterOptions;

    if (!searchTerm) return data;

    if (!selectedFiltro || selectedFiltro === "todo") {
        return data.filter((j) =>
            j.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.ficha.toString().includes(searchTerm) ||
            j.fecha.includes(searchTerm) ||
            j.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return data.filter((j) => {
        switch (selectedFiltro) {
            case "programa":
                return j.programa.toLowerCase().includes(searchTerm.toLowerCase());
            case "ficha":
                return j.ficha.toString().includes(searchTerm);
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

// Nuevas funciones de validación
const validateFormData = (formData: FormDataState): string[] => {
    const errors: string[] = [];
    if (!formData.numeroDocumento.trim()) errors.push("El número de documento es obligatorio");
    if (!formData.nombreAprendiz.trim()) errors.push("El nombre del aprendiz es obligatorio");
    if (!formData.descripcion.trim()) errors.push("La descripción es obligatoria");
    if (!formData.justificationTypeId.id) errors.push("Debe seleccionar un tipo de novedad");
    if (!formData.justificacionFile) errors.push("Debe adjuntar un archivo de justificación");
    return errors;
};

const validateFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
};

const validateFileType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return validTypes.includes(file.type);
};

// Función para limpiar solo caracteres numéricos
const cleanNumericInput = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
};

// Función para limpiar texto con caracteres especiales permitidos
const cleanTextInput = (value: string): string => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
};

// Función para leer archivo como base64
const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
        };
        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };
        reader.readAsDataURL(file);
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
export const fetchJustifications = createAsyncThunk<GetAllJustificationsQuery['allJustifications'], GetAllJustificationsQueryVariables>(
    'justifications/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>({
            query: GET_ALL_JUSTIFICATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allJustifications;
    }
);

export const fetchJustificationById = createAsyncThunk<GetJustificationByIdQuery['justificationById'], GetJustificationByIdQueryVariables>(
    'justifications/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>({
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
            const { data } = await clientLAN.mutate<AddJustificationMutation, AddJustificationMutationVariables>({
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
            const { data } = await clientLAN.mutate<UpdateJustificationMutation, UpdateJustificationMutationVariables>({
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
            const { data } = await clientLAN.mutate<DeleteJustificationMutation, DeleteJustificationMutationVariables>({
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

// Nuevo thunk para procesar archivo
export const processFile = createAsyncThunk<
    { file: File; base64: string },
    File,
    { rejectValue: string }
>(
    'justifications/processFile',
    async (file, { rejectWithValue }) => {
        try {
            // Validar tipo de archivo
            if (!validateFileType(file)) {
                return rejectWithValue('Solo se permiten archivos PDF, JPG o PNG');
            }

            // Validar tamaño de archivo
            if (!validateFileSize(file)) {
                return rejectWithValue('El archivo es demasiado grande. Máximo permitido: 5MB');
            }

            // Leer archivo como base64
            const base64 = await readFileAsBase64(file);

            return { file, base64 };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al procesar el archivo');
        }
    }
);

// Estado inicial con formulario
const initialFormData: FormDataState = {
    justificationTypeId: { id: "" },
    numeroDocumento: "",
    nombreAprendiz: "",
    descripcion: "",
    justificacionFile: null,
    justificacionFileBase64: "",
    notificationId: "123456",
};

const initialState: JustificationState = {
    ...createInitialPaginatedState<JustificationItem>(),
    transformedData: [],
    filteredData: [],
    filterOptions: {
        selectedFiltro: "",
        searchTerm: ""
    },
    localCurrentPage: 0,
    itemsPerPage: 6,
    form: {
        showForm: false,
        isSubmitting: false,
        formData: initialFormData,
        validationErrors: [],
        currentAttendance: null,
    }
};

const justificationSlice = createSlice({
    name: 'justifications',
    initialState,
    reducers: {
        // Reducers existentes para filtros
        setFilterOptions: (state, action: PayloadAction<Partial<FilterOptions>>) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload };
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
        },

        clearFilters: (state) => {
            state.filterOptions = { selectedFiltro: "", searchTerm: "" };
            state.filteredData = state.transformedData;
        },

        setLocalCurrentPage: (state, action: PayloadAction<number>) => {
            state.localCurrentPage = action.payload;
        },

        goToPreviousPage: (state) => {
            state.localCurrentPage = Math.max(state.localCurrentPage - 1, 1);
        },

        goToNextPage: (state) => {
            const maxPages = state.totalPages || 1;
            state.localCurrentPage = Math.min(state.localCurrentPage + 1, maxPages);
        },

        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
        },
        setCurrentAttendance: (state, action: PayloadAction<AttendanceItem>) => {
            state.form.currentAttendance = action.payload;
        },

        // Nuevos reducers para el formulario
        showForm: (state) => {
            state.form.showForm = true;
        },

        hideForm: (state) => {
            state.form.showForm = false;
        },

        resetForm: (state) => {
            state.form.showForm = false;
            state.form.formData = initialFormData;
            state.form.validationErrors = [];
            state.form.isSubmitting = false;
        },

        updateFormField: (state, action: PayloadAction<{ field: keyof FormDataState; value: any }>) => {
            const { field, value } = action.payload;
            (state.form.formData as any)[field] = value;
        },

        updateNumericField: (state, action: PayloadAction<{ field: string; value: string }>) => {
            const { field, value } = action.payload;
            const cleanedValue = cleanNumericInput(value);
            (state.form.formData as any)[field] = cleanedValue;
        },

        updateTextField: (state, action: PayloadAction<{ field: string; value: string }>) => {
            const { field, value } = action.payload;
            const cleanedValue = cleanTextInput(value);
            (state.form.formData as any)[field] = cleanedValue;
        },

        updateJustificationTypeId: (state, action: PayloadAction<string>) => {
            state.form.formData.justificationTypeId.id = action.payload;
        },

        setValidationErrors: (state, action: PayloadAction<string[]>) => {
            state.form.validationErrors = action.payload;
        },

        clearValidationErrors: (state) => {
            state.form.validationErrors = [];
        },

        setSubmitting: (state, action: PayloadAction<boolean>) => {
            state.form.isSubmitting = action.payload;
        },

        validateForm: (state) => {
            state.form.validationErrors = validateFormData(state.form.formData);
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchJustifications - existente
            .addCase(fetchJustifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustifications.fulfilled, (state, action: PayloadAction<GetAllJustificationsQuery['allJustifications']>) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToJustificationItem);

                    state.transformedData = transformToComponentFormat(state.data);
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
            // fetchJustificationById - existente
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
            // addJustification - modificado para resetear formulario
            .addCase(addJustification.pending, (state) => {
                state.form.isSubmitting = true;
                state.form.validationErrors = [];
            })
            .addCase(addJustification.fulfilled, (state, action: PayloadAction<AddJustificationMutation['addJustification']>) => {
                if (action.payload) {
                    const newJustification = transformGraphQLToJustificationItem(action.payload);
                    state.data.push(newJustification);
                    state.transformedData = transformToComponentFormat(state.data);
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);

                    // Resetear formulario después de éxito
                    state.form.showForm = false;
                    state.form.formData = initialFormData;
                    state.form.validationErrors = [];
                }
                state.form.isSubmitting = false;
                state.error = null;
            })
            .addCase(addJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.form.isSubmitting = false;
            })
            // updateJustification - existente
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
            // deleteJustification - existente
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
    setItemsPerPage,
    showForm,
    hideForm,
    resetForm,
    updateFormField,
    updateNumericField,
    updateTextField,
    updateJustificationTypeId,
    setValidationErrors,
    clearValidationErrors,
    setSubmitting,
    validateForm,
    setCurrentAttendance,
} = justificationSlice.actions;

export default justificationSlice.reducer;
