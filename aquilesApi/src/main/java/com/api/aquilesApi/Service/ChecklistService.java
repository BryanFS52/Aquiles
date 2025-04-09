package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistEntity;
import com.api.aquilesApi.Repository.ChecklistRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ChecklistService implements Idao<ChecklistEntity , Long> {
    @Autowired
    private ChecklistRepository checklistSubstantiationListRepository;
    @Override
    public Page<ChecklistEntity> findAll(PageRequest pageRequest) {
        return checklistSubstantiationListRepository.findAll(pageRequest);
    }

    @Override
    public ChecklistEntity getById(Long id) {
        return checklistSubstantiationListRepository.findById(id).orElseThrow(() ->
                new CustomException("CheckList  with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ChecklistEntity entity) {
        this.checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public ChecklistEntity save(ChecklistEntity entity) {
        return checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public void delete(ChecklistEntity entity) {
        this.checklistSubstantiationListRepository.delete(entity);
    }

    @Override
    public void create(ChecklistEntity entity) {
        this.checklistSubstantiationListRepository.save(entity);
    }
}
