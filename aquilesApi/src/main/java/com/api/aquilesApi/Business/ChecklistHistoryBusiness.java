package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistHistoryDTO;
import com.api.aquilesApi.Entity.ChecklistHistory;
import com.api.aquilesApi.Service.ChecklistHistoryService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ChecklistHistoryBusiness {
    private ChecklistHistoryService checklistHistoryService;
    private ModelMapper modelMapper;

    public ChecklistHistoryBusiness(ChecklistHistoryService checklistHistoryService, ModelMapper modelMapper) {
        this.checklistHistoryService = checklistHistoryService;
        this.modelMapper = modelMapper;
    }
    //validation object


    //find all

    public Page<ChecklistHistoryDTO> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ChecklistHistory> checklistHistoryPage = checklistHistoryService.findAll(pageRequest);
            return checklistHistoryPage.map(checklistHistory -> modelMapper.map(checklistHistory, ChecklistHistoryDTO.class));
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //find by id
    public ChecklistHistoryDTO findById(Long id) {
        try {
            ChecklistHistory checklistHistory = checklistHistoryService.getById(id);
            return modelMapper.map(checklistHistory, ChecklistHistoryDTO.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error retrieving checklist history with ID " + id + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    //add
    public ChecklistHistoryDTO add(ChecklistHistoryDTO checklistHistoryDTO) {
        try {
            ChecklistHistory checklistHistory = modelMapper.map(checklistHistoryDTO, ChecklistHistory.class);
            checklistHistory = checklistHistoryService.add(checklistHistory);
            return modelMapper.map(checklistHistory, ChecklistHistoryDTO.class);
        } catch (Exception e) {
            throw new CustomException("Error adding checklist history: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //update
    public void update(Long ChecklistHistoryId, ChecklistHistoryDTO checklistHistoryDTO) {
        try {
            ChecklistHistory checklistHistory = modelMapper.map(checklistHistoryDTO, ChecklistHistory.class);
            checklistHistory.setId(checklistHistory.getId());
            checklistHistoryService.update(checklistHistory);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error updating checklist history with ID " + ChecklistHistoryId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    //delete
    public void delete(Long checklistHistoryId) {
        try {
            ChecklistHistory checklistHistory = checklistHistoryService.getById(checklistHistoryId);
            checklistHistoryService.delete(checklistHistory);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting checklist history with ID " + checklistHistoryId + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
