import studySheetService from './olympo/studySheetService';
import trainingProjectService from './olympo/trainingProjectService';

/**
 * Servicio para enriquecer los datos de checklists con información de proyectos formativos y fichas
 */
export const checklistEnhancementService = {
  /**
   * Obtiene los nombres de las fichas basado en sus IDs
   */
  async getStudySheetNames(studySheetIds: string[]): Promise<{ [id: string]: string }> {
    try {
      const sheetNames: { [id: string]: string } = {};
      
      // Obtener todas las fichas disponibles
      const response = await studySheetService.getStudySheets({ size: 1000 });
      
      if (response?.data) {
        for (const sheet of response.data) {
          if (studySheetIds.includes(sheet.id.toString())) {
            sheetNames[sheet.id.toString()] = `Ficha ${sheet.number} - ${sheet.journey?.name || 'Sin jornada'}`;
          }
        }
      }
      
      return sheetNames;
    } catch (error) {
      console.error('Error getting study sheet names:', error);
      return {};
    }
  },

  /**
   * Obtiene el nombre del proyecto formativo basado en su ID
   */
  async getTrainingProjectName(projectId: number): Promise<string> {
    try {
      const response = await trainingProjectService.getTrainingProjectById(projectId);
      return response?.data?.name || `Proyecto ${projectId}`;
    } catch (error) {
      console.error('Error getting training project name:', error);
      return `Proyecto ${projectId}`;
    }
  },

  /**
   * Enriquece una lista de checklists con información adicional de proyectos y fichas
   */
  async enrichChecklists(checklists: any[]): Promise<any[]> {
    try {
      const enrichedChecklists = await Promise.all(
        checklists.map(async (checklist) => {
          const enriched = { ...checklist };
          
          // Solo enriquecer con nombre del proyecto formativo si no existe ya
          if (checklist.trainingProjectId && !checklist.trainingProjectName) {
            try {
              enriched.trainingProjectName = await this.getTrainingProjectName(checklist.trainingProjectId);
            } catch (error) {
              console.warn('Could not fetch training project name for ID:', checklist.trainingProjectId);
              enriched.trainingProjectName = `Proyecto ${checklist.trainingProjectId}`;
            }
          }
          
          // Enriquecer con nombres de fichas si existen
          if (checklist.studySheets && typeof checklist.studySheets === 'string') {
            const sheetIds = checklist.studySheets.split(',').filter((id: string) => id.trim());
            if (sheetIds.length > 0) {
              try {
                const sheetNames = await this.getStudySheetNames(sheetIds);
                enriched.studySheetNames = sheetNames;
                enriched.formattedStudySheets = Object.values(sheetNames).join(', ');
              } catch (error) {
                console.warn('Could not fetch study sheet names for IDs:', sheetIds);
                enriched.formattedStudySheets = `Fichas: ${sheetIds.join(', ')}`;
              }
            }
          }
          
          return enriched;
        })
      );
      
      return enrichedChecklists;
    } catch (error) {
      console.error('Error enriching checklists:', error);
      return checklists; // Devolver los checklists originales si hay error
    }
  }
};

export default checklistEnhancementService;
