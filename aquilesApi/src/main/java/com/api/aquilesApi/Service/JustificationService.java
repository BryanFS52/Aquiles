package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Justification;
import com.api.aquilesApi.Repository.JustificationRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JustificationService implements Idao<Justification, Long> {

    @Autowired
    private JustificationRepository justificationRepository;

    @Override
    public Page<Justification> findAll(PageRequest pageRequest) {
        return justificationRepository.findAll(pageRequest);
    }

    @Override
    public Justification getById(Long id) {
        return justificationRepository.findById(id).orElseThrow(() ->
                new CustomException("Justification with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Justification entity) {
        this.justificationRepository.save(entity);
    }

    @Override
    public Justification save(Justification entity) {
        return justificationRepository.save(entity);
    }

    @Override
    public void delete(Justification entity) {
        this.justificationRepository.delete(entity);
    }

    @Override
    public void create(Justification entity) {
        this.justificationRepository.save(entity);
    }

    public boolean existsByJustificationDocument(String justificationDocument) {
        return justificationRepository.existsByJustificationDocument(justificationDocument);
    }
}
