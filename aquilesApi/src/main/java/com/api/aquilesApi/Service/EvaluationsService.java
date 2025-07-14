package com.api.aquilesApi.Service;


import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Repository.EvaluationsRepository;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EvaluationsService {

    private final EvaluationsRepository evaluationRepository;

    public EvaluationsService(EvaluationsRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public Evaluations findById(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() ->
                        new CustomException("Evaluación con ID " + id + " no encontrada", HttpStatus.NOT_FOUND));
    }
}
