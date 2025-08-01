package com.api.aquilesApi.Business;

import java.nio.charset.StandardCharsets;
import java.util.List;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.Evaluations;
    import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Repository.ItemTypeRepository;
import com.api.aquilesApi.Service.ChecklistExportService;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.ChecklistHistoryService; 
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private final ModelMapper modelMapper;
    private final EvaluationsService EvaluationsService;
    private final ChecklistExportService exportService;
    private final ChecklistHistoryService checklistHistoryService;
    private final ItemTypeRepository itemTypeRepository;

    public ChecklistBusiness(
            ChecklistService checklistService,
            JuriesRepository juriesRepository,
            ModelMapper modelMapper,
            EvaluationsService evaluationService,
            ChecklistExportService exportService,
            ChecklistHistoryService checklistHistoryService,
            ItemTypeRepository itemTypeRepository
    ) {
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
        this.EvaluationsService = evaluationService;
        this.exportService = exportService;
        this.checklistHistoryService = checklistHistoryService;
        this.itemTypeRepository = itemTypeRepository;
    }   

    // Find All
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistEntityPage = checklistService.findAll(pageRequest);

            System.out.println("Total Checklist: " + checklistEntityPage.getTotalElements());

            return checklistEntityPage.map(entity -> {
                ChecklistDto dto = modelMapper.map(entity, ChecklistDto.class);
                // Mapeo manual de los campos que pueden no estar mapeándose correctamente
                dto.setTrimester(entity.getTrimester());
                dto.setComponent(entity.getComponent());
                return dto;
            });
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving checklist due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ChecklistDto findById(Long id) {
        try {
            Checklist checklist = checklistService.getById(id);
            ChecklistDto dto = modelMapper.map(checklist, ChecklistDto.class);
            // Mapeo manual de los campos que pueden no estar mapeándose correctamente
            dto.setTrimester(checklist.getTrimester());
            dto.setComponent(checklist.getComponent());
            return dto;
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
            // Paso 1: crear checklist manualmente para evitar problemas con el mapeo de items
            Checklist checklist = new Checklist();
            checklist.setState(checklistDto.getState());
            checklist.setRemarks(checklistDto.getRemarks());
            checklist.setTrimester(checklistDto.getTrimester());
            checklist.setComponent(checklistDto.getComponent());
            checklist.setEvaluationCriteria(checklistDto.isEvaluationCriteria());
            checklist.setStudySheets(checklistDto.getStudySheets());

            // 🔧 Conversión manual del String a byte[] para instructorSignature
            if (checklistDto.getInstructorSignature() != null) {
                checklist.setInstructorSignature(
                    checklistDto.getInstructorSignature().getBytes(java.nio.charset.StandardCharsets.UTF_8)
                );
            }

            // Paso 2: asignar manualmente la entidad Evaluations si se proporciona un ID válido
            if (checklistDto.getEvaluations() != null && checklistDto.getEvaluations() > 0) {
                try {
                    Evaluations eval = EvaluationsService.findEntityById(checklistDto.getEvaluations()); // ✅ devuelve la entidad
                    checklist.setEvaluation(eval);
                    
                } catch (Exception e) {
                    // Si no se encuentra la evaluación, continuar sin asignarla
                    System.out.println("Warning: Evaluation with ID " + checklistDto.getEvaluations() + " not found. Continuing without evaluation.");
                }
            }

            // Paso 3: guardar el checklist primero
            Checklist saved = checklistService.save(checklist);
            
            // Paso 4: crear los items si se proporcionan
            if (checklistDto.getItems() != null && !checklistDto.getItems().isEmpty()) {
                // Obtener o crear un ItemType por defecto para este trimestre
                ItemType defaultItemType = getOrCreateDefaultItemType(saved.getTrimester());
                
                // Inicializar la lista de items si es null
                if (saved.getItems() == null) {
                    saved.setItems(new java.util.ArrayList<>());
                }
                
                for (var itemDto : checklistDto.getItems()) {
                    Item item = new Item();
                    item.setCode(itemDto.getCode());
                    item.setIndicator(itemDto.getIndicator());
                    item.setActive(itemDto.getActive() != null ? itemDto.getActive() : true);
                    item.setChecklist(saved);
                    item.setItemType(defaultItemType);
                    
                    // Agregar el item a la lista del checklist
                    saved.getItems().add(item);
                }
                
                // Volver a guardar para persistir los items
                saved = checklistService.save(saved);
            }
            
            // ⭐ GUARDAR HISTORIAL DE CREACIÓN
            checklistHistoryService.guardarHistorial(
                "Checklist creado", 
                null, 
                saved, 
                "Sistema" // Puedes cambiar esto por el usuario actual
            );
            
            ChecklistDto result = modelMapper.map(saved, ChecklistDto.class);
            // Mapeo manual de los campos que pueden no estar mapeándose correctamente
            result.setTrimester(saved.getTrimester());
            result.setComponent(saved.getComponent());
            return result;
        } catch (Exception e) {
            throw new CustomException("Error creating checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long checklistId, ChecklistDto checklistDto) {
        try {
            // ⭐ OBTENER EL ESTADO ANTES DE LA ACTUALIZACIÓN
            Checklist checklistAntes = checklistService.getById(checklistId);
            
            // Crear una copia del estado anterior para el historial
            Checklist estadoAnterior = new Checklist();
            estadoAnterior.setId(checklistAntes.getId());
            estadoAnterior.setState(checklistAntes.getState());
            estadoAnterior.setRemarks(checklistAntes.getRemarks());
            estadoAnterior.setStudySheets(checklistAntes.getStudySheets());
            estadoAnterior.setEvaluationCriteria(checklistAntes.isEvaluationCriteria());
            estadoAnterior.setInstructorSignature(checklistAntes.getInstructorSignature());
            estadoAnterior.setDateAssigned(checklistAntes.getDateAssigned());
            estadoAnterior.setEvaluation(checklistAntes.getEvaluation());
            estadoAnterior.setLearningOutcome(checklistAntes.getLearningOutcome());

            // Aplicar los cambios
            checklistAntes.setState(checklistDto.getState());
            checklistAntes.setRemarks(checklistDto.getRemarks());
            checklistAntes.setStudySheets(checklistDto.getStudySheets());
            checklistAntes.setEvaluationCriteria(checklistDto.isEvaluationCriteria());

            if (checklistDto.getInstructorSignature() != null) {
                checklistAntes.setInstructorSignature(
                    checklistDto.getInstructorSignature().getBytes(StandardCharsets.UTF_8)
                );
            }

            // ✅ Modificar la evaluación ya existente asociada al checklist
            Evaluations eval = checklistAntes.getEvaluation();
            if (eval != null) {
                eval.setValueJudgment("Nuevo juicio de valor");
                eval.setObservations("Observaciones actualizadas");
                // Modifica aquí lo que necesites
            }

            // Guardar los cambios
            Checklist checklistActualizado = checklistService.save(checklistAntes);

            // ⭐ GUARDAR HISTORIAL DE ACTUALIZACIÓN
            checklistHistoryService.guardarHistorial(
                "Checklist actualizado", 
                estadoAnterior, 
                checklistActualizado, 
                "Sistema" // Puedes cambiar esto por el usuario actual
            );

        } catch (Exception e) {
            throw new CustomException("Error Updating Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            // ⭐ OBTENER EL CHECKLIST ANTES DE ELIMINARLO
            Checklist checklistAntes = checklistService.getById(attendanceId);
            
            // Eliminar el checklist
            checklistService.delete(checklistAntes);
            
            // ⭐ GUARDAR HISTORIAL DE ELIMINACIÓN
            checklistHistoryService.guardarHistorial(
                "Checklist eliminado", 
                checklistAntes, 
                null, 
                "Sistema" // Puedes cambiar esto por el usuario actual
            );
            
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Export documents
    // Export PDF
    public String exportChecklistPdf(Long checklistId) {
        Checklist checklist = checklistService.getById(checklistId);
        return exportService.exportPdfBase64(checklist);
    }

    // Export Excel
    public String exportChecklistExcel(Long checklistId) {
        Checklist checklist = checklistService.getById(checklistId);
        return exportService.exportExcelBase64(checklist);
    }

    // Helper method to get or create default ItemType
    private ItemType getOrCreateDefaultItemType(String trimester) {
        // Intentar obtener un ItemType existente para el trimestre
        List<ItemType> existingTypes = itemTypeRepository.findAll();
        
        // Buscar un ItemType que coincida con el trimestre
        for (ItemType itemType : existingTypes) {
            if (trimester.equals(itemType.getTrimester())) {
                return itemType;
            }
        }
        
        // Si no hay ninguno para este trimestre, crear uno nuevo
        ItemType newItemType = new ItemType();
        newItemType.setName("Default");
        newItemType.setTrimester(trimester);
        return itemTypeRepository.save(newItemType);
    }
}