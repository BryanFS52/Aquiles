package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistQualificationDto;
import com.api.aquilesApi.Entity.ChecklistQualification;
import com.api.aquilesApi.Service.ChecklistQualificationService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ChecklistQualificationMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ChecklistQualificationBusiness {
    private final ChecklistQualificationService checklistQualificationService;

    public ChecklistQualificationBusiness(ChecklistQualificationService checklistQualificationService) {
        this.checklistQualificationService = checklistQualificationService;
    }

    // Validation object
    private void validationObject(ChecklistQualificationDto checklistQualificationDto) throws CustomException {

    }

    // Get all checklistQualifications (paginated)
    public Page<ChecklistQualificationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ChecklistQualification> checklistQualificationPage = checklistQualificationService.findAll(pageRequest);
            return ChecklistQualificationMap.INSTANCE.EntityToDTOs(checklistQualificationPage);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist qualifications."+ e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get checklistQualification by ID
    public ChecklistQualificationDto findById(Long id) {
        try {
            ChecklistQualification checklistQualification = checklistQualificationService.getById(id);
            return ChecklistQualificationMap.INSTANCE.EntityToDTO(checklistQualification);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the checklist qualification." + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add New ChecklistQualification
    public ChecklistQualificationDto add(ChecklistQualificationDto checklistQualificationDto) {
        try {
            ChecklistQualification checklistQualification = new ChecklistQualification();
            ChecklistQualificationMap.INSTANCE.updateChecklistQualification(checklistQualificationDto, checklistQualification);
            ChecklistQualification savedChecklistQualification = checklistQualificationService.save(checklistQualification);
            return ChecklistQualificationMap.INSTANCE.EntityToDTO(savedChecklistQualification);

        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing checklistQualification
    public void update(Long checklistQualificationId, ChecklistQualificationDto checklistQualificationDto) {
        try {
            checklistQualificationDto.setId(checklistQualificationId);
            ChecklistQualification checklistQualification = checklistQualificationService.getById( checklistQualificationId);
            ChecklistQualificationMap.INSTANCE.updateChecklistQualification(checklistQualificationDto, checklistQualification);
            checklistQualificationService.save(checklistQualification);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete checklistQualification
    public void delete(Long id) {
        try {
            ChecklistQualification checklistQualification = checklistQualificationService.getById(id);
            checklistQualificationService.delete(checklistQualification);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
