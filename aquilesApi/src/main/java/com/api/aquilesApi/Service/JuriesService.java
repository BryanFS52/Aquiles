package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Juries;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JuriesService implements Idao<Juries , Long> {
    @Autowired
    private JuriesRepository juriesRepository;
    @Override
    public Page<Juries> findAll(PageRequest pageRequest) {
        return juriesRepository.findAll(pageRequest);
    }

    @Override
    public Juries getById(Long id) {
        return juriesRepository.findById(id).orElseThrow(() ->
                new CustomException("Jury with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Juries entity) {
        this.juriesRepository.save(entity);
    }

    @Override
    public Juries save(Juries entity) {
        return juriesRepository.save(entity);
    }

    @Override
    public void delete(Juries entity) {
        this.juriesRepository.delete(entity);
    }

    @Override
    public void create(Juries entity) {
        this.juriesRepository.save(entity);
    }
}
