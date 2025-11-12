package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistHistoryDto;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Service.ChecklistHistoryService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class  ChecklistHistoryBusiness {
    private final ChecklistHistoryService checklistHistoryService;
    private final ModelMapper modelMapper;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public ChecklistHistoryBusiness(ChecklistHistoryService checklistHistoryService, ModelMapper modelMapper, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.checklistHistoryService = checklistHistoryService;
        this.modelMapper = modelMapper;
        this.objectMapper = objectMapper;
    }
    // Guardar historial de cambios en checklist
    public void guardarHistorial(String accion, com.api.aquilesApi.Entity.Checklist antes, com.api.aquilesApi.Entity.Checklist despues, String teacher) {
        System.out.println("🟢 Entrando a guardarHistorial() para checklist ID: " +
                ((despues != null) ? despues.getId() : (antes != null) ? antes.getId() : "null"));

        try {
            com.api.aquilesApi.Entity.ChecklistHistory history = new com.api.aquilesApi.Entity.ChecklistHistory();

            Long checklistId = (despues != null) ? despues.getId() : (antes != null) ? antes.getId() : null;

            if (checklistId == null) {
                System.err.println("❌ No se puede guardar historial: checklistId es null");
                return;
            }

            history.setChecklistId(checklistId);
            history.setActions(accion);
            history.setTeacher(teacher);

            if (antes != null) {
                ChecklistHistoryDto dtoAntes = convertir(antes);
                history.setDateBefore(objectMapper.writeValueAsString(dtoAntes));
            }

            if (despues != null) {
                ChecklistHistoryDto dtoDespues = convertir(despues);
                history.setDateAfter(objectMapper.writeValueAsString(dtoDespues));
            }

            checklistHistoryService.add(history);
            System.out.println("✅ Historial guardado para checklist ID: " + checklistId);

        } catch (Exception e) {
            System.err.println("❌ Error guardando historial: " + e.getMessage());
        }
    }

    private ChecklistHistoryDto convertir(com.api.aquilesApi.Entity.Checklist checklist) {
        ChecklistHistoryDto dto = new ChecklistHistoryDto();
        dto.setId(checklist.getId());
        dto.setState(checklist.getState());
        dto.setRemarks(checklist.getRemarks());
        dto.setEvaluationCriteria(checklist.getEvaluationCriteria());
        dto.setDateAssigned(String.valueOf(checklist.getDateAssigned()));
        dto.setStudySheets(checklist.getStudySheets());
        dto.setTrainingProjectId(checklist.getTrainingProjectId());
        // Nota: Ahora checklist tiene múltiples evaluaciones, este campo podría necesitar ajuste
        // Por ahora, dejamos null o se puede ajustar según la lógica de negocio
        dto.setEvaluations(null);
        dto.setLearningOutcome(checklist.getLearningOutcome());
        return dto;
    }
    //validation object


    // Find all
    public Page<ChecklistHistoryDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ChecklistHistory> checklistHistoryPage = checklistHistoryService.findAll(pageRequest);
            return checklistHistoryPage.map(checklistHistory -> modelMapper.map(checklistHistory, ChecklistHistoryDto.class));
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find by id
    public ChecklistHistoryDto findById(Long id) {
        try {
            ChecklistHistory checklistHistory = checklistHistoryService.getById(id);
            return modelMapper.map(checklistHistory, ChecklistHistoryDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history with ID " + id + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ChecklistHistoryDto add(ChecklistHistoryDto checklistHistoryDTO) {
        try {
            ChecklistHistory checklistHistory = modelMapper.map(checklistHistoryDTO, ChecklistHistory.class);
            checklistHistory = checklistHistoryService.add(checklistHistory);
            return modelMapper.map(checklistHistory, ChecklistHistoryDto.class);
        } catch (Exception e) {
            throw new CustomException("Error adding checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update
    public void update(Long ChecklistHistoryId, ChecklistHistoryDto checklistHistoryDTO) {
        try {
            ChecklistHistory checklistHistory = modelMapper.map(checklistHistoryDTO, ChecklistHistory.class);
            checklistHistory.setId(checklistHistory.getId());
            checklistHistoryService.update(checklistHistory);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error updating checklist history with ID " + ChecklistHistoryId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long checklistHistoryId) {
        try {
            ChecklistHistory checklistHistory = checklistHistoryService.getById(checklistHistoryId);
            checklistHistoryService.delete(checklistHistory);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting checklist history with ID " + checklistHistoryId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}