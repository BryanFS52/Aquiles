package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import com.api.aquilesApi.Repository.ImprovementPlanActivityRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ImprovementPlanActivityService implements Idao<ImprovementPlanActivity, Long> {

    private final ImprovementPlanActivityRepository repository;

    public ImprovementPlanActivityService(ImprovementPlanActivityRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<ImprovementPlanActivity> findAll(PageRequest pageRequest) {
        return repository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanActivity getById(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new CustomException("Improvement Plan Activity with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ImprovementPlanActivity entity) {
        repository.save(entity);
    }

    @Override
    public ImprovementPlanActivity save(ImprovementPlanActivity entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanActivity entity) {
        repository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanActivity entity) {
        repository.save(entity);
    }
}
