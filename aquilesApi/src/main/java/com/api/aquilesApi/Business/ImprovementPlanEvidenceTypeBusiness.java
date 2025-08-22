package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanEvidenceTypeDto;
import com.api.aquilesApi.Entity.ImprovementPlanEvidenceType;
import com.api.aquilesApi.Service.ImprovementPlanEvidenceTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanEvidenceTypeBusiness {

    private final ImprovementPlanEvidenceTypeService service;
    private final ModelMapper modelMapper;

    public ImprovementPlanEvidenceTypeBusiness(ImprovementPlanEvidenceTypeService service, ModelMapper modelMapper) {
        this.service = service;
        this.modelMapper = modelMapper;
    }

    public Page<ImprovementPlanEvidenceTypeDto> findAll(int page, int size) {
        try {
            return service.findAll(PageRequest.of(page, size))
                    .map(entity -> modelMapper.map(entity, ImprovementPlanEvidenceTypeDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving ImprovementPlanEvidenceType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ImprovementPlanEvidenceTypeDto findById(Long id) {
        try {
            return modelMapper.map(service.getById(id), ImprovementPlanEvidenceTypeDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error getting ImprovementPlanEvidenceType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ImprovementPlanEvidenceTypeDto add(ImprovementPlanEvidenceTypeDto dto) {
        try {
            return modelMapper.map(service.save(modelMapper.map(dto, ImprovementPlanEvidenceType.class)), ImprovementPlanEvidenceTypeDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void update(Long id, ImprovementPlanEvidenceTypeDto dto) {
        try {
            dto.setId(id);
            service.save(modelMapper.map(dto, ImprovementPlanEvidenceType.class));
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanEvidenceType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long id) {
        try {
            service.delete(service.getById(id));
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanEvidenceType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
