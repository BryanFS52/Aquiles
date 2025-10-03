package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanActivityDto;
import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import com.api.aquilesApi.Service.ImprovementPlanActivityService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ImprovementPlanActivityMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanActivityBusiness {

    private final ImprovementPlanActivityService improvementPlanActivityService;

    public ImprovementPlanActivityBusiness(ImprovementPlanActivityService improvementPlanActivityService) {
        this.improvementPlanActivityService = improvementPlanActivityService;
    }

    // Get all improvementPlanActivity (Paginated)
    public Page<ImprovementPlanActivityDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlanActivity> improvementPlanActivityPage = improvementPlanActivityService.findAll(pageRequest);
            return ImprovementPlanActivityMap.INSTANCE.EntityToDTOs(improvementPlanActivityPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving ImprovementPlanActivity: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
        throw new CustomException("An unexpected error occurred while retrieving improvementPlanActivities.", HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }

    // Get improvementPlanActivity by ID
    public ImprovementPlanActivityDto findById(Long id) {
        try {
           ImprovementPlanActivity improvementPlanActivity = improvementPlanActivityService.getById(id);
           return ImprovementPlanActivityMap.INSTANCE.EntityToDTO(improvementPlanActivity);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error getting ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new improvementPlanActivity
    public ImprovementPlanActivityDto add(ImprovementPlanActivityDto improvementPlanActivityDto) {
        try {
           ImprovementPlanActivity improvementPlanActivity = new ImprovementPlanActivity();
           ImprovementPlanActivityMap.INSTANCE.updateImprovementPlanActivity(improvementPlanActivityDto, improvementPlanActivity);
           ImprovementPlanActivity savedImprovementPlanActivity = improvementPlanActivityService.save(improvementPlanActivity);
           return ImprovementPlanActivityMap.INSTANCE.EntityToDTO(savedImprovementPlanActivity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update improvementPlanActivity
    public void update(Long improvementPlanId, ImprovementPlanActivityDto improvementPlanActivityDto) {
        try {
            improvementPlanActivityDto.setId(improvementPlanId);
            ImprovementPlanActivity improvementPlanActivity = improvementPlanActivityService.getById(improvementPlanId);
            ImprovementPlanActivityMap.INSTANCE.updateImprovementPlanActivity(improvementPlanActivityDto, improvementPlanActivity);
            improvementPlanActivityService.save(improvementPlanActivity);
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete improvementPlanActivity by ID
    public void delete(Long improvementPlanId) {
        try {
            ImprovementPlanActivity improvementPlanActivity = improvementPlanActivityService.getById(improvementPlanId);
            improvementPlanActivityService.delete(improvementPlanActivity);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}