package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanActivityBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanActivityDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanActivityResolver {
    private final ImprovementPlanActivityBusiness improvementPlanActivityBusiness;

    public ImprovementPlanActivityResolver(ImprovementPlanActivityBusiness improvementPlanActivityBusiness) {
        this.improvementPlanActivityBusiness = improvementPlanActivityBusiness;
    }

    // FindAll ImprovementPlanActivities (GraphQL)
    @DgsQuery
    public Map<String, Object> allImprovementPlanActivities(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanActivityDto> pageResult = improvementPlanActivityBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    pageResult.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    pageResult.getTotalPages(),
                    page,
                    (int) pageResult.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ImprovementPlanActivities: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Find ImprovementPlanActivity by ID (GraphQL)
    @DgsQuery
    public Map<String, Object> improvementPlanActivityById(@InputArgument Long id) {
        try {
            ImprovementPlanActivityDto improvementPlanActivityDto = improvementPlanActivityBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    improvementPlanActivityDto,
                    ResponseHttpApi.CODE_OK,
                    "Query ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ImprovementPlanActivity: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add ImprovementPlanActivity (GraphQL)
    @DgsMutation
    public Map<String, Object> addImprovementPlanActivity(@InputArgument(name = "input") ImprovementPlanActivityDto dto) {
        try {
            ImprovementPlanActivityDto improvementPlanActivityDto = improvementPlanActivityBusiness.add(dto);
            return ResponseHttpApi.responseHttpAction(
                    improvementPlanActivityDto.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding ImprovementPlanActivity: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update ImprovementPlanActivity (GraphQL)
    @DgsMutation
    public Map<String, Object> updateImprovementPlanActivity(@InputArgument Long id, @InputArgument(name = "input") ImprovementPlanActivityDto improvementPlanActivityDto) {
        try {
            improvementPlanActivityBusiness.update(id, improvementPlanActivityDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating ImprovementPlanActivity: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete ImprovementPlanActivity (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteImprovementPlanActivity(@InputArgument Long id) {
        try {
            improvementPlanActivityBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting ImprovementPlanActivity: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}