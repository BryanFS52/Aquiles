package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.FinalReportBusiness;
import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Utilities.DataConvert;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class FinalReportController {
    private final FinalReportBusiness finalReportBusiness;
    private final DataConvert dataConvert = new DataConvert();
    public FinalReportController(FinalReportBusiness finalReportBusiness) {
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
    public Map<String, Object> finalReportById(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            FinalReportDto finalreportDto = finalReportBusiness.findById(idLong);
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
            // Convertir la firma base64 a byte[]
            if (finalreportDto.getSignature() != null && !finalreportDto.getSignature().isEmpty()) {
                // Decodificar la firma desde base64
                byte[] signatureBytes = java.util.Base64.getDecoder().decode(finalreportDto.getSignature());
                finalreportDto.setSignature(new String(signatureBytes));
            } else {
                throw new IllegalArgumentException("Signature is required");
            }
            // Llamar al servicio para agregar el reporte final
            FinalReportDto finalreportDto1 = finalReportBusiness.add(finalreportDto);
            // Respuesta exitosa
            return ResponseHttpApi.responseHttpAction(
                    finalreportDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            // Manejo de errores
            return ResponseHttpApi.responseHttpError(
                    "Error adding finalReport: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update finalReport (GraphQL)
    @DgsMutation
    public Map<String, Object> updateFinalReport(@InputArgument String id, @InputArgument (name = "input") FinalReportDto finalreportDto) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            finalReportBusiness.update(idLong, finalreportDto );
            return ResponseHttpApi.responseHttpAction(
                    idLong,
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
    public Map<String, Object> deleteFinalReport(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            finalReportBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
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
