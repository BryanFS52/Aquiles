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

// Tipos para el estado extendido
export interface TransformedJustificationItem {
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

// Nueva interfaz para multi-filtros
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
    // Multi-filtros
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
    transformedData: TransformedJustificationItem[];
    filteredData: TransformedJustificationItem[];
    filterOptions: FilterOptions;
    localCurrentPage: number;
    itemsPerPage: number;
    form: JustificationFormState;
    // Datos para vista de instructor (competence quarter)
    competenceQuarterData: TransformedJustificationItem[];
    competenceQuarterFilteredData: TransformedJustificationItem[];
    competenceQuarterFilterOptions: FilterOptions;
    isCompetenceQuarterMode: boolean;
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

// Función para transformar datos de GraphQL a Justification
const transformGraphQLToJustificationItem = (graphqlData: any): Justification => {
    return {
        id: graphqlData.justificationId || graphqlData.id,
        description: graphqlData.description,
        absenceDate: graphqlData.absenceDate,
        justificationDate: graphqlData.justificationDate,
        justificationFile: graphqlData.justificationFile,
        state: graphqlData.state,
        justificationType: graphqlData.justificationType
            ? {
                id: graphqlData.justificationType.id,
                name: graphqlData.justificationType.name
            }
            : { id: 0, name: '' },
        justificationStatus: graphqlData.justificationStatus
            ? {
                id: graphqlData.justificationStatus.id,
                name: graphqlData.justificationStatus.name
            }
            : { id: 0, name: '' },
        attendance: {
            id: graphqlData.attendance?.id ?? 0,
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

// Función helper para formatear fechas de forma segura
const formatDateSafely = (dateString: string | null | undefined): string => {
    if (!dateString) return "Sin fecha";
    
    try {
        // Si viene en formato DD/MM/YYYY (desde GraphQL formateado)
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
        
        // Si viene en formato YYYY-MM-DD
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
        
        // Si viene en formato ISO completo
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

// Función para convertir fecha del formato de UI (DD/MM/YYYY) al formato del backend (YYYY-MM-DD)
const convertDateToBackendFormat = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    
    try {
        // Si ya está en formato YYYY-MM-DD, devolverla tal como está
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        
        // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
        if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = dateString.split('/').map(Number);
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
        
        // Si es cualquier otro formato, intentar parsearlo como Date y convertir
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Error convirtiendo fecha al formato del backend:", error);
        return "";
    }
};

// Función para transformar datos al formato del componente
const transformToComponentFormat = (justifications: Justification[]): TransformedJustificationItem[] => {
    return justifications.map((j) => {
        const student = j.attendance?.student;
        const person = student?.person;
        const studySheet = student?.studentStudySheets?.[0];

        // console.log("🔍 Transformando justificación:", {
        //     justificationId: j.id,
        //     attendanceId: j.attendance?.id,
        //     absenceDate: j.absenceDate,
        //     justificationDate: j.justificationDate,
        //     justificationStatus: j.justificationStatus,
        //     state: j.state
        // });

        const booleanState = Boolean(j.state);
        
        let estadoDisplay = "En proceso";
        let justificationStatusId = undefined;
        
        if ((j as any).justificationStatus) {
            estadoDisplay = (j as any).justificationStatus.name || "En proceso";
            justificationStatusId = (j as any).justificationStatus.id?.toString();
        } else {
            estadoDisplay = "En proceso";
        }
        
        return {
            id: Number(j.id),
            ficha: studySheet?.studentStudySheetState?.toString() || "Sin ficha",
            absenceDate: formatDateSafely(j.absenceDate),
            justificationDate: formatDateSafely(j.justificationDate),
            estado: estadoDisplay,  
            state: booleanState, 
            justificationType: j.justificationType?.name ?? "Sin tipo",
            archivoAdjunto: j.justificationFile ?? "",
            archivoMime: getMimeTypeFromBase64(j.justificationFile ?? ""),
            documento: person?.document || '',
            aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
            attendanceId: j.attendance?.id?.toString(),
            justificationStatusId: justificationStatusId,
            justificationStatus: estadoDisplay
        };
    });
};


// Función para filtrar datos con soporte multi-filtro
const filterJustifications = (
    data: TransformedJustificationItem[],
    filterOptions: FilterOptions
): TransformedJustificationItem[] => {
    const { selectedFiltro, searchTerm, multiFilters, enableMultiFilter } = filterOptions;

    // Si los multi-filtros están habilitados, usar esa lógica
    if (enableMultiFilter) {
        return data.filter((j) => {
            // Verificar cada filtro solo si tiene valor
            const matchesDocumento = !multiFilters.documento || j.documento.includes(multiFilters.documento);
            const matchesAprendiz = !multiFilters.aprendiz || j.aprendiz.toLowerCase().includes(multiFilters.aprendiz.toLowerCase());
            const matchesJustificationStatus = !multiFilters.justificationStatus || j.justificationStatus.toLowerCase().includes(multiFilters.justificationStatus.toLowerCase());
            const matchesFecha = !multiFilters.fecha || j.justificationDate.includes(multiFilters.fecha);
            const matchesAbsenceDate = !multiFilters.absenceDate || j.absenceDate.includes(multiFilters.absenceDate);

            // Todos los filtros activos deben coincidir (AND lógico)
            return matchesDocumento && matchesAprendiz && matchesJustificationStatus && matchesFecha && matchesAbsenceDate;
        });
    }

    // Lógica de filtrado simple existente (fallback)
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

// Nueva función para justificaciones por competence quarter (para instructores)
export const fetchJustificationsByCompetenceQuarter = createAsyncThunk<
    TransformedJustificationItem[],
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
            
            // Transformar los datos para vista de instructor (sin ficha ni programa)
            return cleanData.map((attendance) => {
                const justification = attendance.justification;
                const student = attendance.student;
                const person = student?.person;

                return {
                    id: Number(justification?.id || 0),
                    ficha: '', // Vacío para instructores
                    absenceDate: justification?.absenceDate || '',
                    justificationDate: justification?.justificationDate || '',
                    estado: justification?.justificationStatus?.name || 'En proceso',
                    state: true,
                    justificationType: 'Tipo no disponible',
                    archivoAdjunto: justification?.justificationFile || '',
                    archivoMime: '',
                    documento: person?.document || '',
                    aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
                    attendanceId: attendance.id,
                    justificationStatusId: undefined,
                    justificationStatus: justification?.justificationStatus?.name || 'En proceso'
                };
            });
        } catch (error) {
            console.error("Error al obtener justificaciones por competence quarter", error);
            return rejectWithValue({ message: (error as Error).message || 'Unknown error' });
        }
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

// Nueva función para cambiar el estado de una justificación
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

            // console.log("🔄 Actualizando justificationStatus con nueva mutation:", {
            //     id: justificationId,
            //     statusId: justificationStatusId,
            //     statusName: statusName,
            //     mutation: "UPDATE_STATUS_IN_JUSTIFICATION"
            // });

            const { data } = await clientLAN.mutate<UpdateStatusInJustificationMutation, UpdateStatusInJustificationMutationVariables>({
                mutation: UPDATE_STATUS_IN_JUSTIFICATION,
                variables: { 
                    id: justificationId, 
                    input: justificationStatusId 
                },
            });

            const res = data?.updateStatusInJustification;
            // console.log("📋 Respuesta del backend:", res);
            
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Error al actualizar el estado' });
            }

            // Retornar el resultado con el statusName incluido
            return { ...res, statusName };
        } catch (error: any) {
            console.error("❌ Error actualizando estado:", error);
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

// Función para cargar filtros desde localStorage
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

// Función para guardar filtros en localStorage
const saveFiltersToStorage = (filterOptions: FilterOptions) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('justification-filters', JSON.stringify(filterOptions));
        } catch (error) {
            console.error('Error saving filters to localStorage:', error);
        }
    }
};

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
        ...loadFiltersFromStorage() // Cargar filtros guardados
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
    // Datos para vista de instructor (competence quarter)
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

const justificationSlice = createSlice({
    name: 'justifications',
    initialState,
    reducers: {
        // Reducers existentes para filtros
        setFilterOptions: (state, action: PayloadAction<Partial<FilterOptions>>) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload };
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions); // Persistir cambios
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
            saveFiltersToStorage(state.filterOptions); // Persistir cambios
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
        },

