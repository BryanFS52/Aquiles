package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.JustificationTypeEntity;
import com.api.aquilesApi.Repository.JustificationTypeRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JustificationTypeService implements Idao<JustificationTypeEntity, Long> {
    private final JustificationTypeRepository justificationTypeRepository;

    public JustificationTypeService(JustificationTypeRepository justificationTypeRepository) {
        this.justificationTypeRepository = justificationTypeRepository;
    }

    @Override
    public Page<JustificationTypeEntity> findAll(PageRequest pageRequest) {
        return justificationTypeRepository.findAll(pageRequest);
    }


    @Override
    public JustificationTypeEntity getById(Long id) {
        return justificationTypeRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void create(JustificationTypeEntity entity) {
        this.justificationTypeRepository.save(entity);
    }

    @Override
    public void update(JustificationTypeEntity entity) {
        this.justificationTypeRepository.save(entity);
    }

    @Override
    public JustificationTypeEntity save(JustificationTypeEntity entity) {
        return justificationTypeRepository.save(entity);
    }


    @Override
    public void delete(JustificationTypeEntity entity) {
        this.justificationTypeRepository.delete(entity);
    }
}
