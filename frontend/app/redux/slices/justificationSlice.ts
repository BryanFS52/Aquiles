import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_JUSTIFICATIONS, GET_JUSTIFICATION_BY_ID, GET_JUSTIFICATION_BY_STUDENT_ID, ADD_JUSTIFICATION, UPDATE_JUSTIFICATION, UPDATE_STATUS_IN_JUSTIFICATION, DELETE_JUSTIFICATION } from '@graphql/justificationsGraph'
import { GET_ATTENDANCES_BY_COMPETENCE_QUARTER_AND_JUSTIFICATIONS } from '@graphql/attendancesGraph'
import {
    Attendance,
    Justification,
    GetAllJustificationsQuery,
    GetAllJustificationsQueryVariables,
    GetJustificationByIdQuery,
    GetJustificationByIdQueryVariables,
    GetJustificationByStudentIdQuery,
    GetJustificationByStudentIdQueryVariables,
    AddJustificationMutation,
    AddJustificationMutationVariables,
    UpdateJustificationMutation,
    UpdateJustificationMutationVariables,
    UpdateStatusInJustificationMutation,
    UpdateStatusInJustificationMutationVariables,
    DeleteJustificationMutation,
    DeleteJustificationMutationVariables,
    GetAttendancesByCompetenceQuarterAndJustificationsQuery,
    GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables
} from '@graphql/generated'

export interface MultiFilterState {
    documento: string;
    aprendiz: string;
    justificationStatus: string;
    fecha: string;
    absenceDate: string;
}

interface FilterOptions {
    selectedFiltro: string;
    searchTerm: string;
    multiFilters: MultiFilterState;
    enableMultiFilter: boolean;
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
    currentAttendance: Attendance | null;
}

interface JustificationState extends ReturnType<typeof createInitialPaginatedState> {
    data: Justification[];
    transformedData: Justification[];
    filteredData: Justification[];
    filterOptions: FilterOptions;
    localCurrentPage: number;
    itemsPerPage: number;
    form: JustificationFormState;
    
    competenceQuarterData: any[];
    competenceQuarterFilteredData: any[];
    competenceQuarterFilterOptions: FilterOptions;
    isCompetenceQuarterMode: boolean;
}

const initialFormData: FormDataState = {
    justificationTypeId: { id: "" },
    numeroDocumento: "",
    nombreAprendiz: "",
    descripcion: "",
    justificacionFile: null,
    justificacionFileBase64: "",
    notificationId: "123456",
};

const loadFiltersFromStorage = (): Partial<FilterOptions> => {
    if (typeof window !== 'undefined') {
        try {
            const savedFilters = localStorage.getItem('justification-filters');
            if (savedFilters) {
                return JSON.parse(savedFilters);
            }
        } catch (error) {
            console.error('Error loading filters from localStorage:', error);
        }
    }
    return {};
};

const initialState: JustificationState = {
    ...createInitialPaginatedState<Justification>(),
    transformedData: [],
    filteredData: [],
    filterOptions: {
        selectedFiltro: "",
        searchTerm: "",
        multiFilters: {
            documento: "",
            aprendiz: "",
            justificationStatus: "",
            fecha: "",
            absenceDate: ""
        },
        enableMultiFilter: false,
        ...loadFiltersFromStorage()
    },
    localCurrentPage: 0,
    itemsPerPage: 6,
    form: {
        showForm: false,
        isSubmitting: false,
        formData: initialFormData,
        validationErrors: [],
        currentAttendance: null,
    },
    competenceQuarterData: [],
    competenceQuarterFilteredData: [],
    competenceQuarterFilterOptions: {
        selectedFiltro: "",
        searchTerm: "",
        multiFilters: {
            documento: "",
            aprendiz: "",
            justificationStatus: "",
            fecha: "",
            absenceDate: ""
        },
        enableMultiFilter: false
    },
    isCompetenceQuarterMode: false,
};

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

