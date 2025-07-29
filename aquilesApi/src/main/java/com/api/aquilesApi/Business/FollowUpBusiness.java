/*
package com.api.aquilesApi.Business;
 
import com.api.aquilesApi.Dto.StateFollowUpsDto;
import com.api.aquilesApi.Service.FollowUpService;
import com.api.aquilesApi.Entity.FollowUps;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.modelmapper.ModelMapper;

@Component
public class FollowUpBusiness {
    
private final FollowUpService followUpService;
private final ModelMapper modelMapper = new ModelMapper();

public FollowUpBusiness(FollowUpService followUpService) {
    this.followUpService = followUpService;
}
//Validation Object

// Find All
public Page<StateFollowUpsDto> findAll(int page, int size) {
    try {
        PageRequest pageRequest = PageRequest.of(page, size);
            Page<FollowUps> followUpsEntityPage = followUpService.findAll(pageRequest);

            System.out.println("Total FollowUps: " + followUpsEntityPage.getTotalElements());
            System.out.println("Total FollowUps: " + followUpsEntityPage);
            return followUpsEntityPage.map(entity -> modelMapper.map(entity, StateFollowUpsDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving followUps due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving followUps.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Find By ID
    public StateFollowUpsDto findById(Long id) {
        try {
            FollowUps followUps = followUpService.getById(id);
            return modelMapper.map(followUps, StateFollowUpsDto.class);
        } catch (CustomException e) {
            throw e; //Exception Custom
        } catch (Exception e) {
            throw new CustomException("Error Getting FollowUp: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Add
    public StateFollowUpsDto add(StateFollowUpsDto stateFollowUpsDto) {
        try {
            FollowUps followUpsEntity = new FollowUps();
            followUpsEntity.setName(stateFollowUpsDto.getName());
            return modelMapper.map(followUpService.save(followUpsEntity), StateFollowUpsDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

 */
