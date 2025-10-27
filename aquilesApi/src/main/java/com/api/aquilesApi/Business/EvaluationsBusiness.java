package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Entity.Evaluation;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.EvaluationMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;


@Component
public class EvaluationsBusiness {
   private final EvaluationsService evaluationsService;

    public EvaluationsBusiness(EvaluationsService evaluationsService) {
        this.evaluationsService = evaluationsService;
    }

    // Validation Object


    // Get all evaluations (Paginated)
    public Page<EvaluationsDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Evaluation> evaluationsPage = evaluationsService.findAll(pageRequest);
            return EvaluationMap.INSTANCE.EntityToDTOs(evaluationsPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Evaluation by ID
    public EvaluationsDto findById(Long id) {
        try {
            Evaluation evaluation = evaluationsService.getById(id);
            return EvaluationMap.INSTANCE.EntityToDTO(evaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new evaluation
    public EvaluationDto add(EvaluationDto evaluationDto) {
        try {
            Evaluation evaluation = new Evaluation();
            EvaluationMap.INSTANCE.updateEvaluation(evaluationDto, evaluation);
            Evaluation savedEvaluation = evaluationsService.save(evaluation);
            return EvaluationMap.INSTANCE.EntityToDTO(savedEvaluation);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing evaluation
    public void update(Long evaluationId, EvaluationDto evaluationDto) {
        try {
            evaluationDto.setId(evaluationId);
            Evaluation evaluation = evaluationsService.getById( evaluationId);
            EvaluationMap.INSTANCE.updateEvaluation(evaluationDto, evaluation);
            evaluationsService.save(evaluation);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete evaluation by ID
    public void delete(Long evaluationId) {
        try {
            Evaluation evaluation = evaluationsService.getById(evaluationId);
            evaluationsService.delete(evaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}