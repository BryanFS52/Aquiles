package com.api.aquilesApi.Resolver;
import com.api.aquilesApi.Business.EvaluationsBusiness;
import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import java.util.Map;


@DgsComponent

public class EvaluationResolver {
    private final EvaluationsBusiness evaluationsBusiness;

    public EvaluationResolver(EvaluationsBusiness evaluationsBusiness) {
        this.evaluationsBusiness = evaluationsBusiness;
    }

    // Get all evaluations with pagination
    @DgsQuery
    public Map<String, Object> allEvaluations(@InputArgument("page") Integer page, @InputArgument("size") Integer size) {
        try {
            Page<EvaluationDto> evaluationsDtoPage = evaluationsBusiness.findAll(page, size);
            return ResponseHttpApi .responseHttpFindAll(
                    evaluationsDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    evaluationsDtoPage.getTotalPages(),
                    page,
                    (int) evaluationsDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving evaluations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get evaluation by ID
    @DgsQuery
    public Map<String, Object> evaluationById(@InputArgument("id") Long id) {
        try {
            EvaluationDto evaluationDto = evaluationsBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    evaluationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> addEvaluation(@InputArgument("input") EvaluationDto input) {
        try {
            EvaluationDto evaluationDto = evaluationsBusiness.add(input);
            return ResponseHttpApi.responseHttpAction(
                    evaluationDto.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Evaluation created successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error creating evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> updateEvaluation(@InputArgument("id") Long id, @InputArgument("input") EvaluationDto input) {
        try {
            evaluationsBusiness.update(id, input);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Evaluation updated successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> deleteEvaluation(@InputArgument Long id) {
        try {
            evaluationsBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Evaluation deleted successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Get evaluation by checklist and team scrum
    @DgsQuery
    public Map<String, Object> evaluationByChecklistAndTeam(
            @InputArgument("checklistId") Long checklistId,
            @InputArgument("teamScrumId") Long teamScrumId) {
        try {
            EvaluationDto evaluationDto = evaluationsBusiness.findByChecklistAndTeam(checklistId, teamScrumId);
            if (evaluationDto == null) {
                return ResponseHttpApi.responseHttpFindId(
                        null,
                        "404",
                        "No evaluation found for this checklist and team"
                );
            }
            return ResponseHttpApi.responseHttpFindId(
                    evaluationDto,
                    ResponseHttpApi.CODE_OK,
                    "Evaluation found successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving evaluation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
