package com.api.aquilesApi.Resolver;



import com.api.aquilesApi.Business.EvaluationsBusiness;
import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;


@DgsComponent

public class EvaluationsResolver {
    private final EvaluationsBusiness evaluationsBusiness;

    public EvaluationsResolver(EvaluationsBusiness evaluationsBusiness) {
        this.evaluationsBusiness = evaluationsBusiness;
    }

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

    @DgsQuery
    public Map<String, Object> evaluationsByChecklist(@InputArgument("checklistId") Long checklistId) {
        try {
            List<EvaluationDto> evaluations = evaluationsBusiness.findByChecklistId(checklistId);
            return ResponseHttpApi.responseHttpFindAll(
                    evaluations,
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    1, // totalPages
                    0, // currentPage
                    evaluations.size() // totalElements
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving evaluations by checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Nuevo endpoint para obtener la evaluación única de un checklist (relación 1:1)
    @DgsQuery
    public Map<String, Object> evaluationByChecklist(@InputArgument("checklistId") Long checklistId) {
        try {
            EvaluationDto evaluation = evaluationsBusiness.findEvaluationByChecklistId(checklistId);
            if (evaluation != null) {
                return ResponseHttpApi.responseHttpFindId(
                        evaluation,
                        ResponseHttpApi.CODE_OK,
                        "Evaluation found for checklist"
                );
            } else {
                return ResponseHttpApi.responseHttpError(
                        "No evaluation found for checklist ID: " + checklistId, HttpStatus.NOT_FOUND
                );
            }
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving evaluation by checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Endpoint para verificar si existe evaluación para un checklist
    @DgsQuery
    public Map<String, Object> evaluationExistsForChecklist(@InputArgument("checklistId") Long checklistId) {
        try {
            boolean exists = evaluationsBusiness.existsByChecklistId(checklistId);
            return ResponseHttpApi.responseHttpFindId(
                    Map.of("exists", exists, "checklistId", checklistId),
                    ResponseHttpApi.CODE_OK,
                    exists ? "Evaluation exists for checklist" : "No evaluation found for checklist"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error checking evaluation existence: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
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

}
