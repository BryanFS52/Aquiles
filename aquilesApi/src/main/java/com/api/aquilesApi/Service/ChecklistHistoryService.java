package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Repository.ChecklistHistoryRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ChecklistHistoryService implements Idao<ChecklistHistory, Long> {

    private final ChecklistHistoryRepository checklistHistoryRepository;

    public ChecklistHistoryService(ChecklistHistoryRepository historyRepository) {
        this.checklistHistoryRepository = historyRepository;
    }

    @Override
    public Page<ChecklistHistory> findAll(PageRequest pageRequest) {
        return checklistHistoryRepository.findAll(pageRequest);
    }

    @Override
    public ChecklistHistory getById(Long id) {
        return checklistHistoryRepository.findById(id)
                .orElseThrow(() -> new CustomException("CheckListHistory with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update (ChecklistHistory entity) {checklistHistoryRepository.save(entity);}

    @Override
    public ChecklistHistory save (ChecklistHistory entity) {return checklistHistoryRepository.save(entity);}

    @Override
    public void delete(ChecklistHistory checklistHistory) {
        checklistHistoryRepository.delete(checklistHistory);
    }

    @Override
    public void create(ChecklistHistory entity) {checklistHistoryRepository.save(entity);}

    public List<ChecklistHistory> findByChecklistId(Long checklistId) {
        return checklistHistoryRepository.findByChecklistId(checklistId);
    }
}