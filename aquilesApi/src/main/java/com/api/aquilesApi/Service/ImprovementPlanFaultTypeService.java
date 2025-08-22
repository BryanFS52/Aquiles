package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanFaultType;
import com.api.aquilesApi.Repository.ImprovementPlanFaultTypeRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ImprovementPlanFaultTypeService implements Idao<ImprovementPlanFaultType, Long> {

    private final ImprovementPlanFaultTypeRepository repository;

    public ImprovementPlanFaultTypeService(ImprovementPlanFaultTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<ImprovementPlanFaultType> findAll(PageRequest pageRequest) {
        return repository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanFaultType getById(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new CustomException("Improvement Plan Fault Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ImprovementPlanFaultType entity) {
        repository.save(entity);
    }

    @Override
    public ImprovementPlanFaultType save(ImprovementPlanFaultType entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanFaultType entity) {
        repository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanFaultType entity) {
        repository.save(entity);
    }
}
