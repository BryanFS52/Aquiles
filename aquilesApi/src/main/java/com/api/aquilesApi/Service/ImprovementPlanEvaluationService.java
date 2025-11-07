package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanEvaluation;
import com.api.aquilesApi.Repository.ImprovementPlanEvaluationRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImprovementPlanEvaluationService implements Idao<ImprovementPlanEvaluation, Long> {

    private final ImprovementPlanEvaluationRepository improvementPlanEvaluationRepository;

    public ImprovementPlanEvaluationService(ImprovementPlanEvaluationRepository improvementPlanEvaluationRepository) {
        this.improvementPlanEvaluationRepository = improvementPlanEvaluationRepository;
    }

    @Override
    public Page<ImprovementPlanEvaluation> findAll(PageRequest pageRequest) {
        return improvementPlanEvaluationRepository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanEvaluation getById(Long id) {
        return improvementPlanEvaluationRepository.findById(id)
                .orElseThrow(() -> new CustomException(
                        "Improvement Plan Evaluation with id " + id + " not found",
                        HttpStatus.NO_CONTENT
                ));
    }

    public Optional<ImprovementPlanEvaluation> findByImprovementPlanId(Long improvementPlanId) {
        return improvementPlanEvaluationRepository.findByImprovementPlanId(improvementPlanId);
    }

    public boolean existsByImprovementPlanId(Long improvementPlanId) {
        return improvementPlanEvaluationRepository.existsByImprovementPlanId(improvementPlanId);
    }

    @Override
    public void update(ImprovementPlanEvaluation entity) {
        improvementPlanEvaluationRepository.save(entity);
    }

    @Override
    public ImprovementPlanEvaluation save(ImprovementPlanEvaluation entity) {
        return improvementPlanEvaluationRepository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanEvaluation entity) {
        improvementPlanEvaluationRepository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanEvaluation entity) {
        improvementPlanEvaluationRepository.save(entity);
    }
}

