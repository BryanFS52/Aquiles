package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Entity.Evaluation;
import com.api.aquilesApi.Service.EvaluationService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.EvaluationMap;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;



@Component
public class EvaluationsBusiness {
    private EvaluationService evaluationService;
    private ModelMapper modelMapper;

    public EvaluationsBusiness(EvaluationService evaluationService, ModelMapper modelMapper) {
        this.evaluationService = evaluationService;
        this.modelMapper = modelMapper;
    }


    // Validation Object


    // Find ALl
    public Page<EvaluationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
        Page<Evaluation> evaluationsPage = evaluationService.findAll(pageRequest);
        return evaluationsPage.map(evaluation -> modelMapper.map(evaluation, EvaluationDto.class));
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public EvaluationDto findById(Long id) {
        try {
            Evaluation evaluation = evaluationService.getById(id);
            return modelMapper.map(evaluation, EvaluationDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluation with ID " + id + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Find By Checklist Id - Relación 1:1
    public List<EvaluationDto> findByChecklistId(Long checklistId) {
        try {
            List<Evaluation> evaluations = evaluationService.findByChecklistId(checklistId);
            return evaluations.stream()
                    .map(evaluation -> modelMapper.map(evaluation, EvaluationDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluations for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Nuevo método para obtener la evaluación única de un checklist (relación 1:1)
    public EvaluationDto findEvaluationByChecklistId(Long checklistId) {
        try {
            Evaluation evaluation = evaluationService.findEvaluationByChecklistId(checklistId);
            return evaluation != null ? modelMapper.map(evaluation, EvaluationDto.class) : null;
        } catch (Exception e) {
            throw new CustomException("Error retrieving evaluation for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Verificar si existe evaluación para un checklist
    public boolean existsByChecklistId(Long checklistId) {
        try {
            return evaluationService.existsByChecklistId(checklistId);
        } catch (Exception e) {
            throw new CustomException("Error checking evaluation existence for checklist ID " + checklistId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public EvaluationDto add(EvaluationDto evaluationDto) {
        try {
            Evaluation evaluation = new Evaluation();
            EvaluationMap.INSTANCE.updateEvaluation(evaluationDto, evaluation);
            Evaluation savedEvaluation = evaluationService.save(evaluation);
            return EvaluationMap.INSTANCE.EntityToDTO(savedEvaluation);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("Error adding evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long evaluationId,  EvaluationDto evaluationDto) {
        try {
            // Obtener la evaluación existente del contexto de persistencia
            Evaluation existingEvaluation = evaluationService.getById(evaluationId);
            
            // Actualizar solo los campos necesarios manualmente para evitar problemas con el mapeo
            existingEvaluation.setObservations(evaluationDto.getObservations());
            existingEvaluation.setRecommendations(evaluationDto.getRecommendations());
            existingEvaluation.setValueJudgment(evaluationDto.getValueJudgment());
            
            // Guardar la evaluación actualizada
            evaluationService.update(existingEvaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error updating evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long evaluationId) {
        try {
            Evaluation evaluation = evaluationService.getById(evaluationId);
            evaluationService.delete(evaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting evaluation with ID " + evaluationId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
