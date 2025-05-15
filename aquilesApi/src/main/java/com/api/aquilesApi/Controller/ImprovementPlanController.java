package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.ImprovementPlanBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class ImprovementPlanController {
    private final ImprovementPlanBusiness improvementPlanBusiness;

    public ImprovementPlanController(ImprovementPlanBusiness improvementPlanBusiness) {
        this.improvementPlanBusiness = improvementPlanBusiness;
    }

    // FindAll ImprovementPlan (GraphQL)
    @QueryMapping
    public Map<String, Object> allImprovementPlans(@Argument int page, @Argument int size) {
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
    @QueryMapping
    public Map<String, Object> improvementPlanById(@Argument Long id) {
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
    @MutationMapping
    public Map<String, Object> addImprovementPlan(@Argument("input") ImprovementPlanDto improvementplanDto) {
        try {
            ImprovementPlanDto improvementplanDto1 = improvementPlanBusiness.add(improvementplanDto);
            return ResponseHttpApi.responseHttpAction(
                    improvementplanDto1.getId(),
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
    @MutationMapping
    public Map<String, Object> updateImprovementPlan(@Argument Long id, @Argument ("input")ImprovementPlanDto improvementplanDto) {
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
    @MutationMapping
    public Map<String, Object> deleteImprovementPlan(@Argument Long id) {
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
