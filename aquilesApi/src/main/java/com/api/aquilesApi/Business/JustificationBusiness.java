package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.Justification;
import com.api.aquilesApi.Entity.JustificationType;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.JustificationService;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JustificationBusiness {
    private final JustificationService justificationService;
    private final AttendancesService attendancesService;
    private final JustificationTypeService justificationTypeService;
    private final ModelMapper modelMapper;

    public JustificationBusiness(JustificationService justificationService, AttendancesService attendancesService, JustificationTypeService justificationTypeService, ModelMapper modelMapper) {
        this.justificationService = justificationService;
        this.attendancesService = attendancesService;
        this.justificationTypeService = justificationTypeService;
        this.modelMapper = modelMapper;
    }

    // Validation Object
    public void ValidationObject(JustificationDto justificationDto) throws  CustomException {

    }

    // Find All
    public Page<JustificationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Justification> justificationEntityPage = justificationService.findAll(pageRequest);

            return justificationEntityPage.map(entity -> modelMapper.map(entity, JustificationDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving justifications due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving justifications.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public JustificationDto findById(Long id) {
        try {
            Justification justification = justificationService.getById(id);
            return modelMapper.map(justification, JustificationDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public JustificationDto add(JustificationDto justificationDto) {
        try {
            Justification justification = new Justification();
            justification.setJustificationDate(justificationDto.getJustificationDate());
            Attendance attendance = attendancesService.getById(justificationDto.getAttendance().getId());
            JustificationType justificationType = justificationTypeService.getById(justificationDto.getJustificationType().getId());
            justification.setAttendance(attendance);
            justification.setDescription(justificationDto.getDescription());
            justification.setJustificationFile(justificationDto.getJustificationFile());
            justification.setJustificationDate(justificationDto.getJustificationDate());
            justification.setState(justificationDto.getState());
            justification.setJustificationTypeId(justificationType);
            return modelMapper.map(justificationService.save(justification), JustificationDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, JustificationDto justificationDto) {
        try {
            Justification justification = new Justification();
            justification.setId(id);
            justification.setJustificationDate(justificationDto.getJustificationDate());
            justification.setDescription(justificationDto.getDescription());
            justification.setJustificationFile(justificationDto.getJustificationFile());
            justification.setState(justificationDto.getState());

            if (justificationDto.getAttendance() != null) {
                Attendance attendance = attendancesService.getById(justificationDto.getAttendance().getId());
                justification.setAttendance(attendance);
            }

            if (justificationDto.getJustificationType() != null) {
                JustificationType justificationType = justificationTypeService.getById(justificationDto.getJustificationType().getId());
                justification.setJustificationTypeId(justificationType);
            }

            justificationService.save(justification);
        } catch (Exception e) {
            throw new CustomException("Error Updating Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long id) {
        try {
            Justification justification = justificationService.getById(id);
            justificationService.delete(justification);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