// Helper para formatear fechas
const formatDateSafely = (dateString: string | null | undefined): string => {
    if (!dateString) return "Sin fecha";
    
    try {
        if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = dateString.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            
            if (isNaN(date.getTime())) return "Fecha inválida";
            
            return date.toLocaleDateString("es-CO", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
        }
        
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            
            if (isNaN(date.getTime())) return "Fecha inválida";
            
            return date.toLocaleDateString("es-CO", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
        }
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Fecha inválida";
        
        return date.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    } catch (error) {
        console.error("Error formateando fecha:", error);
        return "Fecha inválida";
    }
};

const filterJustifications = (
    data: any[],
    filterOptions: FilterOptions
): any[] => {
    const { selectedFiltro, searchTerm, multiFilters, enableMultiFilter } = filterOptions;

    if (enableMultiFilter) {
        return data.filter((j) => {
            const matchesDocumento = !multiFilters.documento || j.documento.includes(multiFilters.documento);
            const matchesAprendiz = !multiFilters.aprendiz || j.aprendiz.toLowerCase().includes(multiFilters.aprendiz.toLowerCase());
            const matchesJustificationStatus = !multiFilters.justificationStatus || j.justificationStatus.toLowerCase().includes(multiFilters.justificationStatus.toLowerCase());
            const matchesFecha = !multiFilters.fecha || j.justificationDate.includes(multiFilters.fecha);
            const matchesAbsenceDate = !multiFilters.absenceDate || j.absenceDate.includes(multiFilters.absenceDate);

            return matchesDocumento && matchesAprendiz && matchesJustificationStatus && matchesFecha && matchesAbsenceDate;
        });
    }

    if (!searchTerm) return data;

    if (!selectedFiltro || selectedFiltro === "todo") {
        return data.filter((j) =>
            j.absenceDate.includes(searchTerm) ||
            j.justificationDate.includes(searchTerm) ||
            j.justificationStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.documento.includes(searchTerm) ||
            j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return data.filter((j) => {
        switch (selectedFiltro) {
            case "absenceDate":
                return j.absenceDate.includes(searchTerm);
            case "justificationDate":
                return j.justificationDate.includes(searchTerm);
            case "justificationStatus":
                return j.justificationStatus.toLowerCase().includes(searchTerm.toLowerCase());
            case "documento":
                return j.documento.includes(searchTerm);
            case "aprendiz":
                return j.aprendiz.toLowerCase().includes(searchTerm.toLowerCase());
            default:
                return true;
        }
    });
};

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
    const maxSize = 5 * 1024 * 1024;
    return file.size <= maxSize;
};

const validateFileType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return validTypes.includes(file.type);
};

const cleanNumericInput = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
};

const cleanTextInput = (value: string): string => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
};

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

export const downloadBase64File = (base64Data: string, fileName: string, mimeType: string = "application/octet-stream") => {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
};

export const generateFileName = (id: number, mimeType: string): string => {
    const extension = getExtensionFromMime(mimeType);
    return `justificacion_${id}.${extension}`;
};

export const formatErrorMessage = (error: any): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'Error desconocido';
};

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

export const fetchJustificationsByStudentId = createAsyncThunk<
    GetJustificationByStudentIdQuery['justificationByStudentId'], 
    GetJustificationByStudentIdQueryVariables
>(
    'justifications/fetchByStudentId',
    async ({ studentId, page, size }) => {
        const { data } = await clientLAN.query<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>({
            query: GET_JUSTIFICATION_BY_STUDENT_ID,
            variables: { studentId, page, size },
            fetchPolicy: 'no-cache',
        });
        return data.justificationByStudentId;
    }
);

// justificaciones por competence quarter
export const fetchJustificationsByCompetenceQuarter = createAsyncThunk<
    any[],
    GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables
