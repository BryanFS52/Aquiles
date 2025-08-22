package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationStatusDto;
import com.api.aquilesApi.Entity.JustificationStatus;
import com.api.aquilesApi.Service.JustificationStatusService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class JustificationStatusBusiness {
    private final JustificationStatusService justificationStatusService;
    private final Util util;
    private final ModelMapper modelMapper;

    public JustificationStatusBusiness(JustificationStatusService justificationStatusService, Util util, ModelMapper modelMapper) {
        this.justificationStatusService = justificationStatusService;
        this.util = util;
        this.modelMapper = modelMapper;
    }

    // Validation object
    private void validationObject(JustificationStatusDto justificationStatusDto) throws CustomException {
        boolean isUpdate = justificationStatusDto.getId() != null;
        JustificationStatus existingStatus = null;
        if (isUpdate) {
            existingStatus = justificationStatusService.getById(justificationStatusDto.getId());
        }
        if (!isUpdate || Objects.equals( justificationStatusDto.getName() ,existingStatus.getName())) {
            if(justificationStatusService.existByName(justificationStatusDto.getName())) {
                throw new CustomException("Status Justification with name " + justificationStatusDto.getName() + " already exists", HttpStatus.BAD_REQUEST);
            }
        }
    }

    // FindAll
    public Page<JustificationStatusDto> findAll(int page, int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<JustificationStatus> justificationStatusPage = this.justificationStatusService.findAll(pageRequest);

            List<JustificationStatusDto> justificationStatusDtoList = justificationStatusPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, JustificationStatusDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(justificationStatusDtoList, pageRequest, justificationStatusPage.getTotalElements());
        } catch (Exception e){
            throw new CustomException("Error retrieving Status Justification" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public JustificationStatusDto findById(Long id) {
        try {
            JustificationStatus justificationStatus = this.justificationStatusService.getById(id);
            return modelMapper.map(justificationStatus, JustificationStatusDto.class);
        } catch (CustomException e) {
          throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Status :" + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    //Add
    public JustificationStatusDto add(JustificationStatusDto justificationStatusDto) {
        try {
            validationObject(justificationStatusDto);
            justificationStatusDto.setState(true);
            JustificationStatus justificationStatus = modelMapper.map(justificationStatusDto, JustificationStatus.class);
            return modelMapper.map(this.justificationStatusService.save(justificationStatus), JustificationStatusDto.class);
        } catch (Exception e) {
            throw new CustomException("Error Creating Status: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long justificationStatusId, JustificationStatusDto justificationStatusDto) {
        try {
            justificationStatusDto.setId(justificationStatusId);
            validationObject(justificationStatusDto);
            JustificationStatus justificationStatus = modelMapper.map(justificationStatusDto, JustificationStatus.class);
            this.justificationStatusService.save(justificationStatus);
        } catch (Exception e) {
            throw new CustomException("Error Updating Status Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long justificationStatusId) {
        try {
            JustificationStatus justificationStatus = justificationStatusService.getById(justificationStatusId);
            justificationStatusService.delete(justificationStatus);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Status Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
