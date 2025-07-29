package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.JustificationType;
import com.api.aquilesApi.Repository.JustificationTypeRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JustificationTypeService implements Idao<JustificationType, Long> {
    private final JustificationTypeRepository justificationTypeRepository;

    public JustificationTypeService(JustificationTypeRepository justificationTypeRepository) {
        this.justificationTypeRepository = justificationTypeRepository;
    }

    @Override
    public Page<JustificationType> findAll(PageRequest pageRequest) {
        return justificationTypeRepository.findAll(pageRequest);
    }

    @Override
    public JustificationType getById(Long id) {
        return justificationTypeRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void create(JustificationType entity) {
        this.justificationTypeRepository.save(entity);
    }

    @Override
    public void update(JustificationType entity) {
        this.justificationTypeRepository.save(entity);
    }

    @Override
    public JustificationType save(JustificationType entity) {
        return justificationTypeRepository.save(entity);
    }

    @Override
    public void delete(JustificationType entity) {
        this.justificationTypeRepository.delete(entity);
    }
}
