package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.ChecklistSubstantiationList;
import com.senacsf.aquiles.app.repository.ChecklistSubstantiationListRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChecklistSubstantationListService implements Idao<ChecklistSubstantiationList, Long> {

    @Autowired
    private ChecklistSubstantiationListRepository checklistSubstantiationListRepository;

    @Override
    public List<ChecklistSubstantiationList> findAll() {
        return checklistSubstantiationListRepository.findAll();
    }

    @Override
    public ChecklistSubstantiationList getById(Long id) {
        Optional<ChecklistSubstantiationList> checklist = checklistSubstantiationListRepository.findById(id);
        return checklist.orElse(null); // Puedes manejar el caso de ausencia como prefieras
    }

    @Override
    public void update(ChecklistSubstantiationList entity) {
        // `save` en realidad actúa como un método de actualización si la entidad ya existe
        checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public ChecklistSubstantiationList save(ChecklistSubstantiationList entity) {
        return checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public void create(ChecklistSubstantiationList entity) {
        // `save` también se usa para crear nuevas entidades
        checklistSubstantiationListRepository.save(entity);
    }

    @Override
    public void delete(ChecklistSubstantiationList entity) {
        checklistSubstantiationListRepository.delete(entity);
    }
}
