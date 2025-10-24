package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ChecklistBusiness;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.Exception.BadRequestException;
import com.api.aquilesApi.Utilities.Exception.NotFoundException;
import com.netflix.graphql.dgs.*;
import org.springframework.data.domain.Page;

import java.util.Map;

@DgsComponent
public class ChecklistResolver {

    private final ChecklistBusiness checklistBusiness;

    public ChecklistResolver(
            ChecklistBusiness checklistBusiness) {
        this.checklistBusiness = checklistBusiness;
    }

    // FindAll Checklist
    @DgsQuery
    public Map<String, Object> allChecklists(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ChecklistDto> checklistDtoPage = checklistBusiness.findAll(page, size);
            if (!checklistDtoPage.isEmpty()) {
                return ResponseHttpApi.responseHttpFindAll(
                        checklistDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Query ok",
                        checklistDtoPage.getTotalPages(),
                        page,
                        (int) checklistDtoPage.getTotalElements()
                );
            } else {
                throw new NotFoundException("No Checklists found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in allChecklists: " + e.getMessage(), e);
        }
    }

    // FindById Checklist
    @DgsQuery
    public Map<String, Object> checklistById(@InputArgument Long id) {
        try {
            ChecklistDto checklistDto = checklistBusiness.findById(id);
            if (checklistDto == null) {
                throw new NotFoundException("Checklist not found for id: " + id);
            }
            return ResponseHttpApi.responseHttpFindId(
                    checklistDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in checklistById: " + e.getMessage(), e);
        }
    }

    // Add
    @DgsMutation
    public Map<String, Object> addChecklist(@InputArgument(name = "input") ChecklistDto checklistDto) {
        try {
            if (checklistDto == null) {
                throw new BadRequestException("Checklist input cannot be null");
            }
            ChecklistDto checklistDto1 = checklistBusiness.add(checklistDto);
            return ResponseHttpApi.responseHttpAction(
                    checklistDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in addChecklist: " + e.getMessage(), e);
        }
    }

    // Update
    @DgsMutation
    public Map<String, Object> updateChecklist(@InputArgument Long id, @InputArgument(name = "input") ChecklistDto checklistDto) {
        try {
            checklistBusiness.update(id, checklistDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in updateChecklist: " + e.getMessage(), e);
        }
    }

    // Delete
    @DgsMutation
    public Map<String, Object> deleteChecklist(@InputArgument Long id) {
        try {
            checklistBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in deleteChecklist: " + e.getMessage(), e);
        }
    }
}