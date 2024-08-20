package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.entities.Trainers;
import com.senacsf.aquiles.app.repository.TrainersRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

@Service
public class TrainersService implements Idao<Trainers, Long> {

    @Autowired
    TrainersRepository trainersRepository;

    @Transactional(readOnly = false)
    public Trainers findByDocumentNumber(BigInteger documentNumber) {
        return trainersRepository.findByDocumentNumber(documentNumber);
    }


    @Override
    public List<Trainers> findAll() {
        return List.of();
    }

    @Override
    public Trainers getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Trainers entity) {
        this.trainersRepository.save(entity);
    }

    @Override
    public Trainers save(Trainers entity) {
        return this.trainersRepository.save(entity);

    }

    @Override
    public void create(Trainers entity) {
        this.trainersRepository.save(entity);

    }

    @Override
    public void delete(Trainers entity) {
        this.trainersRepository.delete(entity);
    }
}
