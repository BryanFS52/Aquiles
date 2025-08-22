package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.EvaluationsDto;

import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;



@Component
public class EvaluationsBusiness {
    private EvaluationsService evaluationsService;
    private ModelMapper modelMapper;

    public EvaluationsBusiness(EvaluationsService evaluationsService, ModelMapper modelMapper) {
        this.evaluationsService = evaluationsService;
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

    // Find By Checklist Id
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

    // Add
    public EvaluationsDto add(EvaluationsDto evaluationsDto) {
        try {
            Evaluations evaluation = modelMapper.map(evaluationsDto, Evaluations.class);
            Evaluations savedEvaluation = evaluationsService.save(evaluation);
            return modelMapper.map(savedEvaluation, EvaluationsDto.class);
        } catch (Exception e) {
            throw new CustomException("Error adding evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long evaluationId,  EvaluationsDto evaluationsDto) {
        try {
            Evaluations evaluation = modelMapper.map(evaluationsDto, Evaluations.class);
            evaluationsService.update(evaluation);
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
