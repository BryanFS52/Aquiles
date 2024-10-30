package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Justification;
import com.senacsf.aquiles.app.repository.JustificationRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JustificationService implements Idao<Justification, Long> {

    @Autowired
    JustificationRepository justificationRepository;

    @Override
    public List<Justification> findAll() {
        return justificationRepository.findAll();
    }

    @Override
    public Justification getById(Long id) {
        Optional<Justification> optionalJustification = justificationRepository.findById(id);
        return optionalJustification.orElse(null);
    }

    @Override
    public void update(Justification entity) {
        this.justificationRepository.save(entity);
    }

    @Override
    public Justification save(Justification entity) {
       return this.justificationRepository.save(entity);
    }

    @Override
    public void create(Justification entity) {
        this.justificationRepository.save(entity);
    }

    @Override
    public void delete(Justification entity) {
        this.justificationRepository.delete(entity);
    }
}
