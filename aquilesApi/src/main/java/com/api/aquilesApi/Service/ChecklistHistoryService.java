package com.api.aquilesApi.Service;

import com.api.aquilesApi.Dto.ChecklistHistoryDTO;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Repository.ChecklistHistoryRepository;
import com.api.aquilesApi.Entity.Checklist;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChecklistHistoryService {

    @Autowired
    private ChecklistHistoryRepository historyRepository;

    @Autowired
    private ObjectMapper objectMapper;


    
    public void guardarHistorial(String accion, Checklist antes, Checklist despues, String teacher) {

        System.out.println("🟢 Entrando a guardarHistorial() para checklist ID: " + 
    ((despues != null) ? despues.getId() : (antes != null) ? antes.getId() : "null"));

        try {
            ChecklistHistory history = new ChecklistHistory();

            // Obtener el ID de la checklist
            Long checklistId = (despues != null) ? despues.getId() : (antes != null) ? antes.getId() : null;

            if (checklistId == null) {
                System.err.println("❌ No se puede guardar historial: checklistId es null");
                return;
            }

            // Asignar datos
            history.setChecklistId(checklistId);
            history.setActions(accion);
            history.setTeacher(teacher);

            // Guardar estado anterior y posterior si existen
            if (antes != null) {
                ChecklistHistoryDTO dtoAntes = convertir(antes);
                history.setDateBefore(objectMapper.writeValueAsString(dtoAntes));
            }

            if (despues != null) {
                ChecklistHistoryDTO dtoDespues = convertir(despues);
                history.setDateAfter(objectMapper.writeValueAsString(dtoDespues));
            }

            // Guardar historial
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

    public List<ChecklistHistory> findHistoryByChecklistId(Long checklistId) {
        return historyRepository.findByChecklistId(checklistId);
    }
}
