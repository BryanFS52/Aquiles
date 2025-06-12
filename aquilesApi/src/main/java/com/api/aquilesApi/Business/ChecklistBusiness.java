package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.ChecklistEntity;
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
    private final ModelMapper modelMapper = new ModelMapper();

    public ChecklistBusiness(ChecklistService checklistService, JuriesRepository juriesRepository) {
        this.checklistService = checklistService;
    }

    // Validación Objeto

    // Find All
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ChecklistEntity> checklistEntityPage = checklistService.findAll(pageRequest);

            System.out.println("Total Checklist: " + checklistEntityPage.getTotalElements());

            return checklistEntityPage.map(entity -> modelMapper.map(entity, ChecklistDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving checklist due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving checklist.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ChecklistDto findById(Long id) {
        try {
            ChecklistEntity checklist = checklistService.getById(id);
            return modelMapper.map(checklist, ChecklistDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
            ChecklistEntity checklistEntity = modelMapper.map(checklistDto, ChecklistEntity.class);
            return modelMapper.map(checklistService.save(checklistEntity), ChecklistDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long attendanceId, ChecklistDto checklistDto) {
        try {
            checklistDto.setId(attendanceId);
            ChecklistEntity attendance = modelMapper.map( checklistDto, ChecklistEntity.class);
            checklistService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            ChecklistEntity checklist = checklistService.getById(attendanceId);
            checklistService.delete(checklist);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}