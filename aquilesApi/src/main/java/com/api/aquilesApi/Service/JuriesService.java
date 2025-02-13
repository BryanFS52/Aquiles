package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.JuriesEntity;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JuriesService implements Idao<JuriesEntity , Long> {
    @Autowired
    private JuriesRepository juriesRepository;
    @Override
    public Page<JuriesEntity> findAll(PageRequest pageRequest) {
        return juriesRepository.findAll(pageRequest);
    }

    @Override
    public JuriesEntity getById(Long id) {
        return juriesRepository.findById(id).orElseThrow(() ->
                new CustomException("Jury with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(JuriesEntity entity) {
        this.juriesRepository.save(entity);
    }

    @Override
    public JuriesEntity save(JuriesEntity entity) {
        return juriesRepository.save(entity);
    }

    @Override
    public void delete(JuriesEntity entity) {
        this.juriesRepository.delete(entity);
    }

    @Override
    public void create(JuriesEntity entity) {
        this.juriesRepository.save(entity);
    }
}
