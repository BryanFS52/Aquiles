package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationTypeDto;
import com.api.aquilesApi.Entity.JustificationType;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.JustificationTypeMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JustificationTypeBusiness {
    private final JustificationTypeService justificationTypeService;

    public JustificationTypeBusiness(JustificationTypeService justificationTypeService ) {
        this.justificationTypeService = justificationTypeService;
    }

    // Validation object
    private void validationObject(JustificationTypeDto justificationtypeDto) throws CustomException {

    }


    // Get all justificationTypes (paginated)
    public Page<JustificationTypeDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<JustificationType> justificationtypePage = justificationTypeService.findAll(pageRequest);

            System.out.println("Total Justifications Type: " + justificationtypePage.getTotalElements());

            return JustificationTypeMap.INSTANCE.EntityToDTOs(justificationtypePage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving justification due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving justification.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get justificationType by ID
    public JustificationTypeDto findById(Long id) {
        try {
            JustificationType justificationType = justificationTypeService.getById(id);
            return JustificationTypeMap.INSTANCE.EntityToDTO(justificationType);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting JustificationType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new justificationType
    public JustificationTypeDto add(JustificationTypeDto justificationtypeDto) {
        try {
            JustificationType justificationType = new JustificationType();
            JustificationTypeMap.INSTANCE.updateJustificationType(justificationtypeDto, justificationType);
            JustificationType savedJustificationType = justificationTypeService.save(justificationType);
            return JustificationTypeMap.INSTANCE.EntityToDTO(savedJustificationType);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update Existing justificationType
    public void update(Long id, JustificationTypeDto justificationtypeDto) {
        try {
            justificationtypeDto.setId(id);
            JustificationType justificationType = justificationTypeService.getById(id);
            JustificationTypeMap.INSTANCE.updateJustificationType(justificationtypeDto, justificationType);
            justificationTypeService.save(justificationType);
        } catch (Exception e) {
            throw new CustomException("Error Updating JustificationType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete justificationType by ID
    public void delete(Long id) {
        try {
            JustificationType justificationType = justificationTypeService.getById(id);
            justificationTypeService.delete(justificationType);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting JustificationType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
