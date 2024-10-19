package com.senacsf.aquiles.app.service;

import java.math.BigInteger;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.senacsf.aquiles.app.entities.Trainers;
import com.senacsf.aquiles.app.repository.TrainersRepository;
import com.senacsf.aquiles.app.service.dao.Idao;

@Service
public class TrainersService implements Idao<Trainers, Long> {

    @Autowired
    private TrainersRepository trainersRepository;

    @Transactional(readOnly = false)
    public Trainers findByDocumentNumber(BigInteger documentNumber) {
        return trainersRepository.findByDocumentNumber(documentNumber); // Llama al método del repositorio para encontrar un entrenador por el número de documento
    }

    @Override
    public List<Trainers> findAll() {
        return trainersRepository.findAll(); // Obtiene todos los entrenadores desde el repositorio
    }

    @Override
    public Trainers getById(Long id) {
        return trainersRepository.findById(id).orElse(null); // Devuelve el entrenador o null si no existe
    }

    @Override
    public void update(Trainers entity) {
        trainersRepository.save(entity); // Actualiza el entrenador
    }

    @Override
    public Trainers save(Trainers entity) {
        return trainersRepository.save(entity); // Guarda la entidad y devuelve el entrenador guardado
    }

    @Override
    public void create(Trainers entity) {
        trainersRepository.save(entity); // Crea un nuevo entrenador
    }

    @Override
    public void delete(Trainers entity) {
        trainersRepository.delete(entity); // Elimina el entrenador
    }
}
