package com.api.aquilesApi.Resolver;



import com.api.aquilesApi.Business.EvaluationsBusiness;
import com.api.aquilesApi.Dto.EvaluationsDto;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.*;
import lombok.RequiredArgsConstructor;
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
            Page<EvaluationsDto> evaluationsDtoPage = evaluationsBusiness.findAll(page, size);
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
            EvaluationsDto evaluationsDto = evaluationsBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    evaluationsDto,
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
    public Map<String, Object> addEvaluation(@InputArgument("input") EvaluationsDto input) {
        try {
            EvaluationsDto evaluationsDto = evaluationsBusiness.add(input);
            return ResponseHttpApi.responseHttpAction(
                    evaluationsDto.getId(),
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
    public Map<String, Object> updateEvaluation(@InputArgument("id") Long id, @InputArgument("input") EvaluationsDto input) {
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
