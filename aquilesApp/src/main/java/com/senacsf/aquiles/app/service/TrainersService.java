package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Trainers;
import com.senacsf.aquiles.app.repository.TrainersRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainersService implements Idao<Trainers, Long> {

    @Autowired
    TrainersRepository trainersRepository;


    @Override
    public List<Trainers> findAll() {
        return List.of();
    }

    @Override
    public Trainers getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Trainers obje) {
        this.trainersRepository.save(obje);
    }

    @Override
    public void save(Trainers obje) {
        this.trainersRepository.save(obje);

    }

    @Override
    public void create(Trainers obje) {
        this.trainersRepository.save(obje);

    }

    @Override
    public void delete(Trainers obje) {
        this.trainersRepository.delete(obje);
    }
}
