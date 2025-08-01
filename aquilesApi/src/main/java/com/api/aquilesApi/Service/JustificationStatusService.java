package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.JustificationStatus;
import com.api.aquilesApi.Repository.JustificationStatusRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JustificationStatusService implements Idao<JustificationStatus, Long> {
    private final JustificationStatusRepository justificationStatusRepository;

    public JustificationStatusService(JustificationStatusRepository justificationStatusRepository) {
        this.justificationStatusRepository = justificationStatusRepository;
    }

    @Override
    public Page<JustificationStatus> findAll(PageRequest pageRequest) {
        return justificationStatusRepository.findAll(pageRequest);
    }

    @Override
    public JustificationStatus getById(Long id) {
        return justificationStatusRepository.findById(id).orElseThrow(() ->
                new CustomException("Status Justification whit id " + id + " not fund", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(JustificationStatus entity) {
        this.justificationStatusRepository.save(entity);
    }

    @Override
    public JustificationStatus save(JustificationStatus entity) {
        return justificationStatusRepository.save(entity);
    }

    @Override
    public void delete(JustificationStatus entity) {
        this.justificationStatusRepository.delete(entity);
    }

    @Override
    public void create(JustificationStatus entity) {
        this.justificationStatusRepository.save(entity);
    }

}