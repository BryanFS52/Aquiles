package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Service.ImprovementPlanService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanBusiness {
    private final ImprovementPlanService improvementPlanService;
    private final ModelMapper modelMapper;

    public ImprovementPlanBusiness(ImprovementPlanService improvementPlanService, ModelMapper modelMapper) {
        this.improvementPlanService = improvementPlanService;
        this.modelMapper = modelMapper;
    }

    // Validation object

    // Find All
    public Page<ImprovementPlanDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findAll(pageRequest);

            System.out.println("Total Attendances: " + improvementPlanPage.getTotalElements());

            return improvementPlanPage.map(entity -> modelMapper.map(entity, ImprovementPlanDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvemenPlan due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvemenPlan.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ImprovementPlanDto findById(Long id) {
        try {
            ImprovementPlan improvementPlan = improvementPlanService.getById(id);
            return modelMapper.map(improvementPlan, ImprovementPlanDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ImprovementPlanDto add(ImprovementPlanDto improvementplanDto) {
        try {
            ImprovementPlan improvementPlan = modelMapper.map(improvementplanDto, ImprovementPlan.class);
            return modelMapper.map(improvementPlanService.save(improvementPlan), ImprovementPlanDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, ImprovementPlanDto improvementplanDto) {
        try {
            improvementplanDto.setId(id);
            ImprovementPlan improvementPlan = modelMapper.map( improvementplanDto, ImprovementPlan.class);
            improvementPlanService.save(improvementPlan);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long id) {
        try {
            ImprovementPlan improvementPlan = improvementPlanService.getById(id);
            improvementPlanService.delete(improvementPlan);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}