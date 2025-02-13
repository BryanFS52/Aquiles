package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.TrainersEntity;
import com.api.aquilesApi.Repository.TrainersRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;


@Service
public class TrainersService implements Idao<TrainersEntity , Long> {
    @Autowired
    private TrainersRepository trainersRepository;

    @Transactional(readOnly = false)
    public TrainersEntity findByDocumentNumber(BigInteger documentNumber) {
        return trainersRepository.findByDocumentNumber(documentNumber);     // Llama al método del repositorio para encontrar un equipo scrum por el nombre del proyecto
    }

    @Override
    public Page<TrainersEntity> findAll(PageRequest pageRequest) {
        return trainersRepository.findAll(pageRequest);
    }

    @Override
    public TrainersEntity getById(Long id) {
        return trainersRepository.findById(id).orElseThrow(() ->
                new CustomException("Trainer id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(TrainersEntity entity) {
        this.trainersRepository.save(entity);
    }

    @Override
    public TrainersEntity save(TrainersEntity entity) {
        return trainersRepository.save(entity);
    }

    @Override
    public void delete(TrainersEntity entity) {
        this.trainersRepository.delete(entity);
    }

    @Override
    public void create(TrainersEntity entity) {
        this.trainersRepository.save(entity);
    }
}
