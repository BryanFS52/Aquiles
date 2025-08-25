package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanEvidenceType;
import com.api.aquilesApi.Repository.ImprovementPlanEvidenceTypeRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ImprovementPlanEvidenceTypeService implements Idao<ImprovementPlanEvidenceType, Long> {

    private final ImprovementPlanEvidenceTypeRepository repository;

    public ImprovementPlanEvidenceTypeService(ImprovementPlanEvidenceTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<ImprovementPlanEvidenceType> findAll(PageRequest pageRequest) {
        return repository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanEvidenceType getById(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new CustomException("Improvement Plan Evidence Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ImprovementPlanEvidenceType entity) {
        repository.save(entity);
    }

    @Override
    public ImprovementPlanEvidenceType save(ImprovementPlanEvidenceType entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanEvidenceType entity) {
        repository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanEvidenceType entity) {
        repository.save(entity);
    }
}
