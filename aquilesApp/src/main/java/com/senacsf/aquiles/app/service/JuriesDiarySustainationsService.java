package com.senacsf.aquiles.app.service;


import com.senacsf.aquiles.app.entities.JuriesDiarySustainations;
import com.senacsf.aquiles.app.repository.JuriesDiarySustainationsRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JuriesDiarySustainationsService implements Idao<JuriesDiarySustainations, Long> {

    @Autowired
    JuriesDiarySustainationsRepository juriesDiarySustainationsRepository;

    @Override
    public List<JuriesDiarySustainations> findAll() {
        return null;
    }

    @Override
    public JuriesDiarySustainations getById(Long aLong) {
        return null;
    }

    @Override
    public void save(JuriesDiarySustainations obje) {
        this.juriesDiarySustainationsRepository.save(obje);
    }

    @Override
    public void delete(JuriesDiarySustainations obje) {
        this.juriesDiarySustainationsRepository.delete(obje);
    }
}