>(
    'justifications/fetchByCompetenceQuarter',
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

            const transformedData = cleanData.map((attendance, index) => {
                const justification = attendance.justification;
                const student = attendance.student;
                const person = student?.person;

                if (!justification || !justification.id) {
                    console.warn(`Attendance ${attendance.id} no tiene justificación válida - omitiendo`);
                    return null;
                }

                const statusName = justification?.justificationStatus?.name || 'En proceso';
                const statusId = (justification?.justificationStatus as any)?.id || 
                    (statusName === 'En proceso' ? 'default-en-proceso' : undefined);

                const transformedItem = {
                    id: Number(justification?.id || 0),
                    ficha: attendance.student?.studentStudySheets?.[0]?.studySheet?.number?.toString() || '',
                    absenceDate: justification?.absenceDate || '',
                    justificationDate: justification?.justificationDate || '',
                    estado: statusName,
                    state: true,
                    justificationType: 'Tipo no disponible',
                    archivoAdjunto: justification?.justificationFile || '',
                    archivoMime: '',
                    documento: person?.document || '',
                    aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
                    attendanceId: attendance.id,
                    justificationStatusId: statusId,
                    justificationStatus: statusName
                };
                return transformedItem;
            }).filter(item => item !== null) as any[];
            return transformedData;
        } catch (error) {
            console.error("Error al obtener justificaciones por competence quarter", error);
            return rejectWithValue({ message: (error as Error).message || 'Unknown error' });
        }
    }
);

// addJustification
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

// updateJustification
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

// updateJustificationStatus
export const updateJustificationStatus = createAsyncThunk<
    UpdateStatusInJustificationMutation['updateStatusInJustification'],
    { id: string; statusId: string; statusName?: string },
    { rejectValue: { code: string; message: string } }
>(
    'justifications/updateStatus',
    async ({ id, statusId, statusName }, { rejectWithValue }) => {
        try {
            const justificationId = parseInt(id);
            const justificationStatusId = parseInt(statusId);

            const { data } = await clientLAN.mutate<UpdateStatusInJustificationMutation, UpdateStatusInJustificationMutationVariables>({
                mutation: UPDATE_STATUS_IN_JUSTIFICATION,
                variables: { 
                    id: justificationId, 
                    input: justificationStatusId 
                },
            });

            const res = data?.updateStatusInJustification;
            
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Error al actualizar el estado' });
            }

            return { ...res, statusName };
        } catch (error: any) {
            console.error("Error actualizando estado:", error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

// deleteJustification
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

// processFile
export const processFile = createAsyncThunk<
    { file: File; base64: string },
    File,
    { rejectValue: string }
>(
    'justifications/processFile',
    async (file, { rejectWithValue }) => {
        try {
            if (!validateFileType(file)) {
                return rejectWithValue('Solo se permiten archivos PDF, JPG o PNG');
            }

            if (!validateFileSize(file)) {
                return rejectWithValue('El archivo es demasiado grande. Máximo permitido: 5MB');
            }

            const base64 = await readFileAsBase64(file);

            return { file, base64 };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al procesar el archivo');
        }
    }
);

// guardar filtros en localStorage
const saveFiltersToStorage = (filterOptions: FilterOptions) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('justification-filters', JSON.stringify(filterOptions));
        } catch (error) {
            console.error('Error saving filters to localStorage:', error);
        }
    }
};

