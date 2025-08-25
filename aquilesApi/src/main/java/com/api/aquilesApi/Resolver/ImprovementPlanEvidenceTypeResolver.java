package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanEvidenceTypeBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanEvidenceTypeDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanEvidenceTypeResolver {
    private final ImprovementPlanEvidenceTypeBusiness improvementPlanEvidenceTypeBusiness;

    public ImprovementPlanEvidenceTypeResolver(ImprovementPlanEvidenceTypeBusiness improvementPlanEvidenceTypeBusiness) {
        this.improvementPlanEvidenceTypeBusiness = improvementPlanEvidenceTypeBusiness;
    }

    @DgsQuery
    public Map<String, Object> allImprovementPlanEvidenceTypes(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanEvidenceTypeDto> pageResult = improvementPlanEvidenceTypeBusiness.findAll(page, size);
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
                    "Error retrieving ImprovementPlanEvidenceTypes: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsQuery
    public Map<String, Object> improvementPlanEvidenceTypeById(@InputArgument Long id) {
        try {
            ImprovementPlanEvidenceTypeDto dto = improvementPlanEvidenceTypeBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(dto, ResponseHttpApi.CODE_OK, "Query by id ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ImprovementPlanEvidenceType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> addImprovementPlanEvidenceType(@InputArgument(name = "input") ImprovementPlanEvidenceTypeDto dto) {
        try {
            ImprovementPlanEvidenceTypeDto saved = improvementPlanEvidenceTypeBusiness.add(dto);
            return ResponseHttpApi.responseHttpAction(saved.getId(), ResponseHttpApi.CODE_OK, "Add ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding ImprovementPlanEvidenceType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> updateImprovementPlanEvidenceType(@InputArgument Long id, @InputArgument(name = "input") ImprovementPlanEvidenceTypeDto dto) {
        try {
            improvementPlanEvidenceTypeBusiness.update(id, dto);
            return ResponseHttpApi.responseHttpAction(id, ResponseHttpApi.CODE_OK, "Update ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating ImprovementPlanEvidenceType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DgsMutation
    public Map<String, Object> deleteImprovementPlanEvidenceType(@InputArgument Long id) {
        try {
            improvementPlanEvidenceTypeBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(id, ResponseHttpApi.CODE_OK, "Delete ok");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting ImprovementPlanEvidenceType: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
