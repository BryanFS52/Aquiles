
package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistHistoryDTO;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Service.ChecklistHistoryService;
import com.api.aquilesApi.Utilities.CustomException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ChecklistHistoryBusiness {
    
    private final ChecklistHistoryService checklistHistoryService;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    public ChecklistHistoryBusiness(ChecklistHistoryService checklistHistoryService, 
                                  ModelMapper modelMapper, 
                                  ObjectMapper objectMapper) {
        this.checklistHistoryService = checklistHistoryService;
        this.modelMapper = modelMapper;
        this.objectMapper = objectMapper;
    }


    //findAll
    public Page<ChecklistHistoryDTO> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ChecklistHistory> checklistHistoryPage = checklistHistoryService.findAll(pageRequest);
            return checklistHistoryPage.map(checklistHistory -> modelMapper.map(checklistHistory, ChecklistHistoryDTO.class));
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //findById
    public ChecklistHistoryDTO findById(Long id) {
        try {
            ChecklistHistory checklistHistory = checklistHistoryService.getById(id);
            return modelMapper.map(checklistHistory, ChecklistHistoryDTO.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history with ID " + id + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    //add
    public ChecklistHistoryDTO add(ChecklistHistoryDTO checklistHistoryDTO) {
        try {
            ChecklistHistory checklistHistory = modelMapper.map(checklistHistoryDTO, ChecklistHistory.class);
            checklistHistory = checklistHistoryService.add(checklistHistory);
            return modelMapper.map(checklistHistory, ChecklistHistoryDTO.class);
        } catch (Exception e) {
            throw new CustomException("Error adding checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //Update
    public void update(Long ChecklistHistoryId, ChecklistHistoryDTO checklistHistoryDTO) {
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


    //Delete
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

    // ========================================
    // NUEVOS MÉTODOS MIGRADOS DESDE SERVICE
    // ========================================

    public List<ChecklistHistoryDTO> findByChecklistId(Long checklistId) {
        try {
            List<ChecklistHistory> historyList = checklistHistoryService.findByChecklistId(checklistId);
            return historyList.stream()
                    .map(history -> modelMapper.map(history, ChecklistHistoryDTO.class))
                    .toList();
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void guardarHistorial(String accion, Checklist antes, Checklist despues, String teacher) {
        System.out.println("🟢 Entrando a guardarHistorial() para checklist ID: " +
                ((despues != null) ? despues.getId() : (antes != null) ? antes.getId() : "null"));

        try {
            ChecklistHistory history = new ChecklistHistory();

            Long checklistId = (despues != null) ? despues.getId() : (antes != null) ? antes.getId() : null;

            if (checklistId == null) {
                System.err.println("❌ No se puede guardar historial: checklistId es null");
                throw new CustomException("No se puede guardar historial: checklistId es null", HttpStatus.BAD_REQUEST);
            }

            history.setChecklistId(checklistId);
            history.setActions(accion);
            history.setTeacher(teacher);

            if (antes != null) {
                ChecklistHistoryDTO dtoAntes = convertir(antes);
                history.setDateBefore(objectMapper.writeValueAsString(dtoAntes));
            }

            if (despues != null) {
                ChecklistHistoryDTO dtoDespues = convertir(despues);
                history.setDateAfter(objectMapper.writeValueAsString(dtoDespues));
            }

            checklistHistoryService.save(history);
            System.out.println("✅ Historial guardado para checklist ID: " + checklistId);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("❌ Error guardando historial: " + e.getMessage());
            throw new CustomException("Error guardando historial: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ========================================
    // MÉTODO PRIVADO DE CONVERSIÓN
    // ========================================

    private ChecklistHistoryDTO convertir(Checklist checklist) {
        try {
            ChecklistHistoryDTO dto = new ChecklistHistoryDTO();
            dto.setId(checklist.getId());
            dto.setState(checklist.getState());
            dto.setRemarks(checklist.getRemarks());
            dto.setEvaluationCriteria(checklist.isEvaluationCriteria());
            dto.setDateAssigned(checklist.getDateAssigned());
            dto.setStudySheets(checklist.getStudySheets());
            dto.setEvaluations(checklist.getEvaluations());
            dto.setLearningOutcome(checklist.getLearningOutcome());
            return dto;
        } catch (Exception e) {
            throw new CustomException("Error convirtiendo Checklist a DTO: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}