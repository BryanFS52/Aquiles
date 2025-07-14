package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JuriesDto;
import com.api.aquilesApi.Entity.Juries;
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
    private final ModelMapper modelMapper;

    public JuriesBusiness(JuriesService juriesService, ModelMapper modelMapper) {
        this.juriesService = juriesService;
        this.modelMapper = modelMapper;
    }
    // Validation object

    // Find All
    public Page<JuriesDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Juries> juriesEntityPage = juriesService.findAll(pageRequest);

            System.out.println("Total Juries: " + juriesEntityPage.getTotalElements());
            return juriesEntityPage.map(entity -> modelMapper.map(entity, JuriesDto.class));

        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving juries due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving juries.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public JuriesDto findById(Long id) {
        try {
            Juries juries = juriesService.getById(id);
            return modelMapper.map(juries, JuriesDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Juries: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public JuriesDto add(JuriesDto juriesDto) {
        try {
            Juries juries = modelMapper.map(juriesDto, Juries.class);
            return modelMapper.map(juriesService.save(juries), JuriesDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long juriesId, JuriesDto juriesDto) {
        try {
            juriesDto.setId(juriesId);
            Juries juries = modelMapper.map( juriesDto, Juries.class);
            juriesService.save(juries);
        } catch (Exception e) {
            throw new CustomException("Error Updating Juries: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long juriesId) {
        try {
            Juries juries = juriesService.getById(juriesId);
            juriesService.delete(juries);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Juries: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
