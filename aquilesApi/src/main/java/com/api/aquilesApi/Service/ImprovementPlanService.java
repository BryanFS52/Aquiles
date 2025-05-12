package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanEntity;
import com.api.aquilesApi.Repository.ImprovementPlanRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

public class ImprovementPlanService implements Idao<ImprovementPlanEntity, Long> {
    private final ImprovementPlanRepository improvementPlanRepository;

    public ImprovementPlanService(ImprovementPlanRepository improvementPlanRepository) {
        this.improvementPlanRepository = improvementPlanRepository;
    }

    @Override
    public Page<ImprovementPlanEntity> findAll(PageRequest pageRequest) {
        return improvementPlanRepository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanEntity getById(Long id) {
        return improvementPlanRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }


    @Override
    public void update(ImprovementPlanEntity entity) {
        this.improvementPlanRepository.save(entity);
    }

    @Override
    public ImprovementPlanEntity save(ImprovementPlanEntity entity) {
        return improvementPlanRepository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanEntity entity) {
        this.improvementPlanRepository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanEntity entity) {
        this.improvementPlanRepository.save(entity);
    }
}