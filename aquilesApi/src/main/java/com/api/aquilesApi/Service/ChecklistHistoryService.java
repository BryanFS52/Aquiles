package com.api.aquilesApi.Service;

import com.api.aquilesApi.Dto.ChecklistHistoryDTO;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Repository.ChecklistHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ChecklistHistoryService {

    private final ChecklistHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    public ChecklistHistoryService(ChecklistHistoryRepository historyRepository, ObjectMapper objectMapper, ModelMapper modelMapper) {
        this.historyRepository = historyRepository;
        this.objectMapper = objectMapper;
        this.modelMapper = modelMapper;
    }

    public Page<ChecklistHistory> findAll(Pageable pageable) {
        return historyRepository.findAll(pageable);
    }

    public ChecklistHistory getById(Long id) {
        return historyRepository.findById(id).orElseThrow(() -> new RuntimeException("No existe historial con ID: " + id));
    }

    public ChecklistHistory add(ChecklistHistory checklistHistory) {
        return historyRepository.save(checklistHistory);
    }

    public void update(ChecklistHistory checklistHistory) {
        if (!historyRepository.existsById(checklistHistory.getId())) {
            throw new RuntimeException("No se encontró historial con ID: " + checklistHistory.getId());
        }
        historyRepository.save(checklistHistory);
    }

    public void delete(ChecklistHistory checklistHistory) {
        historyRepository.delete(checklistHistory);
    }

    public List<ChecklistHistory> findByChecklistId(Long checklistId) {
        return historyRepository.findByChecklistId(checklistId);
    }

    public void guardarHistorial(String accion, Checklist antes, Checklist despues, String teacher) {
        System.out.println("🟢 Entrando a guardarHistorial() para checklist ID: " +
                ((despues != null) ? despues.getId() : (antes != null) ? antes.getId() : "null"));

        try {
            ChecklistHistory history = new ChecklistHistory();

            Long checklistId = (despues != null) ? despues.getId() : (antes != null) ? antes.getId() : null;

            if (checklistId == null) {
                System.err.println("❌ No se puede guardar historial: checklistId es null");
                return;
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

            historyRepository.save(history);
            System.out.println("✅ Historial guardado para checklist ID: " + checklistId);

        } catch (Exception e) {
            System.err.println("❌ Error guardando historial: " + e.getMessage());
        }
    }

    private ChecklistHistoryDTO convertir(Checklist checklist) {
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
    }
}
