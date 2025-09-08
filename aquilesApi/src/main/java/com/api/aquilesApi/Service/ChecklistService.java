package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Repository.ChecklistRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ChecklistService implements Idao<Checklist, Long> {

    private final ChecklistRepository checklistRepository;
    public ChecklistService(ChecklistRepository checklistRepository) {
        this.checklistRepository = checklistRepository;
    }

    @Override
    public Page<Checklist> findAll(PageRequest pageRequest) {
        return checklistRepository.findAll(pageRequest);
    }

    @Override
    public Checklist getById(Long id) {
        return checklistRepository.findById(id)
                .orElseThrow(() -> new CustomException("CheckList with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Checklist entity) {
        checklistRepository.save(entity);
    }

    @Override
    public Checklist save(Checklist entity) {
        return checklistRepository.save(entity);
    }

    @Override
    public void delete(Checklist entity) {
        checklistRepository.delete(entity);
    }

    @Override
    public void create(Checklist entity) {
        checklistRepository.save(entity);
    }
}