        // ✅ Nuevo reducer para manejar la actualización de asistencias
        markAttendanceAsJustified: (state, action: PayloadAction<string>) => {
            const attendanceId = action.payload;
            // Aquí podrías agregar lógica adicional si necesitas
            // console.log(`✅ Asistencia ${attendanceId} marcada como justificada`);
        },

        // 🆕 Nuevas acciones para multi-filtros
        toggleMultiFilter: (state) => {
            state.filterOptions.enableMultiFilter = !state.filterOptions.enableMultiFilter;
            // Si se desactiva multi-filtro, limpiar todos los filtros múltiples
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
            saveFiltersToStorage(state.filterOptions); // Persistir cambios
        },

        setMultiFilter: (state, action: PayloadAction<{ field: keyof MultiFilterState; value: string }>) => {
            const { field, value } = action.payload;
            state.filterOptions.multiFilters[field] = value;
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions); // Persistir cambios
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
            saveFiltersToStorage(state.filterOptions); // Persistir cambios
        },

        clearSingleMultiFilter: (state, action: PayloadAction<keyof MultiFilterState>) => {
            const field = action.payload;
            state.filterOptions.multiFilters[field] = "";
            state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
            saveFiltersToStorage(state.filterOptions); // Persistir cambios
        },

        // Acciones para competence quarter (instructor)
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
            // fetchJustifications - existente
            .addCase(fetchJustifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustifications.fulfilled, (state, action: PayloadAction<GetAllJustificationsQuery['allJustifications']>) => {
                if (action.payload?.data) {
                    // console.log("📥 Datos recibidos del backend:", action.payload.data);
                    
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToJustificationItem);

                    // console.log("🔄 Datos transformados:", state.data);

                    state.transformedData = transformToComponentFormat(state.data);
                    // console.log("📊 Datos para componente:", state.transformedData);
                    
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
            // fetchJustificationsByStudentId - nuevo
            .addCase(fetchJustificationsByStudentId.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustificationsByStudentId.fulfilled, (state, action: PayloadAction<GetJustificationByStudentIdQuery['justificationByStudentId']>) => {
                if (action.payload?.data) {
                    // console.log("📥 Datos recibidos por estudiante:", action.payload.data);
                    
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToJustificationItem);

                    state.transformedData = transformToComponentFormat(state.data);
                    state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                    
                    // Actualizar información de paginación basada en los datos recibidos
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
            // addJustification - modificado para manejar la actualización
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

                    // ✅ Resetear formulario después de éxito
                    state.form.showForm = false;
                    state.form.formData = initialFormData;
                    state.form.validationErrors = [];
                    state.form.currentAttendance = null; // Limpiar la asistencia actual
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
                    const index = state.data.findIndex((justification: Justification) => justification.id === updatedJustification.id);
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
            // updateJustificationStatus - actualizado para nueva mutation
            .addCase(updateJustificationStatus.fulfilled, (state, action) => {
                // Actualizar el estado local inmediatamente
                if (action.meta.arg && action.payload) {
                    const { id, statusId, statusName } = action.meta.arg;
                    
                    // Convertir ambos IDs a string para comparación consistente
                    const targetId = id.toString();
                    
                    // ✅ Actualizar en state.data para coordinadores
                    const justificationIndex = state.data.findIndex(j => j.id.toString() === targetId);
                    if (justificationIndex !== -1) {
                        // Actualizar la relación justificationStatus con id y name real
                        (state.data[justificationIndex] as any).justificationStatus = { 
                            id: statusId,
                            name: statusName || "Estado actualizado"
                        };
                        
                        // Regenerar transformedData y filteredData para coordinadores
                        state.transformedData = transformToComponentFormat(state.data);
                        state.filteredData = filterJustifications(state.transformedData, state.filterOptions);
                    }

                    // ✅ NUEVO: Actualizar también en competenceQuarterData para instructores
                    const competenceQuarterIndex = state.competenceQuarterData.findIndex(j => j.id.toString() === targetId);
                    if (competenceQuarterIndex !== -1) {
                        // Actualizar directamente los campos en el objeto transformado
                        state.competenceQuarterData[competenceQuarterIndex].estado = statusName || "Estado actualizado";
                        state.competenceQuarterData[competenceQuarterIndex].justificationStatus = statusName || "Estado actualizado";
                        state.competenceQuarterData[competenceQuarterIndex].justificationStatusId = statusId;
                        
                        // Regenerar filteredData para instructores
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
            // deleteJustification - existente
            .addCase(deleteJustification.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((justification) => justification.id !== String(action.payload));
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
            // fetchJustificationsByCompetenceQuarter - nuevo
            .addCase(fetchJustificationsByCompetenceQuarter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationsByCompetenceQuarter.fulfilled, (state, action: PayloadAction<TransformedJustificationItem[]>) => {
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
    // Nuevas acciones para competence quarter
    setCompetenceQuarterMode,
    setCompetenceQuarterFilterOptions,
    setCompetenceQuarterMultiFilter,
    toggleCompetenceQuarterMultiFilter,
    clearCompetenceQuarterMultiFilters,
    clearCompetenceQuarterJustifications,
} = justificationSlice.actions;

export default justificationSlice.reducer;