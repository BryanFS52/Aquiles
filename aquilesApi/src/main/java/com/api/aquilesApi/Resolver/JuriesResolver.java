package com.api.aquilesApi.Resolver;
import com.api.aquilesApi.Business.JuriesBusiness;
import com.api.aquilesApi.Dto.JuriesDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.http.HttpStatus;
import java.util.Map;

@DgsComponent
public class JuriesResolver {
    private final JuriesBusiness juriesBusiness;

    public JuriesResolver(JuriesBusiness juriesBusiness) {
        this.juriesBusiness = juriesBusiness;
    }

    // FindAll Juries (GraphQL)
    @DgsQuery
    public Map<String, Object> allJuries(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<JuriesDto> juriesDtoPage = juriesBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    juriesDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    juriesDtoPage.getTotalPages(),
                    page,
                    (int) juriesDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Jury (GraphQL)
    @DgsQuery
    public Map<String, Object> juryById (@InputArgument Long id) {
        try {
            JuriesDto juriesDto = juriesBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    juriesDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Jury (GraphQL)
    @DgsMutation
    public Map<String, Object> addJury (@InputArgument( name = "input") JuriesDto juriesDto) {
        try {
            JuriesDto juriesDto1= juriesBusiness.add(juriesDto);
            return ResponseHttpApi.responseHttpAction(

                    juriesDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Jury: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Jury (GraphQL)
    @DgsMutation
    public Map<String, Object> updateJury (@InputArgument Long id, @InputArgument ( name = "input")JuriesDto juriesDto) {
        try {
            juriesBusiness.update(id, juriesDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Jury: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete Jury (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteJury (@InputArgument Long id) {
        try {
            juriesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Jury: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}