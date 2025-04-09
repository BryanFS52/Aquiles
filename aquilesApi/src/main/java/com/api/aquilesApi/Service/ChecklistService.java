package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistSubstantiationListEntity;
import com.api.aquilesApi.Repository.ChecklistSubstantiationListRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class ChecklistSubstantiationListService implements Idao<ChecklistSubstantiationListEntity , Long> {
    @Autowired
    private ChecklistSubstantiationListRepository checklistSubstantiationListRepository;
    @Override
    public Page<ChecklistSubstantiationListEntity> findAll(PageRequest pageRequest) {
        return checklistSubstantiationListRepository.findAll(pageRequest);
    }

    @Override
    public ChecklistSubstantiationListEntity getById(Long id) {
        return checklistSubstantiationListRepository.findById(id).orElseThrow(() ->
                new CustomException("CheckList  with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ChecklistSubstantiationListEntity entity) {
        this.checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public ChecklistSubstantiationListEntity save(ChecklistSubstantiationListEntity entity) {
        return checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public void delete(ChecklistSubstantiationListEntity entity) {
        this.checklistSubstantiationListRepository.delete(entity);
    }

    @Override
    public void create(ChecklistSubstantiationListEntity entity) {
        this.checklistSubstantiationListRepository.save(entity);
    }
}
