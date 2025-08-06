package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Dto.JustificationStatusDto;
import com.api.aquilesApi.Dto.JustificationTypeDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.Justification;
import com.api.aquilesApi.Entity.JustificationType;
import com.api.aquilesApi.Entity.JustificationStatus;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.JustificationService;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Service.JustificationStatusService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class JustificationBusiness {
    private final JustificationService justificationService;
    private final AttendancesService attendancesService;
    private final JustificationTypeService justificationTypeService;
    private final JustificationStatusService justificationStatusService;
    private final ModelMapper modelMapper;

    public JustificationBusiness(JustificationService justificationService, AttendancesService attendancesService, JustificationTypeService justificationTypeService, JustificationStatusService justificationStatusService, ModelMapper modelMapper) {
        this.justificationService = justificationService;
        this.attendancesService = attendancesService;
        this.justificationTypeService = justificationTypeService;
        this.justificationStatusService = justificationStatusService;
        this.modelMapper = modelMapper;
    }

    // Validation Object
    public void ValidationObject(JustificationDto justificationDto) throws CustomException {
    }

    // Reusable method to map entity to Dto
    private JustificationDto mapToDto(Justification justification) {
        JustificationDto dto = modelMapper.map(justification, JustificationDto.class);
        dto.setAbsenceDate(justification.getFormattedAbsenceDate());
        dto.setJustificationDate(justification.getFormattedJustificationDate());

        if (justification.getJustificationStatus() != null) {
            dto.setJustificationStatus(modelMapper.map(justification.getJustificationStatus(), JustificationStatusDto.class));
        }

        if (justification.getAttendance() != null) {
            dto.setAttendance(modelMapper.map(justification.getAttendance(), AttendanceDto.class));
        }

        if (justification.getJustificationTypeId() != null) {
            dto.setJustificationType(modelMapper.map(justification.getJustificationTypeId(), JustificationTypeDto.class));
        }

        return dto;
    }

    // Find All
    public Page<JustificationDto> findAll(Integer page, Integer size) {
        try {
            // Validate and correct pagination parameters
            int validPage = (page != null && page >= 0) ? page : 0;
            int validSize = (size != null && size > 0) ? size : 10;

            PageRequest pageRequest = PageRequest.of(validPage, validSize);
            Page<Justification> justificationEntityPage = justificationService.findAll(pageRequest);
            return justificationEntityPage.map(this::mapToDto);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving justifications due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving justifications.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public JustificationDto findById(Long id) {
        try {
            Justification justification = justificationService.getById(id);
            return mapToDto(justification);
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

            if (justificationDto.getAbsenceDate() != null) {
                justification.setAbsenceDate(justificationDto.getAbsenceDate());
            }

            justification.setJustificationDate(LocalDate.now().toString());
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

            if (justificationDto.getJustificationStatus() != null && justificationDto.getJustificationStatus().getId() != null) {
                JustificationStatus justificationStatus = justificationStatusService.getById(justificationDto.getJustificationStatus().getId());
                justification.setJustificationStatus(justificationStatus);
            }

            Justification savedJustification = justificationService.save(justification);
            return mapToDto(savedJustification);
        } catch (Exception e) {
            throw new CustomException("Error Adding Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, JustificationDto justificationDto) {
        try {
//            System.out.println("🔄 JustificationBusiness.update - Datos recibidos:");
//            System.out.println("  ID: " + id);
//            System.out.println("  State: " + justificationDto.getState());
//            System.out.println("  JustificationStatus: " + justificationDto.getJustificationStatus());
//
//            if (justificationDto.getJustificationStatus() != null) {
//                System.out.println("  JustificationStatus ID: " + justificationDto.getJustificationStatus().getId());
//                System.out.println("  JustificationStatus Name: " + justificationDto.getJustificationStatus().getName());
//            }

            Justification existingJustification = justificationService.getById(id);

//            System.out.println("🔍 Estado actual en BD:");
//            System.out.println("  State: " + existingJustification.getState());
//            System.out.println("  JustificationStatus actual: " + existingJustification.getJustificationStatus());

            if (justificationDto.getAbsenceDate() != null) {
                existingJustification.setAbsenceDate(justificationDto.getAbsenceDate());
            }

            if (justificationDto.getJustificationDate() != null) {
                existingJustification.setJustificationDate(justificationDto.getJustificationDate());
            }

            if (justificationDto.getDescription() != null) {
                existingJustification.setDescription(justificationDto.getDescription());
            }

            if (justificationDto.getJustificationFile() != null) {
                existingJustification.setJustificationFile(justificationDto.getJustificationFile());
            }

            if (justificationDto.getState() != null) {
                existingJustification.setState(justificationDto.getState());
            }

            if (justificationDto.getAttendance() != null && justificationDto.getAttendance().getId() != null) {
                Attendance attendance = attendancesService.getById(justificationDto.getAttendance().getId());
                existingJustification.setAttendance(attendance);
            }

            if (justificationDto.getJustificationType() != null && justificationDto.getJustificationType().getId() != null) {
                JustificationType justificationType = justificationTypeService.getById(justificationDto.getJustificationType().getId());
                existingJustification.setJustificationTypeId(justificationType);
            }

            if (justificationDto.getJustificationStatus() != null && justificationDto.getJustificationStatus().getId() != null) {
                JustificationStatus justificationStatus = justificationStatusService.getById(justificationDto.getJustificationStatus().getId());
                existingJustification.setJustificationStatus(justificationStatus);
            }

            justificationService.save(existingJustification);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
//            System.out.println("❌ Error en update: " + e.getMessage());
//            e.printStackTrace();
            throw new CustomException("Error Updating Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long id) {
        try {
            Justification justification = justificationService.getById(id);
            justificationService.delete(justification);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