const justificationSlice = createSlice({
    name: 'justifications',
    initialState,
    reducers: {
        setFilterOptions: (state, action: PayloadAction<Partial<FilterOptions>>) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload };
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions);
        },

        clearFilters: (state) => {
            state.filterOptions = { 
                selectedFiltro: "", 
                searchTerm: "",
                multiFilters: {
                    documento: "",
                    aprendiz: "",
                    justificationStatus: "",
                    fecha: "",
                    absenceDate: ""
                },
                enableMultiFilter: false
            };
            state.filteredData = state.transformedData;
            saveFiltersToStorage(state.filterOptions);
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
        setCurrentAttendance: (state, action: PayloadAction<Attendance>) => {
            state.form.currentAttendance = action.payload;
        },
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
        },

        markAttendanceAsJustified: (state, action: PayloadAction<string>) => {
            const attendanceId = action.payload;
        },

        toggleMultiFilter: (state) => {
            state.filterOptions.enableMultiFilter = !state.filterOptions.enableMultiFilter;
            if (!state.filterOptions.enableMultiFilter) {
                state.filterOptions.multiFilters = {
                    documento: "",
                    aprendiz: "",
                    justificationStatus: "",
                    fecha: "",
                    absenceDate: ""
                };
            }
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions);
        },

        setMultiFilter: (state, action: PayloadAction<{ field: keyof MultiFilterState; value: string }>) => {
            const { field, value } = action.payload;
            state.filterOptions.multiFilters[field] = value;
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions);
        },

        clearMultiFilters: (state) => {
            state.filterOptions.multiFilters = {
                documento: "",
                aprendiz: "",
                justificationStatus: "",
                fecha: "",
                absenceDate: ""
            };
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions);
        },

        clearSingleMultiFilter: (state, action: PayloadAction<keyof MultiFilterState>) => {
            const field = action.payload;
            state.filterOptions.multiFilters[field] = "";
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions);
        },

        // Acciones competence quarter
        setCompetenceQuarterMode: (state, action: PayloadAction<boolean>) => {
            state.isCompetenceQuarterMode = action.payload;
        },

        setCompetenceQuarterFilterOptions: (state, action: PayloadAction<Partial<FilterOptions>>) => {
            state.competenceQuarterFilterOptions = { ...state.competenceQuarterFilterOptions, ...action.payload };
            state.competenceQuarterFilteredData = filterJustifications(state.competenceQuarterData, state.competenceQuarterFilterOptions);
        },

        setCompetenceQuarterMultiFilter: (state, action: PayloadAction<{ field: keyof MultiFilterState; value: string }>) => {
            const { field, value } = action.payload;
            state.competenceQuarterFilterOptions.multiFilters[field] = value;
            state.competenceQuarterFilteredData = filterJustifications(state.competenceQuarterData, state.competenceQuarterFilterOptions);
        },

        toggleCompetenceQuarterMultiFilter: (state) => {
            state.competenceQuarterFilterOptions.enableMultiFilter = !state.competenceQuarterFilterOptions.enableMultiFilter;
            state.competenceQuarterFilteredData = filterJustifications(state.competenceQuarterData, state.competenceQuarterFilterOptions);
        },

        clearCompetenceQuarterMultiFilters: (state) => {
            state.competenceQuarterFilterOptions.multiFilters = {
                documento: "",
                aprendiz: "",
                justificationStatus: "",
                fecha: "",
                absenceDate: ""
            };
            state.competenceQuarterFilteredData = filterJustifications(state.competenceQuarterData, state.competenceQuarterFilterOptions);
        },

        clearCompetenceQuarterJustifications: (state) => {
            state.competenceQuarterData = [];
            state.competenceQuarterFilteredData = [];
        },
    },
    extraReducers: (builder) => {
      builder
        // fetchJustifications
        .addCase(fetchJustifications.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchJustifications.fulfilled, (state, action: PayloadAction<GetAllJustificationsQuery['allJustifications']>) => {
            if (action.payload?.data) {
                // Filtra nulls y usa los datos directamente
                state.data = action.payload.data
                    .filter((item): item is NonNullable<typeof item> => item !== null) as Justification[];

                // Usa los datos directamente sin transformaciones adicionales
                state.transformedData = state.data as any;
                
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
                state.data = [action.payload as Justification];
                state.transformedData = state.data as any;
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
        // fetchJustificationsByStudentId
        .addCase(fetchJustificationsByStudentId.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchJustificationsByStudentId.fulfilled, (state, action: PayloadAction<GetJustificationByStudentIdQuery['justificationByStudentId']>) => {
            if (action.payload?.data) {
                // Filtra nulls y usa los datos directamente
                state.data = action.payload.data
                    .filter((item): item is NonNullable<typeof item> => item !== null) as Justification[];

                state.transformedData = state.data as any;
                state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                
                state.totalItems = state.data.length;
                state.totalPages = Math.ceil(state.data.length / state.itemsPerPage);
                state.currentPage = 1;
            }
            state.loading = false;
        })
        .addCase(fetchJustificationsByStudentId.rejected, (state, action) => {
            state.error = action.error.message || 'Error fetching justifications by student ID';
            state.loading = false;
        })
        // addJustification
        .addCase(addJustification.pending, (state) => {
            state.form.isSubmitting = true;
            state.form.validationErrors = [];
        })
        .addCase(addJustification.fulfilled, (state, action: PayloadAction<AddJustificationMutation['addJustification']>) => {
            if (action.payload) {
                const newJustification = action.payload as Justification;
                state.data.push(newJustification);
                state.transformedData = state.data as any;
                state.filteredData = filterJustifications(state.transformedData, state.filterOptions);

                state.form.showForm = false;
                state.form.formData = initialFormData;
                state.form.validationErrors = [];
                state.form.currentAttendance = null;
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
        // updateJustification
        .addCase(updateJustification.fulfilled, (state, action: PayloadAction<UpdateJustificationMutation['updateJustification']>) => {
            if (action.payload) {
                const updatedJustification = action.payload as Justification;
                const index = state.data.findIndex((justification: Justification) => justification.id === updatedJustification.id);
                if (index !== -1) {
                    state.data[index] = updatedJustification;
                    state.transformedData = state.data as any;
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
        // updateJustificationStatus
        .addCase(updateJustificationStatus.fulfilled, (state, action) => {
            if (action.meta.arg && action.payload) {
                const { id, statusId, statusName } = action.meta.arg;
                
                const targetId = id.toString();
                
                const justificationIndex = state.data.findIndex(j => j.id.toString() === targetId);
                if (justificationIndex !== -1) {
                    (state.data[justificationIndex] as any).justificationStatus = { 
                        id: statusId,
                        name: statusName || "Estado actualizado"
                    };
                    
                    state.transformedData = state.data as any;
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                }

                const competenceQuarterIndex = state.competenceQuarterData.findIndex((j: any) => j.id.toString() === targetId);
                if (competenceQuarterIndex !== -1) {
                    state.competenceQuarterData[competenceQuarterIndex].estado = statusName || "Estado actualizado";
                    state.competenceQuarterData[competenceQuarterIndex].justificationStatus = statusName || "Estado actualizado";
                    state.competenceQuarterData[competenceQuarterIndex].justificationStatusId = statusId;
                    
                    state.competenceQuarterFilteredData = filterJustifications(state.competenceQuarterData, state.competenceQuarterFilterOptions);
                }
            }
            state.error = null;
        })
        .addCase(updateJustificationStatus.rejected, (state, action) => {
            const payload = action.payload as RejectedPayload;
            const { code, message } = payload || {};
            state.error = { code, message };
        })
        // deleteJustification
        .addCase(deleteJustification.fulfilled, (state, action: PayloadAction<string>) => {
            if (action.payload) {
                state.data = state.data.filter((justification) => justification.id !== String(action.payload));
                state.transformedData = state.data as any;
                state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            }
            state.error = null;
        })
        .addCase(deleteJustification.rejected, (state, action) => {
            const payload = action.payload as RejectedPayload;
            const { code, message } = payload || {};
            state.error = { code, message };
        })
        // fetchJustificationsByCompetenceQuarter - nuevo
        .addCase(fetchJustificationsByCompetenceQuarter.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchJustificationsByCompetenceQuarter.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.competenceQuarterData = action.payload;
            state.competenceQuarterFilteredData = filterJustifications(action.payload, state.competenceQuarterFilterOptions);
            state.loading = false;
            state.error = null;
        })
        .addCase(fetchJustificationsByCompetenceQuarter.rejected, (state, action) => {
            state.loading = false;
            const payload = action.payload as RejectedPayload;
            const { message } = payload || {};
            state.error = { code: '500', message: message || 'Error al cargar justificaciones por competence quarter' };
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
    markAttendanceAsJustified,
    toggleMultiFilter,
    setMultiFilter,
    clearMultiFilters,
    clearSingleMultiFilter,
    setCompetenceQuarterMode,
    setCompetenceQuarterFilterOptions,
    setCompetenceQuarterMultiFilter,
    toggleCompetenceQuarterMultiFilter,
    clearCompetenceQuarterMultiFilters,
    clearCompetenceQuarterJustifications,
} = justificationSlice.actions;

// Service methods integrated for compatibility
interface JustificationFormData {
    numeroDocumento: string;
    nombreAprendiz: string;
    descripcion: string;
    justificationTypeId: number;
    justificacionFile?: File | null;
    notificationId?: number;
}

export const justificationService = {
    getAllJustifications: async (page = 0, size = 10) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_ALL_JUSTIFICATIONS,
                variables: { page, size },
                fetchPolicy: 'network-only',
            });
            return data.allJustifications;
        } catch (error) {
            console.error("Error fetching all justifications:", error);
            throw new Error("Simulated error");
        }
    },

    getJustificationById: async (id: number) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_JUSTIFICATION_BY_ID,
                variables: { id },
                fetchPolicy: 'network-only',
            });
            return data.justificationById;
        } catch (error) {
            console.error("Error fetching justification by id:", error);
            throw error;
        }
    },

    submitJustification: async (formData: JustificationFormData) => {
        try {
            const {
                numeroDocumento,
                nombreAprendiz,
                descripcion,
                justificationTypeId,
                justificacionFile,
                notificationId,
            } = formData;

            // Convierte archivo a Base64
            const toBase64 = (file: File): Promise<string> =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = (error) => reject(error);
                });

            const justificationFileBase64 = justificacionFile
                ? await toBase64(justificacionFile)
                : null;

            const justificationDate = new Date().toISOString();

            const { data } = await clientLAN.mutate({
                mutation: ADD_JUSTIFICATION,
                variables: {
                    input: {
                        documentNumber: numeroDocumento,
                        name: nombreAprendiz,
                        description: descripcion,
                        justificationFile: justificationFileBase64,
                        justificationTypeId,
                        justificationDate,
                        justificationHistory: "tipoNovedad",
                        state: true,
                        notificationId,
                    },
                },
            });

            if (!data?.addJustification?.code) {
                throw new Error("Error adding justification");
            }

            return data.addJustification;
        } catch (error) {
            console.error("Error adding justification:", error);
            throw error;
        }
    },

    updateJustification: async (id: number, formData: JustificationFormData) => {
        try {
            const {
                numeroDocumento,
                nombreAprendiz,
                descripcion,
                justificationTypeId,
                justificacionFile,
                notificationId,
            } = formData;

            // Convierte archivo a Base64 solo si hay archivo nuevo
            const toBase64 = (file: File): Promise<string> =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = (error) => reject(error);
                });

            const justificationFileBase64 = justificacionFile
                ? await toBase64(justificacionFile)
                : null;

            const justificationDate = new Date().toISOString();

            const { data } = await clientLAN.mutate({
                mutation: UPDATE_JUSTIFICATION,
                variables: {
                    id,
                    input: {
                        documentNumber: numeroDocumento,
                        name: nombreAprendiz,
                        description: descripcion,
                        justificationFile: justificationFileBase64,
                        justificationTypeId,
                        justificationDate,
                        justificationHistory: "tipoNovedad",
                        state: true,
                        notificationId,
                    },
                },
            });

            if (!data?.updateJustification?.code) {
                throw new Error("Error updating justification");
            }

            return data.updateJustification;
        } catch (error) {
            console.error("Error updating justification:", error);
            throw error;
        }
    },

    deleteJustification: async (id: number) => {
        try {
            const { data } = await clientLAN.mutate({
                mutation: DELETE_JUSTIFICATION,
                variables: { id },
            });

            if (!data?.deleteJustification?.code) {
                throw new Error("Error deleting justification");
            }

            return data.deleteJustification;
        } catch (error) {
            console.error("Error deleting justification:", error);
            throw error;
        }
    },
};

export default justificationSlice.reducer;