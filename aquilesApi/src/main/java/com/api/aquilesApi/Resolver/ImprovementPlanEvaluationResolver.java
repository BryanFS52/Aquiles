package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanEvaluationBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanEvaluationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanEvaluationResolver {

    private final ImprovementPlanEvaluationBusiness improvementPlanEvaluationBusiness;

    public ImprovementPlanEvaluationResolver(ImprovementPlanEvaluationBusiness improvementPlanEvaluationBusiness) {
        this.improvementPlanEvaluationBusiness = improvementPlanEvaluationBusiness;
    }

    // FindAll ImprovementPlanEvaluation (GraphQL)
    @DgsQuery
    public Map<String, Object> allImprovementPlanEvaluations(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanEvaluationDto> improvementPlanEvaluationPage = improvementPlanEvaluationBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    improvementPlanEvaluationPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    improvementPlanEvaluationPage.getTotalPages(),
                    page,
                    (int) improvementPlanEvaluationPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving improvement plan evaluations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById ImprovementPlanEvaluation (GraphQL)
    @DgsQuery
    public Map<String, Object> improvementPlanEvaluationById(@InputArgument Long id) {
        try {
            ImprovementPlanEvaluationDto improvementPlanEvaluationDto = improvementPlanEvaluationBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    improvementPlanEvaluationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving improvement plan evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // FindByImprovementPlanId (GraphQL)
    @DgsQuery
    public Map<String, Object> improvementPlanEvaluationByImprovementPlanId(@InputArgument Long improvementPlanId) {
        try {
            ImprovementPlanEvaluationDto improvementPlanEvaluationDto = improvementPlanEvaluationBusiness.findByImprovementPlanId(improvementPlanId);
            return ResponseHttpApi.responseHttpFindId(
                    improvementPlanEvaluationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by improvement plan id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving improvement plan evaluation by improvement plan id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new ImprovementPlanEvaluation (GraphQL)
    @DgsMutation
    public Map<String, Object> addImprovementPlanEvaluation(@InputArgument(name = "input") ImprovementPlanEvaluationDto improvementPlanEvaluationDto) {
        try {
            ImprovementPlanEvaluationDto savedDto = improvementPlanEvaluationBusiness.add(improvementPlanEvaluationDto);
            return ResponseHttpApi.responseHttpAction(
                    savedDto.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding improvement plan evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update ImprovementPlanEvaluation (GraphQL)
    @DgsMutation
    public Map<String, Object> updateImprovementPlanEvaluation(@InputArgument Long id, @InputArgument(name = "input") ImprovementPlanEvaluationDto improvementPlanEvaluationDto) {
        try {
            improvementPlanEvaluationBusiness.update(id, improvementPlanEvaluationDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating improvement plan evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete ImprovementPlanEvaluation (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteImprovementPlanEvaluation(@InputArgument Long id) {
        try {
            improvementPlanEvaluationBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting improvement plan evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

