package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Juries;
import com.senacsf.aquiles.app.repository.JuriesRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JuriesService implements Idao<Juries, Long> {

    @Autowired
    JuriesRepository juriesRepository;

    @Override
    public List<Juries> findAll() {
        return List.of();
    }

    @Override
    public Juries getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Juries obje) {
        this.juriesRepository.save(obje);
    }

    @Override
    public void save(Juries obje) {
        this.juriesRepository.save(obje);
    }

    @Override
    public void delete(Juries obje) {
        this.juriesRepository.delete(obje);
    }
}
