package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanFaultTypeDto;
import com.api.aquilesApi.Entity.ImprovementPlanFaultType;
import com.api.aquilesApi.Service.ImprovementPlanFaultTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanFaultTypeBusiness {

    private final ImprovementPlanFaultTypeService service;
    private final ModelMapper modelMapper;

    public ImprovementPlanFaultTypeBusiness(ImprovementPlanFaultTypeService service, ModelMapper modelMapper) {
        this.service = service;
        this.modelMapper = modelMapper;
    }

    public Page<ImprovementPlanFaultTypeDto> findAll(int page, int size) {
        try {
            return service.findAll(PageRequest.of(page, size))
                    .map(entity -> modelMapper.map(entity, ImprovementPlanFaultTypeDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving ImprovementPlanFaultType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ImprovementPlanFaultTypeDto findById(Long id) {
        try {
            return modelMapper.map(service.getById(id), ImprovementPlanFaultTypeDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error getting ImprovementPlanFaultType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ImprovementPlanFaultTypeDto add(ImprovementPlanFaultTypeDto dto) {
        try {
            return modelMapper.map(service.save(modelMapper.map(dto, ImprovementPlanFaultType.class)), ImprovementPlanFaultTypeDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void update(Long id, ImprovementPlanFaultTypeDto dto) {
        try {
            dto.setId(id);
            service.save(modelMapper.map(dto, ImprovementPlanFaultType.class));
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanFaultType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long id) {
        try {
            service.delete(service.getById(id));
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanFaultType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
