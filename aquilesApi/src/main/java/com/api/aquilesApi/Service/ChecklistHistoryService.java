package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Repository.ChecklistHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ChecklistHistoryService {

    private final ChecklistHistoryRepository historyRepository;

    public ChecklistHistoryService(ChecklistHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
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
}