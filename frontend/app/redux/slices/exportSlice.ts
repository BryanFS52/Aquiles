import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { clientLAN } from '@lib/apollo-client';
import { EXPORT_CHECKLIST_PDF, EXPORT_CHECKLIST_EXCEL } from '@graphql/checklistGraph';

// Service methods integrated into slice
const exportService = {
    exportChecklistToPdf: async (checklistId: number): Promise<string> => {
        try {
            console.log('Exporting checklist to PDF, ID:', checklistId);
            
            const { data } = await clientLAN.query({
                query: EXPORT_CHECKLIST_PDF,
                variables: { id: checklistId },
                fetchPolicy: 'no-cache',
            });
            
            console.log('PDF export response:', data);
            
            if (data && data.exportChecklistToPdf) {
                return data.exportChecklistToPdf;
            } else {
                throw new Error('No se pudo obtener el PDF del servidor');
            }
        } catch (error) {
            console.error('Error exporting checklist to PDF:', error);
            throw error;
        }
    },

    exportChecklistToExcel: async (checklistId: number): Promise<string> => {
        try {
            console.log('Exporting checklist to Excel, ID:', checklistId);
            
            const { data } = await clientLAN.query({
                query: EXPORT_CHECKLIST_EXCEL,
                variables: { id: checklistId },
                fetchPolicy: 'no-cache',
            });
            
            console.log('Excel export response:', data);
            
            if (data && data.exportChecklistToExcel) {
                return data.exportChecklistToExcel;
            } else {
                throw new Error('No se pudo obtener el Excel del servidor');
            }
        } catch (error) {
            console.error('Error exporting checklist to Excel:', error);
            throw error;
        }
    },

    downloadFileFromBase64: (base64Data: string, fileName: string, mimeType: string): void => {
        try {
            // Crear blob desde base64
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            
            // Crear URL y descargar
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log('File downloaded successfully:', fileName);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    },
};

// Async thunks
export const exportChecklistToPdf = createAsyncThunk(
    'export/checklistToPdf',
    async (checklistId: number) => {
        const { data } = await clientLAN.query({
            query: EXPORT_CHECKLIST_PDF,
            variables: { id: checklistId },
            fetchPolicy: 'no-cache',
        });
        
        if (data && data.exportChecklistToPdf) {
            return data.exportChecklistToPdf;
        } else {
            throw new Error('No se pudo obtener el PDF del servidor');
        }
    }
);

export const exportChecklistToExcel = createAsyncThunk(
    'export/checklistToExcel',
    async (checklistId: number) => {
        const { data } = await clientLAN.query({
            query: EXPORT_CHECKLIST_EXCEL,
            variables: { id: checklistId },
            fetchPolicy: 'no-cache',
        });
        
        if (data && data.exportChecklistToExcel) {
            return data.exportChecklistToExcel;
        } else {
            throw new Error('No se pudo obtener el Excel del servidor');
        }
    }
);

interface ExportState extends ReturnType<typeof createInitialPaginatedState> {
    pdfData: string | null;
    excelData: string | null;
    downloadHistory: Array<{
        fileName: string;
        type: 'pdf' | 'excel';
        timestamp: string;
    }>;
}

const initialState: ExportState = {
    ...createInitialPaginatedState(),
    pdfData: null,
    excelData: null,
    downloadHistory: [],
};

const exportSlice = createSlice({
    name: 'export',
    initialState,
    reducers: {
        clearExportData: (state) => {
            state.pdfData = null;
            state.excelData = null;
            state.loading = false;
            state.error = null;
        },
        addToDownloadHistory: (state, action) => {
            state.downloadHistory.push({
                ...action.payload,
                timestamp: new Date().toISOString()
            });
        }
    },
    extraReducers: (builder) => {
        builder
            // Export to PDF
            .addCase(exportChecklistToPdf.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(exportChecklistToPdf.fulfilled, (state, action) => {
                state.pdfData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(exportChecklistToPdf.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error exporting to PDF';
                state.loading = false;
            })
            // Export to Excel
            .addCase(exportChecklistToExcel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(exportChecklistToExcel.fulfilled, (state, action) => {
                state.excelData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(exportChecklistToExcel.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error exporting to Excel';
                state.loading = false;
            });
    }
});

export const { clearExportData, addToDownloadHistory } = exportSlice.actions;

// Export service methods for compatibility
export { exportService };

// Export individual functions for backward compatibility
export const { downloadFileFromBase64 } = exportService;

// PDF report download function
export const downloadReportPDF = async (): Promise<Blob> => {
    try {
        // This function should return a PDF blob for report download
        // Implementation depends on your specific requirements
        const response = await fetch('/api/reports/pdf', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to download PDF report');
        }
        
        return await response.blob();
    } catch (error) {
        console.error('Error downloading PDF report:', error);
        throw error;
    }
};

export default exportSlice.reducer;
