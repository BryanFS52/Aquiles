package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JuriesDto;
import com.api.aquilesApi.Entity.JuriesEntity;
import com.api.aquilesApi.Service.JuriesService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JuriesBusiness {
    private final JuriesService juriesService;
    private final ModelMapper modelMapper = new ModelMapper();

    public JuriesBusiness(JuriesService juriesService) {
        this.juriesService = juriesService;
    }
    // Validación Objeto

    // Find All
    public Page<JuriesDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<JuriesEntity> juriesEntityPage = juriesService.findAll(pageRequest);

            System.out.println("Total Juries: " + juriesEntityPage.getTotalElements());

            return juriesEntityPage.map(entity -> modelMapper.map(entity, JuriesDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving juries due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving juries.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public JuriesDto findById(Long id) {
        try {
            JuriesEntity juries = juriesService.getById(id);
            return modelMapper.map(juries, JuriesDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Juries: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public JuriesDto add(JuriesDto juriesDto) {
        try {
            JuriesEntity juriesEntity = modelMapper.map(juriesDto, JuriesEntity.class);
            return modelMapper.map(juriesService.save(juriesEntity), JuriesDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long juriesId, JuriesDto juriesDto) {
        try {
            juriesDto.setId(juriesId);
            JuriesEntity juries = modelMapper.map( juriesDto, JuriesEntity.class);
            juriesService.save(juries);
        } catch (Exception e) {
            throw new CustomException("Error Updating Juries: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long juriesId) {
        try {
            JuriesEntity juries = juriesService.getById(juriesId);
            juriesService.delete(juries);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Juries: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
