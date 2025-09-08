package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Repository.ItemTypeRepository;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.ChecklistExportService;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Service.ItemService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.List;

@Service
public class ChecklistBusiness {
    private final ChecklistService checklistService;
    private final ModelMapper modelMapper;

    public ChecklistBusiness(ChecklistService checklistService, ModelMapper modelMapper) {
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
    }

    // Validation Object
    private void validationObject(ChecklistDto checklistDto) throws CustomException {

    }

    // Get all checklists (paginated)
    public Page<ChecklistDto> findAll(int page, int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistPage = checklistService.findAll(pageRequest);

            return checklistPage.map(checklist -> modelMapper.map(checklist, ChecklistDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get checklist by ID
    public ChecklistDto findById(Long id){
        try {
            Checklist checklist = checklistService.getById(id);
            return modelMapper.map(checklist, ChecklistDto.class);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new checklist
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
            Checklist checklist = new Checklist();

            return modelMapper.map(checklistService.save(checklist), ChecklistDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing checklist
    public void update (Long checklistId, ChecklistDto checklistDto) {
        try {
            checklistDto.setId(checklistId);
            Checklist checklist = modelMapper.map(checklistDto, Checklist.class);
            checklistService.save(checklist);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete checklist
    public void delete(Long checklistId) {
        try {
            Checklist checklist = checklistService.getById(checklistId);
            checklistService.delete(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}