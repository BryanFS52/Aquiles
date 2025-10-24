package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ChecklistMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;


@Component
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private Checklist save;

    public ChecklistBusiness(ChecklistService checklistService) {
        this.checklistService = checklistService;
    }

    // Get all Checklists (Paginated)
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistPage = checklistService.findAll(pageRequest);
            return ChecklistMap.INSTANCE.EntityToDTOs(checklistPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving checklists due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist. " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Checklist by ID
    public ChecklistDto findById(Long id) {
        try {
            Checklist checklist = checklistService.getById(id);
            return ChecklistMap.INSTANCE.EntityToDTO(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add a new Checklist
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
         Checklist checklist = new Checklist();
         ChecklistMap.INSTANCE.updateChecklist(checklistDto, checklist);
            if (checklist.getItems() != null) {
                checklist.getItems().forEach(item -> item.setChecklist(checklist));
            }
         Checklist savedChecklist = checklistService.save(checklist);
         return ChecklistMap.INSTANCE.EntityToDTO(savedChecklist);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update an existing Checklist
    public void update(Long checklistId, ChecklistDto checklistDto) {
        try {
            checklistDto.setId(checklistId);
            Checklist checklist = checklistService.getById(checklistId);
            ChecklistMap.INSTANCE.updateChecklist(checklistDto, checklist);
            checklistService.save(checklist);
        } catch (Exception e) {
            throw new CustomException("Error Updating Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete Checklist by ID
    public void delete(Long checklistId) {
        try {
            Checklist checklist = checklistService.getById(checklistId);
            checklistService.delete(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}