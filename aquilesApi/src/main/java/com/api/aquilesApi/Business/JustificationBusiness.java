package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Entity.AttendanceEntity;
import com.api.aquilesApi.Entity.JustificationEntity;
import com.api.aquilesApi.Entity.JustificationTypeEntity;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.JustificationService;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JustificationBusiness {
    private final JustificationService justificationService;
    private final AttendancesService attendancesService;
    private final JustificationTypeService justificationTypeService;
    private final ModelMapper modelMapper = new ModelMapper();

    public JustificationBusiness(JustificationService justificationService, AttendancesService attendancesService, JustificationTypeService justificationTypeService) {
        this.justificationService = justificationService;
        this.attendancesService = attendancesService;
        this.justificationTypeService = justificationTypeService;
    }
    // Validación Objeto


    // Find All
    public Page<JustificationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<JustificationEntity> justificationEntityPage = justificationService.findAll(pageRequest);

            System.out.println("Total Justifications: " + justificationEntityPage.getTotalElements());
            System.out.println("Total Justifications: " + justificationEntityPage);
            return justificationEntityPage.map(entity -> modelMapper.map(entity, JustificationDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving justifications due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving justifications.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public JustificationDto findById(Long id) {
        try {
            JustificationEntity justification = justificationService.getById(id);
            return modelMapper.map(justification, JustificationDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public JustificationDto add(JustificationDto justificationDto) {
        try {
            JustificationEntity justificationEntity = new JustificationEntity();
            justificationEntity.setJustificationDate(justificationDto.getJustificationDate());
            AttendanceEntity attendance = attendancesService.getById(justificationDto.getAttendance().getId());
            JustificationTypeEntity justificationType = justificationTypeService.getById(justificationDto.getJustificationTypeId().getId());
            justificationEntity.setAttendance(attendance);
            justificationEntity.setDescription(justificationDto.getDescription());
            justificationEntity.setJustificationFile(justificationDto.getJustificationFile());
            justificationEntity.setJustificationDate(justificationDto.getJustificationDate());
            justificationEntity.setState(justificationDto.getState());
            justificationEntity.setJustificationTypeId(justificationType);
            return modelMapper.map(justificationService.save(justificationEntity), JustificationDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    
    public void update(Long id, JustificationDto justificationDto) {
        try {
            justificationDto.setId(id);
            JustificationEntity attendance = modelMapper.map( justificationDto, JustificationEntity.class);
            justificationService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long id) {
        try {
            JustificationEntity justification = justificationService.getById(id);
            justificationService.delete(justification);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
