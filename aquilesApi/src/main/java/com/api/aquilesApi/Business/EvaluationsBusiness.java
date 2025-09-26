package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.EvaluationsDto;

import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;



@Component
public class EvaluationsBusiness {
    private EvaluationsService evaluationsService;
    private ChecklistService checklistService;
    private ModelMapper modelMapper;

    public EvaluationsBusiness(EvaluationsService evaluationsService, ChecklistService checklistService, ModelMapper modelMapper) {
        this.evaluationsService = evaluationsService;
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
    }


    // Validation Object


    // Find ALl
    public Page<EvaluationsDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Evaluations> evaluationsPage = evaluationsService.findAll(pageRequest);
            return evaluationsPage.map(evaluation -> modelMapper.map(evaluation, EvaluationsDto.class));
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public EvaluationsDto findById(Long id) {
        try {
            Evaluations evaluation = evaluationsService.getById(id);
            return modelMapper.map(evaluation, EvaluationsDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluation with ID " + id + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Find By Checklist Id - Relación 1:1
    public List<EvaluationsDto> findByChecklistId(Long checklistId) {
        try {
            List<Evaluations> evaluations = evaluationsService.findByChecklistId(checklistId);
            return evaluations.stream()
                    .map(evaluation -> modelMapper.map(evaluation, EvaluationsDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluations for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Nuevo método para obtener la evaluación única de un checklist (relación 1:1)
    public EvaluationsDto findEvaluationByChecklistId(Long checklistId) {
        try {
            Evaluations evaluation = evaluationsService.findEvaluationByChecklistId(checklistId);
            return evaluation != null ? modelMapper.map(evaluation, EvaluationsDto.class) : null;
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluation for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Verificar si existe evaluación para un checklist
    public boolean existsByChecklistId(Long checklistId) {
        try {
            return evaluationsService.existsByChecklistId(checklistId);
        } catch (Exception e) {
            throw new CustomException("Error checking evaluation existence for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public EvaluationsDto add(EvaluationsDto evaluationsDto) {
        try {
            // Crear la entidad Evaluations manualmente para evitar problemas con el mapeo de checklistId
            Evaluations evaluation = new Evaluations();
            evaluation.setObservations(evaluationsDto.getObservations());
            evaluation.setRecommendations(evaluationsDto.getRecommendations());
            evaluation.setValueJudgment(evaluationsDto.getValueJudgment());

            // Si se proporciona un checklistId, obtener la entidad Checklist del contexto de persistencia
            if (evaluationsDto.getChecklistId() != null) {
                try {
                    // Obtener la entidad Checklist existente para asociarla
                    evaluation.setChecklist(checklistService.getById(evaluationsDto.getChecklistId()));
                } catch (Exception e) {
                    throw new CustomException("Checklist with ID " + evaluationsDto.getChecklistId() + " not found", HttpStatus.BAD_REQUEST);
                }
            }

            Evaluations savedEvaluation = evaluationsService.save(evaluation);
            return modelMapper.map(savedEvaluation, EvaluationsDto.class);
        } catch (Exception e) {
            throw new CustomException("Error adding evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long evaluationId,  EvaluationsDto evaluationsDto) {
        try {
            // Obtener la evaluación existente del contexto de persistencia
            Evaluations existingEvaluation = evaluationsService.getById(evaluationId);

            // Actualizar solo los campos necesarios manualmente para evitar problemas con el mapeo
            existingEvaluation.setObservations(evaluationsDto.getObservations());
            existingEvaluation.setRecommendations(evaluationsDto.getRecommendations());
            existingEvaluation.setValueJudgment(evaluationsDto.getValueJudgment());

            // Si se proporciona un checklistId diferente, actualizar la referencia
            if (evaluationsDto.getChecklistId() != null) {
                try {
                    // Solo actualizar la referencia de checklist si cambió
                    if (existingEvaluation.getChecklist() == null ||
                            !existingEvaluation.getChecklist().getId().equals(evaluationsDto.getChecklistId())) {
                        existingEvaluation.setChecklist(checklistService.getById(evaluationsDto.getChecklistId()));
                    }
                } catch (Exception e) {
                    throw new CustomException("Checklist with ID " + evaluationsDto.getChecklistId() + " not found", HttpStatus.BAD_REQUEST);
                }
            }

            // Guardar la evaluación actualizada
            evaluationsService.update(existingEvaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error updating evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long evaluationId) {
        try {
            Evaluations evaluation = evaluationsService.getById(evaluationId);
            evaluationsService.delete(evaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting evaluation with ID " + evaluationId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}