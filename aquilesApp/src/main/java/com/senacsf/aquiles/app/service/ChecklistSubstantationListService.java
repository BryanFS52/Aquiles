package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.ChecklistSubstantiationList;
import com.senacsf.aquiles.app.repository.ChecklistSubstantiationListRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChecklistSubstantationListService implements Idao<ChecklistSubstantiationList, Long> {

    @Autowired
    ChecklistSubstantiationListRepository checklistSubstantiationListRepository;

    @Override
    public List<ChecklistSubstantiationList> findAll() {
        return List.of();
    }

    @Override
    public ChecklistSubstantiationList getById(Long aLong) {
        return null;
    }

    @Override
    public void update(ChecklistSubstantiationList obje) {
        this.checklistSubstantiationListRepository.save(obje);
    }

    @Override
    public void save(ChecklistSubstantiationList obje) {
        this.checklistSubstantiationListRepository.save(obje);
    }

    @Override
    public void create(ChecklistSubstantiationList obje) {
        this.checklistSubstantiationListRepository.save(obje);
    }

    @Override
    public void delete(ChecklistSubstantiationList obje) {
        this.checklistSubstantiationListRepository.delete(obje);
    }


}
