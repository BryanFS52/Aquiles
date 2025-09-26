package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Repository.EvaluationsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Evaluations> findByChecklistId(Long checklistId) {
        return evaluationRepository.findByChecklistId(checklistId);
    }

    // Nuevo método para la relación 1:1 - obtener la evaluación única de un checklist
    public Evaluations findEvaluationByChecklistId(Long checklistId) {
        return evaluationRepository.findEvaluationByChecklistId(checklistId);
    }

    // Verificar si existe una evaluación para un checklist
    public boolean existsByChecklistId(Long checklistId) {
        return evaluationRepository.existsByChecklistId(checklistId);
    }
}