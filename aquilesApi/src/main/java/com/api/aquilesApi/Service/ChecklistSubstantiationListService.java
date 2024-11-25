package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistSubstantiationList;
import com.api.aquilesApi.Repository.ChecklistSubstantiationListRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ChecklistSubstantiationListService implements Idao<ChecklistSubstantiationList, Long> {

    @Autowired
    private ChecklistSubstantiationListRepository checklistSubstantiationListRepository;

    @Override
    public Page<ChecklistSubstantiationList> findAll(PageRequest pageRequest) {
        return checklistSubstantiationListRepository.findAll(pageRequest);
    }

    @Override
    public ChecklistSubstantiationList getById(Long id) {
        return checklistSubstantiationListRepository.findById(id)
                .orElseThrow(() -> new CustomException("Checklist with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ChecklistSubstantiationList entity) {
        checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public ChecklistSubstantiationList save(ChecklistSubstantiationList entity) {
        return checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public void delete(ChecklistSubstantiationList entity) {
        checklistSubstantiationListRepository.delete(entity);
    }

    @Override
    public void create(ChecklistSubstantiationList entity) {
        checklistSubstantiationListRepository.save(entity);
    }
}
