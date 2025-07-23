package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
@Component
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private final ModelMapper modelMapper;

    public ChecklistBusiness(ChecklistService checklistService, JuriesRepository juriesRepository, ModelMapper modelMapper) {
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
    }

    // Validation object
    public void validationObject(ChecklistDto checklistDto) throws CustomException {

    }

    // Find All
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistEntityPage = checklistService.findAll(pageRequest);

            System.out.println("Total Checklist: " + checklistEntityPage.getTotalElements());

            return checklistEntityPage.map(entity -> modelMapper.map(entity, ChecklistDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving checklist due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ChecklistDto findById(Long id) {
        try {
            Checklist checklist = checklistService.getById(id);
            return modelMapper.map(checklist, ChecklistDto.class);
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
            Checklist checklist = modelMapper.map(checklistDto, Checklist.class);
            return modelMapper.map(checklistService.save(checklist), ChecklistDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long attendanceId, ChecklistDto checklistDto) {
        try {
            checklistDto.setId(attendanceId);
            Checklist attendance = modelMapper.map( checklistDto, Checklist.class);
            checklistService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            Checklist checklist = checklistService.getById(attendanceId);
            checklistService.delete(checklist);
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}