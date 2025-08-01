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

import java.time.LocalDate;

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
    // Get all justifications with pagination
    public Page<JustificationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Justification> justificationEntityPage = justificationService.findAll(pageRequest);
            
            return justificationEntityPage.map(justification -> {
                JustificationDto dto = modelMapper.map(justification, JustificationDto.class);
                // ✅ Establecer fechas formateadas
                dto.setAbsenceDate(justification.getFormattedAbsenceDate());
                dto.setJustificationDate(justification.getFormattedJustificationDate());
                return dto;
            });
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
            
            // ✅ Establecer fecha de ausencia desde el DTO
            if (justificationDto.getAbsenceDate() != null) {
                justification.setAbsenceDate(justificationDto.getAbsenceDate());
            }
            
            // ✅ Establecer automáticamente la fecha de justificación al momento actual
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

            Justification savedJustification = justificationService.save(justification);
            
            // ✅ Mapear con fechas formateadas para el frontend
            JustificationDto result = modelMapper.map(savedJustification, JustificationDto.class);
            result.setAbsenceDate(savedJustification.getFormattedAbsenceDate());
            result.setJustificationDate(savedJustification.getFormattedJustificationDate());
            
            return result;
        } catch (Exception e) {
            throw new CustomException("Error Adding Justification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, JustificationDto justificationDto) {
        try {
            // ✅ Recuperar la entidad existente para preservar las relaciones
            Justification existingJustification = justificationService.getById(id);
            
            // ✅ Actualizar solo los campos que se proporcionan en el DTO
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

            // ✅ Actualizar relaciones solo si se proporcionan
            if (justificationDto.getAttendance() != null && justificationDto.getAttendance().getId() != null) {
                Attendance attendance = attendancesService.getById(justificationDto.getAttendance().getId());
                existingJustification.setAttendance(attendance);
            }

            if (justificationDto.getJustificationType() != null && justificationDto.getJustificationType().getId() != null) {
                JustificationType justificationType = justificationTypeService.getById(justificationDto.getJustificationType().getId());
                existingJustification.setJustificationTypeId(justificationType);
            }

            justificationService.save(existingJustification);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada existente
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
