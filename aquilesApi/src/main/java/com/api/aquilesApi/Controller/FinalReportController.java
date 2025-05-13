package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.FinalReportBusiness;
import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class FinalReportController {
    private final FinalReportBusiness finalReportBusiness;

    public FinalReportController(FinalReportBusiness finalReportBusiness) {
        this.finalReportBusiness = finalReportBusiness;
    }

    // FindAll finalReports (GraphQL)
    @QueryMapping
    public Map<String, Object> allFinalReport(@Argument int page, @Argument int size) {
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
    @QueryMapping
    public Map<String, Object> finalReportById(@Argument Long id) {
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
    @MutationMapping
    public Map<String, Object> addFinalReport(@Argument("input") FinalReportDto finalreportDto) {
        try {
            FinalReportDto finalreportDto1 = finalReportBusiness.add(finalreportDto);
            return ResponseHttpApi.responseHttpAction(
                    finalreportDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding finalReport: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update finalReport (GraphQL)
    @MutationMapping
    public Map<String, Object> updateFinalReport(@Argument Long id, @Argument ("input")FinalReportDto finalreportDto) {
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
    @MutationMapping
    public Map<String, Object> deleteFinalReport(@Argument Long id) {
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
