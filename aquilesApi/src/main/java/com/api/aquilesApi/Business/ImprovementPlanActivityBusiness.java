package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanActivityDto;
import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import com.api.aquilesApi.Service.ImprovementPlanActivityService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanActivityBusiness {

    private final ImprovementPlanActivityService service;
    private final ModelMapper modelMapper;

    public ImprovementPlanActivityBusiness(ImprovementPlanActivityService service, ModelMapper modelMapper) {
        this.service = service;
        this.modelMapper = modelMapper;
    }

    public Page<ImprovementPlanActivityDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlanActivity> result = service.findAll(pageRequest);
            return result.map(entity -> modelMapper.map(entity, ImprovementPlanActivityDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving ImprovementPlanActivity: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ImprovementPlanActivityDto findById(Long id) {
        try {
            return modelMapper.map(service.getById(id), ImprovementPlanActivityDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error getting ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ImprovementPlanActivityDto add(ImprovementPlanActivityDto dto) {
        try {
            ImprovementPlanActivity entity = modelMapper.map(dto, ImprovementPlanActivity.class);
            return modelMapper.map(service.save(entity), ImprovementPlanActivityDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void update(Long id, ImprovementPlanActivityDto dto) {
        try {
            dto.setId(id);
            service.save(modelMapper.map(dto, ImprovementPlanActivity.class));
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long id) {
        try {
            service.delete(service.getById(id));
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
