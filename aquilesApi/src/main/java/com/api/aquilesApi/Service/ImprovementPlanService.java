package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Repository.ImprovementPlanRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ImprovementPlanService implements Idao<ImprovementPlan, Long> {
    private final ImprovementPlanRepository improvementPlanRepository;

    public ImprovementPlanService(ImprovementPlanRepository improvementPlanRepository) {
        this.improvementPlanRepository = improvementPlanRepository;
    }

    @Override
    public Page<ImprovementPlan> findAll(PageRequest pageRequest) {
        return improvementPlanRepository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlan getById(Long id) {
        return improvementPlanRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ImprovementPlan entity) {
        this.improvementPlanRepository.save(entity);
    }

    @Override
    public ImprovementPlan save(ImprovementPlan entity) {
        return improvementPlanRepository.save(entity);
    }

    @Override
    public void delete(ImprovementPlan entity) {
        this.improvementPlanRepository.delete(entity);
    }

    @Override
    public void create(ImprovementPlan entity) {
        this.improvementPlanRepository.save(entity);
    }
}