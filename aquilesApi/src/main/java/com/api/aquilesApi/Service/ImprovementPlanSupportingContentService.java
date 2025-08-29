/*
package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanSupportingContent;
import com.api.aquilesApi.Repository.ImprovementPlanSupportingContentRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ImprovementPlanSupportingContentService implements Idao<ImprovementPlanSupportingContent, Long> {

    private final ImprovementPlanSupportingContentRepository repository;

    public ImprovementPlanSupportingContentService(ImprovementPlanSupportingContentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<ImprovementPlanSupportingContent> findAll(PageRequest pageRequest) {
        return repository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanSupportingContent getById(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new CustomException("Improvement Plan Supporting Content with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ImprovementPlanSupportingContent entity) {
        repository.save(entity);
    }

    @Override
    public ImprovementPlanSupportingContent save(ImprovementPlanSupportingContent entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanSupportingContent entity) {
        repository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanSupportingContent entity) {
        repository.save(entity);
    }
}


 */