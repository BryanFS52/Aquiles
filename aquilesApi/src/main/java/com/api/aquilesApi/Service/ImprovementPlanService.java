package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Repository.ImprovementPlanRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public Page<ImprovementPlan> findAll(Pageable pageable) {
        return improvementPlanRepository.findAll(pageable);
    }

    @Override
    public ImprovementPlan getById(Long id) {
        return improvementPlanRepository.findById(id)
                .orElseThrow(() -> new CustomException(
                        "Improvement Plan with id " + id + " not found",
                        HttpStatus.NO_CONTENT
                ));
    }

    @Override
    public void update(ImprovementPlan entity) {
        improvementPlanRepository.save(entity);
    }

    @Override
    public ImprovementPlan save(ImprovementPlan entity) {
        return improvementPlanRepository.save(entity);
    }

    @Override
    public void delete(ImprovementPlan entity) {
        improvementPlanRepository.delete(entity);
    }

    @Override
    public void create(ImprovementPlan entity) {
        improvementPlanRepository.save(entity);
    }

    public boolean existsActivePlanForStudent(Long studentId) {
        return improvementPlanRepository.existsByStudentIdAndStateTrue(studentId);
    }

}
