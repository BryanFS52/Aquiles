package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ChecklistBusiness;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Service.ChecklistHistoryService;
import com.api.aquilesApi.Service.ItemService;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.*;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@DgsComponent
public class ChecklistResolver {

    private final ChecklistBusiness checklistBusiness;
    private final ChecklistHistoryService checklistHistoryService;
    private final ItemService itemService;

    public ChecklistResolver(
        ChecklistBusiness checklistBusiness,
        ChecklistHistoryService checklistHistoryService,
        ItemService itemService
    ) {
        this.checklistBusiness = checklistBusiness;
        this.checklistHistoryService = checklistHistoryService;
        this.itemService = itemService;
    }

    // FindAll Checklist
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
                    "Error retrieving checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Checklist
    @DgsQuery
    public Map<String, Object> checklistById(@InputArgument Long id) {
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

    // Add
    @DgsMutation
    public Map<String, Object> addChecklist(@InputArgument(name = "input") ChecklistDto checklistDto) {
        try {
            ChecklistDto checklistDto1 = checklistBusiness.add(checklistDto);
            return ResponseHttpApi.responseHttpAction(
                    checklistDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
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
            return ResponseHttpApi.responseHttpError(
                    "Error updating Checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
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
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Checklist: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Export PDF
    @DgsQuery
    public String exportChecklistToPdf(@InputArgument Long id) {
        return checklistBusiness.exportChecklistPdf(id);
    }

    // Export Excel
    @DgsQuery
    public String exportChecklistToExcel(@InputArgument Long id) {
        return checklistBusiness.exportChecklistExcel(id);
    }

    // ✅ History Query
    @DgsQuery
    public List<ChecklistHistory> checklistHistoryById(@InputArgument("id") String id) {
        System.out.println("🔍 Buscando historial para id: " + id);
        Long checklistId = Long.parseLong(id);
        List<ChecklistHistory> result = checklistHistoryService.findByChecklistId(checklistId);
        System.out.println("📊 Encontrados " + result.size() + " registros de historial");
        return result;
    }

    // Update Item Status
    @DgsMutation
    public Map<String, Object> updateItemStatus(@InputArgument Long itemId, @InputArgument Boolean active) {
        try {
            itemService.updateStatus(itemId, active);
            return ResponseHttpApi.responseHttpAction(
                    itemId,
                    ResponseHttpApi.CODE_OK,
                    "Item status updated successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating item status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
