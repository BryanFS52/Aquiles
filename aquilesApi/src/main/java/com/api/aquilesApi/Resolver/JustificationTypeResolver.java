package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.JustificationTypeBusiness;
import com.api.aquilesApi.Dto.JustificationTypeDto;
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
public class JustificationTypeResolver {
    private final JustificationTypeBusiness justificationTypeBusiness;
    private final DataConvert dataConvert = new DataConvert();
    public JustificationTypeResolver(JustificationTypeBusiness justificationTypeBusiness) {
        this.justificationTypeBusiness = justificationTypeBusiness;
    }

    // FindAll JustificationTypes (GraphQL)
    @DgsQuery
    public Map<String, Object> allJustificationTypes(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<JustificationTypeDto> justificationtypeDtoPage = justificationTypeBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    justificationtypeDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    justificationtypeDtoPage.getTotalPages(),
                    page,
                    (int) justificationtypeDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById JustificationType (GraphQL)
    @DgsQuery
    public Map<String, Object> justificationTypeById(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            JustificationTypeDto justificationtypeDto = justificationTypeBusiness.findById(idLong);
            return ResponseHttpApi.responseHttpFindId(
                    justificationtypeDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new JustificationType (GraphQL)
    @DgsMutation
    public Map<String, Object> addJustificationType(@InputArgument(name = "input") JustificationTypeDto justificationtypeDto) {
        try {
            JustificationTypeDto justificationTypeDto1 = justificationTypeBusiness.add(justificationtypeDto);
            return ResponseHttpApi.responseHttpAction(
                    justificationTypeDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding JustificationType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update JustificationType (GraphQL)
    @DgsMutation
    public Map<String, Object> updateJustificationType(@InputArgument String id, @InputArgument (name = "input")JustificationTypeDto justificationtypeDto) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            justificationTypeBusiness.update(idLong, justificationtypeDto );
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating JustificationType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete JustificationType (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteJustificationType(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            justificationTypeBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting JustificationType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}