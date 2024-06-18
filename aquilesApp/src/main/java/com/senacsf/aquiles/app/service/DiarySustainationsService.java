package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.DiarySustainations;
import com.senacsf.aquiles.app.repository.DiarySustainationsRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DiarySustainationsService implements Idao<DiarySustainations, Long> {

    @Autowired
    DiarySustainationsRepository diarySustainationsRepository;

    @Override
    public List<DiarySustainations> findAll() {
        return diarySustainationsRepository.findAll();
    }

    @Override
    public DiarySustainations getById(Long id) {
        Optional<DiarySustainations> optionalDiarySustainations = diarySustainationsRepository.findById(id);
        return optionalDiarySustainations.orElse(null);
    }

    @Override
    public void update(DiarySustainations entity) {
        this.diarySustainationsRepository.save(entity);
    }

    @Override
    public DiarySustainations save(DiarySustainations entity) {
        return this.diarySustainationsRepository.save(entity);
    }

    @Override
    public void create(DiarySustainations entity) {
        this.diarySustainationsRepository.save(entity);
    }

    @Override
    public void delete(DiarySustainations entity) {
        this.diarySustainationsRepository.delete(entity);
    }
}
