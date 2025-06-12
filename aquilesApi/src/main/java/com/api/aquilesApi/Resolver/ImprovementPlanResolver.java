package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanResolver {
    private final ImprovementPlanBusiness improvementPlanBusiness;
    public ImprovementPlanResolver(ImprovementPlanBusiness improvementPlanBusiness) {
        this.improvementPlanBusiness = improvementPlanBusiness;
    }

    // FindAll ImprovementPlan (GraphQL)
    @DgsQuery
    public Map<String, Object> allImprovementPlans(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanDto> improvementPlanPage = improvementPlanBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    improvementPlanPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    improvementPlanPage.getTotalPages(),
                    page,
                    (int) improvementPlanPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById ImprovementPlan (GraphQL)
    @DgsQuery
    public Map<String, Object> improvementPlanById(@InputArgument Long id) {
        try {
            ImprovementPlanDto improvementplanDto = improvementPlanBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    improvementplanDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new ImprovementPlan (GraphQL)
    @DgsMutation
    public Map<String, Object> addImprovementPlan(@InputArgument(name = "input") ImprovementPlanDto improvementplanDto) {
        try {
            ImprovementPlanDto improvementPlanDto1 = improvementPlanBusiness.add(improvementplanDto);
            return ResponseHttpApi.responseHttpAction(
                    improvementPlanDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding ImprovementPlan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update ImprovementPlan (GraphQL)
    @DgsMutation
    public Map<String, Object> updateImprovementPlan(@InputArgument Long id, @InputArgument (name = "input")ImprovementPlanDto improvementplanDto) {
        try {
            improvementPlanBusiness.update(id, improvementplanDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating ImprovementPlan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete ImprovementPlan (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteImprovementPlan(@InputArgument Long id) {
        try {
            improvementPlanBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting ImprovementPlan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
