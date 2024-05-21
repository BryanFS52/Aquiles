package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Excuses;
import com.senacsf.aquiles.app.repository.ExcusesRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExcusesService implements Idao<Excuses, Long> {

    @Autowired
    ExcusesRepository excusesRepository;

    @Override
    public List<Excuses> findAll() {
        return excusesRepository.findAll();
    }

    @Override
    public Excuses getById(Long id) {
        Optional<Excuses> optionalExcuses = excusesRepository.findById(id);
        return optionalExcuses.orElse(null);
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
