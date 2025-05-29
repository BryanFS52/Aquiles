package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistEntity;
import com.api.aquilesApi.Repository.ChecklistRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ChecklistService implements Idao<ChecklistEntity, Long> {

    private final ChecklistRepository checklistRepository;

    public ChecklistService(ChecklistRepository checklistRepository) {
        this.checklistRepository = checklistRepository;
    }

    @Override
    public Page<ChecklistEntity> findAll(PageRequest pageRequest) {
        return checklistRepository.findAll(pageRequest);
    }

    @Override
    public ChecklistEntity getById(Long id) {
        return checklistRepository.findById(id).orElseThrow(() ->
                new CustomException("CheckList with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ChecklistEntity entity) {
        checklistRepository.save(entity);
    }


    @Override
    public ChecklistEntity save(ChecklistEntity entity) {
        return checklistRepository.save(entity);
    }

    @Override
    public void delete(ChecklistEntity entity) {
        checklistRepository.delete(entity);
    }

    @Override
    public void create(ChecklistEntity entity) {
        // Al crear la entidad, también necesitamos manejar las relaciones como en el método `save`
        save(entity);
    }
}