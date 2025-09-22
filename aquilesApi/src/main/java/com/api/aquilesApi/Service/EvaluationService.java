package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Evaluation;
import com.api.aquilesApi.Repository.EvaluationRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService implements Idao<Evaluation, Long> {

    private final EvaluationRepository evaluationRepository;

    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    @Override
    public Page<Evaluation> findAll(PageRequest pageRequest) {
        return evaluationRepository.findAll(pageRequest);
    }

    @Override
    public Evaluation getById(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Evaluation with ID " + id + " not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public Evaluation save(Evaluation entity) {
        return evaluationRepository.save(entity);
    }

    @Override
    public void update(Evaluation entity) {
        evaluationRepository.save(entity);
    }

    @Override
    public void delete(Evaluation entity) {
        evaluationRepository.delete(entity);
    }

    @Override
    public void create(Evaluation entity) {
        evaluationRepository.save(entity);
    }
    
    public List<Evaluation> findByChecklistId(Long checklistId) {
        return evaluationRepository.findByChecklistId(checklistId);
    }

    // Nuevo método para la relación 1:1 - obtener la evaluación única de un checklist
    public Evaluation findEvaluationByChecklistId(Long checklistId) {
        return evaluationRepository.findEvaluationByChecklistId(checklistId);
    }

    // Verificar si existe una evaluación para un checklist
    public boolean existsByChecklistId(Long checklistId) {
        return evaluationRepository.existsByChecklistId(checklistId);
    }
}
