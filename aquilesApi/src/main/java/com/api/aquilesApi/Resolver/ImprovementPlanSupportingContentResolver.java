/*
package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanSupportingContentBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanSupportingContentDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanSupportingContentResolver {
    private final ImprovementPlanSupportingContentBusiness business;

    public ImprovementPlanSupportingContentResolver(ImprovementPlanSupportingContentBusiness business) {
        this.business = business;
    }

    @DgsQuery
    public Map<String, Object> allImprovementPlanSupportingContents(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanSupportingContentDto> pageResult = business.findAll(page, size);
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
                    "Error retrieving ImprovementPlanSupportingContents: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsQuery
    public Map<String, Object> improvementPlanSupportingContentById(@InputArgument Long id) {
        try {
            ImprovementPlanSupportingContentDto dto = business.findById(id);
            return ResponseHttpApi.responseHttpFindId(dto, ResponseHttpApi.CODE_OK, "Query by id ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ImprovementPlanSupportingContent: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> addImprovementPlanSupportingContent(@InputArgument(name = "input") ImprovementPlanSupportingContentDto dto) {
        try {
            ImprovementPlanSupportingContentDto saved = business.add(dto);
            return ResponseHttpApi.responseHttpAction(saved.getId(), ResponseHttpApi.CODE_OK, "Add ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding ImprovementPlanSupportingContent: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> updateImprovementPlanSupportingContent(@InputArgument Long id, @InputArgument(name = "input") ImprovementPlanSupportingContentDto dto) {
        try {
            business.update(id, dto);
            return ResponseHttpApi.responseHttpAction(id, ResponseHttpApi.CODE_OK, "Update ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating ImprovementPlanSupportingContent: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> deleteImprovementPlanSupportingContent(@InputArgument Long id) {
        try {
            business.delete(id);
            return ResponseHttpApi.responseHttpAction(id, ResponseHttpApi.CODE_OK, "Delete ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting ImprovementPlanSupportingContent: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
 */