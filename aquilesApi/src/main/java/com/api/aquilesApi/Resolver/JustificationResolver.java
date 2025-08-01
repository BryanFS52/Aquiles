package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.JustificationBusiness;
import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class JustificationResolver {
    private final JustificationBusiness justificationBusiness;

    public JustificationResolver(JustificationBusiness justificationBusiness) {
        this.justificationBusiness = justificationBusiness;
    }

    // FindAll Justifications (GraphQL)
    @DgsQuery
    public Map<String, Object> allJustifications(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<JustificationDto> justificationDtoPage = justificationBusiness.findAll(page , size);
            return ResponseHttpApi.responseHttpFindAll(
                    justificationDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    justificationDtoPage.getTotalPages(),
                    page,
                    (int) justificationDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Justifications: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Justification (GraphQL)
    @DgsQuery
    public Map<String, Object> justificationById(@InputArgument Long id) {
        try {
            JustificationDto justificationDto = justificationBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    justificationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Justification: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Justification (GraphQL)
    @DgsMutation
    public Map<String, Object> addJustification(@InputArgument(name = "input") JustificationDto justificationDto) {
        try {
            // ✅ Log para debugging
            System.out.println("📤 Recibiendo justificación:");
            System.out.println("- Descripción: " + justificationDto.getDescription());
            System.out.println("- Fecha de ausencia recibida: " + justificationDto.getAbsenceDate());
            System.out.println("- Fecha de justificación recibida: " + justificationDto.getJustificationDate());
            
            JustificationDto result = justificationBusiness.add(justificationDto);
            
            System.out.println("✅ Justificación creada:");
            System.out.println("- ID: " + result.getId());
            System.out.println("- Fecha de ausencia guardada: " + result.getAbsenceDate());
            System.out.println("- Fecha de justificación guardada: " + result.getJustificationDate());
            
            return ResponseHttpApi.responseHttpAction(
                    result.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Justificación agregada exitosamente"
            );
        } catch (Exception e) {
            System.err.println("❌ Error al agregar justificación: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseHttpApi.responseHttpError(
                    "Error adding Justification: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Justification (GraphQL)
    @DgsMutation
    public Map<String, Object> updateJustification(@InputArgument Long id, @InputArgument (name = "input")JustificationDto justificationDto) {
        try {
            justificationBusiness.update(id, justificationDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Justification: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete Justification (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteJustification(@InputArgument Long id) {
        try {
            justificationBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Justification: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}