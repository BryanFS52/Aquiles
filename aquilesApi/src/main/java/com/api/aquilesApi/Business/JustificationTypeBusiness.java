package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationTypeDto;
import com.api.aquilesApi.Entity.JustificationTypeEntity;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JustificationTypeBusiness {
    private final JustificationTypeService justificationTypeService;
    private final ModelMapper modelMapper = new ModelMapper();

    public JustificationTypeBusiness(JustificationTypeService justificationTypeService) {
        this.justificationTypeService = justificationTypeService;
    }

    // Validación Objeto


    // Find All
    public Page<JustificationTypeDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<JustificationTypeEntity> justificationtypeEntityPage = justificationTypeService.findAll(pageRequest);

            System.out.println("Total Justifications Type: " + justificationtypeEntityPage.getTotalElements());

            return justificationtypeEntityPage.map(entity -> modelMapper.map(entity, JustificationTypeDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving justification due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving justification.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public JustificationTypeDto findById(Long id) {
        try {
            JustificationTypeEntity justificationType = justificationTypeService.getById(id);
            return modelMapper.map(justificationType, JustificationTypeDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting JustificationType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public JustificationTypeDto add(JustificationTypeDto justificationtypeDto) {
        try {
            JustificationTypeEntity justificationtypeEntity = modelMapper.map(justificationtypeDto, JustificationTypeEntity.class);
            return modelMapper.map(justificationTypeService.save(justificationtypeEntity), JustificationTypeDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, JustificationTypeDto justificationtypeDto) {
        try {
            justificationtypeDto.setId(id);
            JustificationTypeEntity justificationType = modelMapper.map( justificationtypeDto, JustificationTypeEntity.class);
            justificationTypeService.save(justificationType);
        } catch (Exception e) {
            throw new CustomException("Error Updating JustificationType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long id) {
        try {
            JustificationTypeEntity justificationType = justificationTypeService.getById(id);
            justificationTypeService.delete(justificationType);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting JustificationType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
