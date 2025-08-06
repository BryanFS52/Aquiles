import { clientLAN } from '@/lib/apollo-client';
import { EXPORT_CHECKLIST_PDF, EXPORT_CHECKLIST_EXCEL } from '@graphql/checklistGraph';

// Función para exportar checklist a PDF
export const exportChecklistToPdf = async (checklistId: number): Promise<string> => {
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
};

// Función para exportar checklist a Excel
export const exportChecklistToExcel = async (checklistId: number): Promise<string> => {
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
};

// Función para descargar archivo desde base64
export const downloadFileFromBase64 = (base64Data: string, fileName: string, mimeType: string): void => {
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
};
