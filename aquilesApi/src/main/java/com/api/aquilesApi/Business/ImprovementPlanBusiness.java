package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Entity.ImprovementPlanEntity;
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
    private final ModelMapper modelMapper = new ModelMapper();

    public ImprovementPlanBusiness(ImprovementPlanService improvementPlanService) {
        this.improvementPlanService = improvementPlanService;
    }

    // Find All
    public Page<ImprovementPlanDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlanEntity> improvementPlanPage = improvementPlanService.findAll(pageRequest);

            System.out.println("Total Attendances: " + improvementPlanPage.getTotalElements());

            return improvementPlanPage.map(entity -> modelMapper.map(entity, ImprovementPlanDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving improvemenPlan due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving improvemenPlan.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ImprovementPlanDto findById(Long id) {
        try {
            ImprovementPlanEntity improvementPlan = improvementPlanService.getById(id);
            return modelMapper.map(improvementPlan, ImprovementPlanDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ImprovementPlanDto add(ImprovementPlanDto improvementplanDto) {
        try {
            ImprovementPlanEntity improvementPlanEntity = modelMapper.map(improvementplanDto, ImprovementPlanEntity.class);
            return modelMapper.map(improvementPlanService.save(improvementPlanEntity), ImprovementPlanDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, ImprovementPlanDto improvementplanDto) {
        try {
            improvementplanDto.setId(id);
            ImprovementPlanEntity improvementPlan = modelMapper.map( improvementplanDto, ImprovementPlanEntity.class);
            improvementPlanService.save(improvementPlan);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long id) {
        try {
            ImprovementPlanEntity improvementPlan = improvementPlanService.getById(id);
            improvementPlanService.delete(improvementPlan);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}