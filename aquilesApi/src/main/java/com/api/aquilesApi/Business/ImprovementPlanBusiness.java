package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Service.ImprovementPlanService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ImprovementPlanMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.*;
import java.util.Base64;

@Component
public class ImprovementPlanBusiness {
    private final ImprovementPlanService improvementPlanService;

    public ImprovementPlanBusiness(ImprovementPlanService improvementPlanService) {
        this.improvementPlanService = improvementPlanService;
    }

    // Validation object
    private void validationObject(ImprovementPlanDto improvementplanDto) throws CustomException {

    }

    // Get all improvementPlans (Paginated)
    public Page<ImprovementPlanDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findAll(pageRequest);

            System.out.println("Total ImprovementPlans: " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvemenPlan due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvemenPlan.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlan by ID
    public ImprovementPlanDto findById(Long id) {
        try {
            ImprovementPlan improvementPlan = improvementPlanService.getById(id);
            return ImprovementPlanMap.INSTANCE.EntityToDto(improvementPlan);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlan by studentId
    public List<ImprovementPlan> findAllByStudentId(Long id){
        try {
            return improvementPlanService.findAllByStudentId(id);
        } catch (Exception e) {
            throw new CustomException("Error Getting Improvement Plans by Student ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlans by StudentId (Paginated)
    public Page<ImprovementPlanDto> findByStudentId(int page, int size, Long studentId) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            List<ImprovementPlan> improvementPlans = improvementPlanService.findAllByStudentId(studentId);
            
            // Convertir lista a Page manualmente
            int start = (int) pageRequest.getOffset();
            int end = Math.min((start + pageRequest.getPageSize()), improvementPlans.size());
            List<ImprovementPlan> pageContent = improvementPlans.subList(start, end);
            
            Page<ImprovementPlan> improvementPlanPage = new org.springframework.data.domain.PageImpl<>(
                pageContent, pageRequest, improvementPlans.size()
            );

            System.out.println("Total improvementPlans (by studentId): " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvementPlans by studentId due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvementPlans by studentId.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlan by Filter
    public Page<ImprovementPlanDto> findByFilter(int page, int size, Long teacherCompetence) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findByFilter(pageRequest, teacherCompetence);

            System.out.println("Total inprovementPlans: " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvemenPlan by filter due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvemenPlan by filter.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlans by StudySheetId (Ficha)
    // NOTA: Este método está deprecado. El filtrado por ficha ahora se hace
    // obteniendo los teacherCompetenceIds desde Olympo en el Resolver
    // y luego usando findByTeacherCompetenceIds
    @Deprecated
    public Page<ImprovementPlanDto> findByStudySheetId(int page, int size, Long studySheetId) {
        try {
            // Retornar página vacía - el resolver debe usar findByTeacherCompetenceIds
            PageRequest pageRequest = PageRequest.of(page, size);
            return Page.empty(pageRequest);
        } catch (Exception e) {
            throw new CustomException("Method deprecated. Use findByTeacherCompetenceIds instead.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get improvementPlans by list of TeacherCompetence IDs
    public Page<ImprovementPlanDto> findByTeacherCompetenceIds(int page, int size, List<Long> teacherCompetenceIds) {
        try {
            if (teacherCompetenceIds == null || teacherCompetenceIds.isEmpty()) {
                // Si no hay teacherCompetenceIds, retornar página vacía
                return Page.empty(PageRequest.of(page, size));
            }
            
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findByTeacherCompetenceIds(pageRequest, teacherCompetenceIds);

            System.out.println("Total improvementPlans (by teacherCompetenceIds): " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvementPlans by teacherCompetenceIds due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvementPlans by teacherCompetenceIds.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlan by teacherCompetence
    public List<Long> findAllByTeacherCompetence(Long teacherCompetence) {
        try {
            return improvementPlanService.findAllByTeacherCompetence(teacherCompetence);
        } catch (Exception e) {
            throw new CustomException("Error Getting Teacher Competence IDs: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlan by learningOutcome
    public List<ImprovementPlan> findAllByLearningOutcome(Long learningOutcome) {
        try {
            return improvementPlanService.findAllByLearningOutcome(learningOutcome);
        } catch (Exception e) {
            throw new CustomException("Error Getting Improvement Plans by Learning Outcome: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new improvementPlan
    public ImprovementPlanDto add(ImprovementPlanDto improvementplanDto) {
        try {
            // Validar si el estudiante ya tiene un plan activo
            if (improvementplanDto.getStudentId() != null) {
                boolean hasActivePlan = improvementPlanService.existsActivePlanForStudent(improvementplanDto.getStudentId());
                
                if (hasActivePlan) {
                    // Si ya tiene un plan activo, la justificación adicional es OBLIGATORIA
                    if (improvementplanDto.getAdditionalJustification() == null || 
                        improvementplanDto.getAdditionalJustification().trim().isEmpty()) {
                        throw new CustomException(
                            "El aprendiz ya tiene un plan de mejoramiento activo. " +
                            "Debe proporcionar una justificación para crear un nuevo plan.",
                            HttpStatus.BAD_REQUEST
                        );
                    }
                }
            }
            
            // 1. Create and save the initial improvement plan
            ImprovementPlan improvementPlan = new ImprovementPlan();
            ImprovementPlanMap.INSTANCE.updateImprovementPlan(improvementplanDto, improvementPlan);

            // Set default values
            if (improvementPlan.getDate() == null) {
                improvementPlan.setDate(LocalDate.now());
            }
            if (improvementPlan.getState() == null) {
                improvementPlan.setState(true);
            }

            // Initial save - SIN generar PDF automáticamente
            ImprovementPlan savedImprovementPlan = improvementPlanService.save(improvementPlan);
            
            // El archivo será subido posteriormente por el aprendiz
            // No generamos PDF automáticamente

            return ImprovementPlanMap.INSTANCE.EntityToDto(savedImprovementPlan);
        } catch (Exception e) {
            String errorMessage = "Error al crear el Plan de Mejoramiento: " + e.getMessage();
            System.err.println(errorMessage);
            throw new CustomException(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    /* COMENTADO - Ya no generamos PDF automáticamente, el aprendiz sube su archivo
    private byte[] generatePdf(ImprovementPlan improvementPlan) {
        try {
            // Load the JasperReport template
            InputStream jasperStream = new ClassPathResource("Reports/ImprovementPlanFile.jrxml").getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(jasperStream);

            // Create parameters for the report
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("city", improvementPlan.getCity() != null ? improvementPlan.getCity() : "");
            parameters.put("date", improvementPlan.getDate() != null ?
                    improvementPlan.getDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "");
            parameters.put("reason", improvementPlan.getReason() != null ? improvementPlan.getReason() : "");
            parameters.put("studentId", improvementPlan.getStudentId() != null ? improvementPlan.getStudentId().toString() : "");
            parameters.put("competence", improvementPlan.getTeacherCompetence() != null ?
                    improvementPlan.getTeacherCompetence().toString() : "");

            // Create the data source
            List<ImprovementPlan> dataList = Collections.singletonList(improvementPlan);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(dataList);

            // Generate the report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // Export to PDF
            byte[] pdfContent = JasperExportManager.exportReportToPdf(jasperPrint);

            if (pdfContent == null || pdfContent.length == 0) {
                throw new CustomException("El PDF generado está vacío", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return pdfContent;
        } catch (Exception e) {
            throw new CustomException("Error al generar el PDF: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    */

    // Update existing improvementPlan
    public void update(Long improvementPlanId, ImprovementPlanDto improvementplanDto) {
        try {
            improvementplanDto.setId(improvementPlanId);
            ImprovementPlan improvementPlan = improvementPlanService.getById(improvementPlanId);
            
            // Guardar el archivo Base64 antes del mapeo automático
            String base64File = improvementplanDto.getImprovementPlanFile();
            
            // Mapear el resto de campos
            ImprovementPlanMap.INSTANCE.updateImprovementPlan(improvementplanDto, improvementPlan);
            
            // Convertir Base64 (String) a byte[] si está presente
            if (base64File != null && !base64File.isEmpty()) {
                try {
                    byte[] fileBytes = Base64.getDecoder().decode(base64File);
                    improvementPlan.setImprovementPlanFile(fileBytes);
                } catch (IllegalArgumentException e) {
                    throw new CustomException("El archivo no está en formato Base64 válido", HttpStatus.BAD_REQUEST);
                }
            }
            
            improvementPlanService.update(improvementPlan);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete improvementPlan by ID
    public void delete(Long id) {
        try {
            ImprovementPlan improvementPlan = improvementPlanService.getById(id);
            improvementPlanService.delete(improvementPlan);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}