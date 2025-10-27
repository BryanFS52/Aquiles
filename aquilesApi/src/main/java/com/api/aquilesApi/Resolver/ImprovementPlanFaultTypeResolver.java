package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanFaultTypeBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanFaultTypeDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanFaultTypeResolver {
    private final ImprovementPlanFaultTypeBusiness business;

    public ImprovementPlanFaultTypeResolver(ImprovementPlanFaultTypeBusiness business) {
        this.business = business;
    }

    @DgsQuery
    public Map<String, Object> allImprovementPlanFaultTypes(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanFaultTypeDto> pageResult = business.findAll(page, size);
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
                    "Error retrieving ImprovementPlanFaultTypes: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsQuery
    public Map<String, Object> improvementPlanFaultTypeById(@InputArgument Long id) {
        try {
            ImprovementPlanFaultTypeDto dto = business.findById(id);
            return ResponseHttpApi.responseHttpFindId(dto, ResponseHttpApi.CODE_OK, "Query by id ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ImprovementPlanFaultType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> addImprovementPlanFaultType(@InputArgument(name = "input") ImprovementPlanFaultTypeDto dto) {
        try {
            ImprovementPlanFaultTypeDto saved = business.add(dto);
            return ResponseHttpApi.responseHttpAction(saved.getId(), ResponseHttpApi.CODE_OK, "Add ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding ImprovementPlanFaultType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> updateImprovementPlanFaultType(@InputArgument Long id, @InputArgument(name = "input") ImprovementPlanFaultTypeDto dto) {
        try {
            business.update(id, dto);
            return ResponseHttpApi.responseHttpAction(id, ResponseHttpApi.CODE_OK, "Update ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating ImprovementPlanFaultType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> deleteImprovementPlanFaultType(@InputArgument Long id) {
        try {
            business.delete(id);
            return ResponseHttpApi.responseHttpAction(id, ResponseHttpApi.CODE_OK, "Delete ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting ImprovementPlanFaultType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}