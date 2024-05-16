package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.DiarySustainations;
import com.senacsf.aquiles.app.entities.Excuses;
import com.senacsf.aquiles.app.repository.ExcusesRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class ExcusesService implements Idao<Excuses, Long> {

    @Autowired
    ExcusesRepository excusesRepository;

    @Override
    public List<Excuses> findAll(){
        return List.of();
    }

    @Override
    public Excuses getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Excuses obje) {
        this.excusesRepository.save(obje);
    }

    @Override
    public void save(Excuses obje){
        this.excusesRepository.save(obje);
    }

    @Override
    public void delete(Excuses obje){
        this.excusesRepository.delete(obje);
    }
}
