package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanEvaluationDto;
import com.api.aquilesApi.Entity.ImprovementPlanEvaluation;
import com.api.aquilesApi.Service.ImprovementPlanEvaluationService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ImprovementPlanEvaluationMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanEvaluationBusiness {
    private final ImprovementPlanEvaluationService improvementPlanEvaluationService;

    public ImprovementPlanEvaluationBusiness(ImprovementPlanEvaluationService improvementPlanEvaluationService) {
        this.improvementPlanEvaluationService = improvementPlanEvaluationService;
    }

    // Get all improvementPlanEvaluations (Paginated)
    public Page<ImprovementPlanEvaluationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlanEvaluation> improvementPlanEvaluationPage = improvementPlanEvaluationService.findAll(pageRequest);

            System.out.println("Total ImprovementPlanEvaluations: " + improvementPlanEvaluationPage.getTotalElements());

            return ImprovementPlanEvaluationMap.INSTANCE.EntityToDTOs(improvementPlanEvaluationPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvement plan evaluations due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvement plan evaluations.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlanEvaluation by ID
    public ImprovementPlanEvaluationDto findById(Long id) {
        try {
            ImprovementPlanEvaluation improvementPlanEvaluation = improvementPlanEvaluationService.getById(id);
            return ImprovementPlanEvaluationMap.INSTANCE.EntityToDto(improvementPlanEvaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Improvement Plan Evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlanEvaluation by ImprovementPlan ID
    public ImprovementPlanEvaluationDto findByImprovementPlanId(Long improvementPlanId) {
        try {
            ImprovementPlanEvaluation improvementPlanEvaluation = improvementPlanEvaluationService.findByImprovementPlanId(improvementPlanId)
                    .orElseThrow(() -> new CustomException(
                            "Improvement Plan Evaluation not found for ImprovementPlan ID: " + improvementPlanId,
                            HttpStatus.NO_CONTENT
                    ));
            return ImprovementPlanEvaluationMap.INSTANCE.EntityToDto(improvementPlanEvaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Improvement Plan Evaluation by ImprovementPlan ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new improvementPlanEvaluation
    public ImprovementPlanEvaluationDto add(ImprovementPlanEvaluationDto improvementPlanEvaluationDto) {
        try {
            ImprovementPlanEvaluation improvementPlanEvaluation = new ImprovementPlanEvaluation();
            ImprovementPlanEvaluationMap.INSTANCE.updateImprovementPlanEvaluation(improvementPlanEvaluationDto, improvementPlanEvaluation);
            ImprovementPlanEvaluation savedImprovementPlanEvaluation = improvementPlanEvaluationService.save(improvementPlanEvaluation);
            return ImprovementPlanEvaluationMap.INSTANCE.EntityToDto(savedImprovementPlanEvaluation);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing improvementPlanEvaluation
    public void update(Long improvementPlanEvaluationId, ImprovementPlanEvaluationDto improvementPlanEvaluationDto) {
        try {
            improvementPlanEvaluationDto.setId(improvementPlanEvaluationId);
            ImprovementPlanEvaluation improvementPlanEvaluation = improvementPlanEvaluationService.getById(improvementPlanEvaluationId);
            ImprovementPlanEvaluationMap.INSTANCE.updateImprovementPlanEvaluation(improvementPlanEvaluationDto, improvementPlanEvaluation);
            improvementPlanEvaluationService.update(improvementPlanEvaluation);
        } catch (Exception e) {
            throw new CustomException("Error Updating Improvement Plan Evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete improvementPlanEvaluation by ID
    public void delete(Long id) {
        try {
            ImprovementPlanEvaluation improvementPlanEvaluation = improvementPlanEvaluationService.getById(id);
            improvementPlanEvaluationService.delete(improvementPlanEvaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Improvement Plan Evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

