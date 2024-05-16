package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.ChecklistSubstantiationList;
import com.senacsf.aquiles.app.entities.DiarySustainations;
import com.senacsf.aquiles.app.repository.DiarySustainationsRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class DiarySustainationsService implements Idao<DiarySustainations, Long> {

    @Autowired
    DiarySustainationsRepository diarySustainationsRepository;

    @Override
    public List<DiarySustainations> findAll(){
        return List.of();
    }

    @Override
    public DiarySustainations getById(Long aLong) {
        return null;
    }

    @Override
    public void update(DiarySustainations obje) {
        this.diarySustainationsRepository.save(obje);
    }

    @Override
    public void save(DiarySustainations obje){
        this.diarySustainationsRepository.save(obje);
    }

    @Override
    public void create(DiarySustainations obje){
        this.diarySustainationsRepository.save(obje);
    }

    @Override
    public void delete(DiarySustainations obje){
        this.diarySustainationsRepository.delete(obje);
    }
}
