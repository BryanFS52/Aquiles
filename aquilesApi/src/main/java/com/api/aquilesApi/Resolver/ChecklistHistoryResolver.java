package com.api.aquilesApi.Resolver;


import com.api.aquilesApi.Business.ChecklistHistoryBusiness;
import com.api.aquilesApi.Dto.ChecklistHistoryDTO;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent

public class ChecklistHistoryResolver {
    private final ChecklistHistoryBusiness checklistHistoryBusiness;

    public ChecklistHistoryResolver(ChecklistHistoryBusiness checklistHistoryBusiness) {
        this.checklistHistoryBusiness = checklistHistoryBusiness;
    }

    // FindAll Checklist History
    @DgsQuery
    public Map<String, Object> allChecklistHistory(@InputArgument("page") Integer page, @InputArgument("size") Integer size) {
        try {
            Page<ChecklistHistoryDTO> checklistHistoryDTOPage = checklistHistoryBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    checklistHistoryDTOPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    checklistHistoryDTOPage.getTotalPages(),
                    page,
                    (int) checklistHistoryDTOPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // Add a new Checklist History
    @DgsMutation
    public Map<String, Object> addChecklistHistory(@InputArgument(name = "input") ChecklistHistoryDTO checklistHistoryDTO) {
        try {
            ChecklistHistoryDTO savedChecklistHistory = checklistHistoryBusiness.add(checklistHistoryDTO);
            return ResponseHttpApi.responseHttpAction(
                    savedChecklistHistory.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Checklist History: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    // Update a Checklist History
    @DgsMutation
    public Map<String, Object> updateChecklistHistory(@InputArgument("id") Long id, @InputArgument("input") ChecklistHistoryDTO checklistHistoryDTO) {
        try {
            checklistHistoryBusiness.update(id, checklistHistoryDTO);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Checklist History: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    // Delete a Checklist History
    @DgsMutation
    public Map<String, Object> deleteChecklistHistory (@InputArgument Long id) {
        try {
            checklistHistoryBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Checklist History: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

