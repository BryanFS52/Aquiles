package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.FollowUpActionDto;
import com.api.aquilesApi.Entity.FollowUpAction;
import com.api.aquilesApi.Service.FollowUpActionService;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.modelmapper.ModelMapper;

@Component
public class FollowUpActionBusiness {

    private final FollowUpActionService followUpActionService;
    private final ModelMapper modelMapper = new ModelMapper();

    public FollowUpActionBusiness(FollowUpActionService followUpActionService) {
        this.followUpActionService = followUpActionService;
    }
    //Validation Object

    // Find All
    public Page<FollowUpActionDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<FollowUpAction> followUpsPage = followUpActionService.findAll(pageRequest);
            return followUpsPage.map(entity -> modelMapper.map(entity, FollowUpActionDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving followUps due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving followUps.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public FollowUpActionDto findById(Long id) {
        try {
            FollowUpAction followUpAction = followUpActionService.getById(id);
            return modelMapper.map(followUpAction, FollowUpActionDto.class);
        } catch (CustomException e) {
            throw e; //Exception Custom
        } catch (Exception e) {
            throw new CustomException("Error Getting FollowUp: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public FollowUpActionDto add(FollowUpActionDto followUpActionDto) {
        try {
            FollowUpAction followUpAction = new FollowUpAction();
            followUpAction.setName(followUpActionDto.getName());
            return modelMapper.map(followUpActionService.save(followUpAction), FollowUpActionDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public FollowUpActionDto update( Long id, FollowUpActionDto followUpActionDto) {
        try {
            FollowUpAction followUpAction = followUpActionService.getById(followUpActionDto.getId());
            followUpAction.setName(followUpActionDto.getName());
            return modelMapper.map(followUpActionService.save(followUpAction), FollowUpActionDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
