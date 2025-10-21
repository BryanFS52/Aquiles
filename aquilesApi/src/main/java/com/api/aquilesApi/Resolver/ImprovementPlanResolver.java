package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.Exception.BadRequestException;
import com.api.aquilesApi.Utilities.Exception.NotFoundException;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import java.util.Map;

@DgsComponent
public class ImprovementPlanResolver {

    private final ImprovementPlanBusiness improvementPlanBusiness;
    public ImprovementPlanResolver(ImprovementPlanBusiness improvementPlanBusiness) {
        this.improvementPlanBusiness = improvementPlanBusiness;
    }

    // FindAll ImprovementPlan (GraphQL)
    @DgsQuery
    public Map<String, Object> allImprovementPlans(@InputArgument Integer page, @InputArgument Integer size, @InputArgument Long teacherCompetence, @InputArgument Long id, @InputArgument Long studySheetId) {
        try {
            Page<ImprovementPlanDto> improvementPlanPage;
            if (id != null) {
                ImprovementPlanDto dto = improvementPlanBusiness.findById(id);
                return ResponseHttpApi.responseHttpFindAll(
                        java.util.List.of(dto),
                        ResponseHttpApi.CODE_OK,
                        "Query ok",
                        1,
                        page,
                        1
                );
            } else if (teacherCompetence != null) {
                improvementPlanPage = improvementPlanBusiness.findByFilter(page, size, teacherCompetence);
            } else {
                improvementPlanPage = improvementPlanBusiness.findAll(page, size);
            }
            if (!improvementPlanPage.isEmpty()) {
                return ResponseHttpApi.responseHttpFindAll(
                        improvementPlanPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Query ok",
                        improvementPlanPage.getTotalPages(),
                        page,
                        (int) improvementPlanPage.getTotalElements()
                );
            } else {
                throw new NotFoundException("No ImprovementPlans found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in allImprovementPlans: " + e.getMessage(), e);
        }
    }

    // FindById ImprovementPlan (GraphQL)
    @DgsQuery
    public Map<String, Object> improvementPlanById(@InputArgument Long id) {
        try {
            ImprovementPlanDto improvementplanDto = improvementPlanBusiness.findById(id);
            if (improvementplanDto == null) {
                throw new NotFoundException("ImprovementPlan not found for id: " + id);
            }
            return ResponseHttpApi.responseHttpFindId(
                    improvementplanDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in improvementPlanById: " + e.getMessage(), e);
        }
    }

    // Add a new ImprovementPlan (GraphQL)
    @DgsMutation
    public Map<String, Object> addImprovementPlan(@InputArgument(name = "input") ImprovementPlanDto improvementplanDto) {
        try {
            if (improvementplanDto == null) {
                throw new BadRequestException("ImprovementPlan input cannot be null");
            }
            ImprovementPlanDto improvementPlanDto1 = improvementPlanBusiness.add(improvementplanDto);
            return ResponseHttpApi.responseHttpAction(
            null,
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            throw new RuntimeException("Unexpected error in addImprovementPlan: " + e.getMessage(), e);
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
            throw new RuntimeException("Unexpected error in updateImprovementPlan: " + e.getMessage(), e);
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
            throw new RuntimeException("Unexpected error in deleteImprovementPlan: " + e.getMessage(), e);
        }
    }
}