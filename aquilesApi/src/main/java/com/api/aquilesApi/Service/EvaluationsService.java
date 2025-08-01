package com.api.aquilesApi.Service;

import com.api.aquilesApi.Business.EvaluationsBusiness;
import com.api.aquilesApi.Dto.EvaluationsDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Repository.EvaluationsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EvaluationsService implements Idao<Evaluations, Long> {

    private final EvaluationsRepository evaluationRepository;

    public EvaluationsService(EvaluationsRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    @Override
    public Page<Evaluations> findAll(PageRequest pageRequest) {
        return evaluationRepository.findAll(pageRequest);
    }

    @Override
    public Evaluations getById(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Evaluation with ID " + id + " not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public Evaluations save(Evaluations entity) {
        return evaluationRepository.save(entity);
    }

    @Override
    public void update(Evaluations entity) {
        evaluationRepository.save(entity);
    }

    @Override
    public void delete(Evaluations entity) {
        evaluationRepository.delete(entity);
    }

    @Override
    public void create(Evaluations entity) {
        evaluationRepository.save(entity);
    }
}
