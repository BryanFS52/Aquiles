package com.api.aquilesApi.Resolver;
/*
import com.api.aquilesApi.Business.ChecklistBusiness;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class ChecklistController {
    private final ChecklistBusiness checklistBusiness;

    public ChecklistController(ChecklistBusiness checklistBusiness) {
        this.checklistBusiness = checklistBusiness;
    }

    // FindAll Checklist (GraphQL)
    @QueryMapping
    public Map<String, Object> allChecklists(@Argument int page, @Argument int size) {
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
    @QueryMapping
    public Map<String, Object> checklistById(@Argument Long id) {
        try {
            ChecklistDto checklistDto = checklistBusiness.findById(id);
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
    @MutationMapping
    public Map<String, Object> addChecklist(@Argument("input") ChecklistDto checklistDto) {
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
    @MutationMapping
    public Map<String, Object> updateChecklist(@Argument Long id, @Argument ("input")ChecklistDto checklistDto) {
        try {
            checklistBusiness.update(id, checklistDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
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
    @MutationMapping
    public Map<String, Object> deleteChecklist(@Argument Long id) {
        try {
            checklistBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
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
}0
 */