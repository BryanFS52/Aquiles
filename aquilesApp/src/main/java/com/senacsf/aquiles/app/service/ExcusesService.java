package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Excuses;
import com.senacsf.aquiles.app.repository.ExcusesRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class ExcusesService implements Idao<Excuses, Long> {

    @Autowired
    ExcusesRepository excusesRepository;

    @Override
    public List<Excuses> findAll() {
        return List.of();
    }

    @Override
    public Excuses getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Excuses entity) {
        this.excusesRepository.save(entity);
    }

    @Override
    public Excuses save(Excuses entity) {
        return this.excusesRepository.save(entity);
    }

    @Override
    public void create(Excuses entity) {
        this.excusesRepository.save(entity);
    }

    @Override
    public void delete(Excuses entity) {
        this.excusesRepository.delete(entity);
    }
}
