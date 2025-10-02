package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.FinalReportBusiness;
import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class FinalReportResolver {
    private final FinalReportBusiness finalReportBusiness;
    public FinalReportResolver(FinalReportBusiness finalReportBusiness) {
        this.finalReportBusiness = finalReportBusiness;
    }

    // FindAll finalReports (GraphQL)
    @DgsQuery
    public Map<String, Object> allFinalReports(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<FinalReportDto> finalreportDtoPage = finalReportBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    finalreportDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    finalreportDtoPage.getTotalPages(),
                    page,
                    (int) finalreportDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving finalReports: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById finalReport (GraphQL)
    @DgsQuery
    public Map<String, Object> finalReportById(@InputArgument Long id) {
        try {
            FinalReportDto finalreportDto = finalReportBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    finalreportDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving finalReports: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new finalReport (GraphQL)
    @DgsMutation
    public Map<String, Object> addFinalReport(@InputArgument( name = "input") FinalReportDto finalreportDto) {
        try {
            FinalReportDto finalReportDto1 = finalReportBusiness.add(finalreportDto);
            return ResponseHttpApi.responseHttpAction(
                    finalReportDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (CustomException e) {
            return ResponseHttpApi.responseHttpError(
                    e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding finalReport: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update finalReport (GraphQL)
    @DgsMutation
    public Map<String, Object> updateFinalReport(@InputArgument Long id, @InputArgument (name = "input") FinalReportDto finalreportDto) {
        try {
            finalReportBusiness.update(id, finalreportDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating finalReport: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete finalReport (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteFinalReport(@InputArgument Long id) {
        try {
            finalReportBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting finalReport: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}