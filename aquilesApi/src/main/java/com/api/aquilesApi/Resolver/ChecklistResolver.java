package com.api.aquilesApi.Resolver;
import com.api.aquilesApi.Business.ChecklistBusiness;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Utilities.DataConvert;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import org.springframework.http.HttpStatus;
import java.util.Map;

@DgsComponent
public class ChecklistResolver {
    private final ChecklistBusiness checklistBusiness;
    private final DataConvert dataConvert = new DataConvert();
    public ChecklistResolver(ChecklistBusiness checklistBusiness) {
        this.checklistBusiness = checklistBusiness;
    }

    // FindAll Checklist (GraphQL)
    @DgsQuery
    public Map<String, Object> allChecklists(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ChecklistDto> checklistDtoPage = checklistBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    checklistDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    checklistDtoPage.getTotalPages(),
                    page,
                    (int) checklistDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Checklist (GraphQL)
    @DgsQuery
    public Map<String, Object> checklistById(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            ChecklistDto checklistDto = checklistBusiness.findById(idLong);
            return ResponseHttpApi.responseHttpFindId(
                    checklistDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Checklist (GraphQL)
    @DgsMutation
    public Map<String, Object> addChecklist(@InputArgument(name = "input") ChecklistDto checklistDto) {
        try {
            ChecklistDto checklistDto1 = checklistBusiness.add(checklistDto);
            return ResponseHttpApi.responseHttpAction(
                    checklistDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Checklist (GraphQL)
    @DgsMutation
    public Map<String, Object> updateChecklist(@InputArgument String id, @InputArgument (name = "input")ChecklistDto checklistDto) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            checklistBusiness.update(idLong, checklistDto );
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete Checklist (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteChecklist(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            checklistBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}