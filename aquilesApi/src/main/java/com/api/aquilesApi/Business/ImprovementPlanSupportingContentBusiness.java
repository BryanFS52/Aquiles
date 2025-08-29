/*
package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanSupportingContentDto;
import com.api.aquilesApi.Service.ImprovementPlanSupportingContentService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanSupportingContentBusiness {

    private final ImprovementPlanSupportingContentService service;
    private final ModelMapper modelMapper;

    public ImprovementPlanSupportingContentBusiness(ImprovementPlanSupportingContentService service, ModelMapper modelMapper) {
        this.service = service;
        this.modelMapper = modelMapper;
    }

    public Page<ImprovementPlanSupportingContentDto> findAll(int page, int size) {
        try {
            return service.findAll(PageRequest.of(page, size))
                    .map(entity -> modelMapper.map(entity, ImprovementPlanSupportingContentDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving ImprovementPlanSupportingContent: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ImprovementPlanSupportingContentDto findById(Long id) {
        try {
            return modelMapper.map(service.getById(id), ImprovementPlanSupportingContentDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error getting ImprovementPlanSupportingContent: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ImprovementPlanSupportingContentDto add(ImprovementPlanSupportingContentDto dto) {
        try {
            return modelMapper.map(service.save(modelMapper.map(dto, ImprovementPlanSupportingContent.class)), ImprovementPlanSupportingContentDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void update(Long id, ImprovementPlanSupportingContentDto dto) {
        try {
            dto.setId(id);
            service.save(modelMapper.map(dto, ImprovementPlanSupportingContent.class));
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanSupportingContent: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long id) {
        try {
            service.delete(service.getById(id));
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanSupportingContent: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
 */
