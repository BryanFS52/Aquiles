package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationStatusDto;
import com.api.aquilesApi.Entity.JustificationStatus;
import com.api.aquilesApi.Service.JustificationStatusService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.JustificationStatusMap;
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

    public JustificationStatusBusiness(JustificationStatusService justificationStatusService) {
        this.justificationStatusService = justificationStatusService;
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

    // Get all Justification Status (paginated)
    public Page<JustificationStatusDto> findAll(int page, int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<JustificationStatus> justificationStatusPage = justificationStatusService.findAll(pageRequest);
            return JustificationStatusMap.INSTANCE.EntityToDTOs(justificationStatusPage);

        } catch (Exception e){
            throw new CustomException("Error retrieving Status Justification" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Justification Status by ID
    public JustificationStatusDto findById(Long id) {
        try {
            JustificationStatus justificationStatus = this.justificationStatusService.getById(id);
            return JustificationStatusMap.INSTANCE.EntityToDTO(justificationStatus);
        } catch (CustomException e) {
          throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Status :" + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new Justification Status
    public JustificationStatusDto add(JustificationStatusDto justificationStatusDto) {
        try {
            validationObject(justificationStatusDto);
            JustificationStatus justificationStatus = new JustificationStatus();
            JustificationStatusMap.INSTANCE.updateJustificationStatus(justificationStatusDto, justificationStatus);
            JustificationStatus savedJustificationStatus = justificationStatusService.save(justificationStatus);
            return JustificationStatusMap.INSTANCE.EntityToDTO(savedJustificationStatus);
        } catch (Exception e) {
            throw new CustomException("Error Creating Status: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing JustificationStatus
    public void update(Long justificationStatusId, JustificationStatusDto justificationStatusDto) {
        try {
            justificationStatusDto.setId(justificationStatusId);
            validationObject(justificationStatusDto);
            JustificationStatus justificationStatus = justificationStatusService.getById(justificationStatusId);
            JustificationStatusMap.INSTANCE.updateJustificationStatus(justificationStatusDto, justificationStatus);
            justificationStatusService.save(justificationStatus);
        } catch (Exception e) {
            throw new CustomException("Error Updating Status Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete justification status by ID
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
