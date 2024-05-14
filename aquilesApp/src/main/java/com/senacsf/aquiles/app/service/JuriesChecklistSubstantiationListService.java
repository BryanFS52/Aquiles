package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Follow_ups;
import com.senacsf.aquiles.app.entities.JuriesChecklistSubstantiationList;
import com.senacsf.aquiles.app.repository.ExcusesRepository;
import com.senacsf.aquiles.app.repository.JuriesChecklistSubstantiationListRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class JuriesChecklistSubstantiationListService implements Idao<JuriesChecklistSubstantiationList,Long> {

    @Autowired
    JuriesChecklistSubstantiationListRepository juriesChecklistSubstantiationListRepository;

    @Autowired
    ExcusesRepository excusesRepository;

    @Override
    public List<JuriesChecklistSubstantiationList> findAll(){
        return List.of();
    }

    @Override
    public JuriesChecklistSubstantiationList getById(Long aLong) {
        return null;
    }

    @Override
    public void save(JuriesChecklistSubstantiationList obje){
        this.juriesChecklistSubstantiationListRepository.save(obje);
    }

    @Override
    public void delete(JuriesChecklistSubstantiationList obje){
        this.juriesChecklistSubstantiationListRepository.delete(obje);
    }
}
