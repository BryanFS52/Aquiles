package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Entity.Justification;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.JustificationService;
import com.api.aquilesApi.Service.JustificationStatusService;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Service.JustificationTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class JustificationBusiness {


    private final JustificationService justificationService;
    private final AttendancesService attendancesService;
    private final JustificationTypeService justificationTypeService;
    private final JustificationStatusService justificationStatusService;
    private final ModelMapper modelMapper;

    public JustificationBusiness(JustificationService justificationService, AttendancesService attendancesService, JustificationTypeService
            justificationTypeService, JustificationStatusService justificationStatusService, ModelMapper modelMapper) {
    public JustificationBusiness(JustificationService justificationService, AttendancesService attendancesService, JustificationTypeService
            justificationTypeService, JustificationStatusService justificationStatusService, ModelMapper modelMapper) {
        this.justificationService = justificationService;
        this.attendancesService = attendancesService;
        this.justificationTypeService = justificationTypeService;
        this.justificationStatusService = justificationStatusService;
        this.modelMapper = modelMapper;
    }

    // Validation Object
    public void ValidationObject(JustificationDto dto) {
        if (dto.getAbsenceDate() == null || dto.getAbsenceDate().isEmpty())
            throw new CustomException("Absence date is required", HttpStatus.BAD_REQUEST);

        if (dto.getAttendance() == null || dto.getAttendance().getId() == null)
            throw new CustomException("Attendance ID is required", HttpStatus.BAD_REQUEST);

        if (dto.getJustificationType() == null || dto.getJustificationType().getId() == null)
            throw new CustomException("Justification Type ID is required", HttpStatus.BAD_REQUEST);

        if (dto.getJustificationStatus() == null || dto.getJustificationStatus().getId() == null)
            throw new CustomException("Justification Status ID is required", HttpStatus.BAD_REQUEST);

        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty())
            throw new CustomException("Description is required", HttpStatus.BAD_REQUEST);
    }

    // Map Entity to DTO
    public void ValidationObject(JustificationDto dto) {
        if (dto.getAbsenceDate() == null || dto.getAbsenceDate().isEmpty())
            throw new CustomException("Absence date is required", HttpStatus.BAD_REQUEST);

        if (dto.getAttendance() == null || dto.getAttendance().getId() == null)
            throw new CustomException("Attendance ID is required", HttpStatus.BAD_REQUEST);

        if (dto.getJustificationType() == null || dto.getJustificationType().getId() == null)
            throw new CustomException("Justification Type ID is required", HttpStatus.BAD_REQUEST);

        if (dto.getJustificationStatus() == null || dto.getJustificationStatus().getId() == null)
            throw new CustomException("Justification Status ID is required", HttpStatus.BAD_REQUEST);

        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty())
            throw new CustomException("Description is required", HttpStatus.BAD_REQUEST);
    }

    // Map Entity to DTO
    private JustificationDto mapToDto(Justification justification) {
        JustificationDto dto = modelMapper.map(justification, JustificationDto.class);
        dto.setAbsenceDate(justification.getFormattedAbsenceDate());
        dto.setJustificationDate(justification.getFormattedJustificationDate());
        return dto;
    }

    // Build Entity from DTO
    private Justification buildJustificationFromDto(JustificationDto dto, boolean isNew) {
        Justification justification = new Justification();

        justification.setAbsenceDate(dto.getAbsenceDate());
        justification.setJustificationDate(isNew ? LocalDate.now().toString() : dto.getJustificationDate());
        justification.setDescription(dto.getDescription());
        justification.setState(dto.getState());

        Optional.ofNullable(dto.getJustificationFile()).ifPresent(file -> {
            try {
                justification.setJustificationFile(file.getBytes());
            } catch (Exception e) {
                throw new CustomException("Error processing file: " + e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        });

        justification.setAttendance(attendancesService.getById(dto.getAttendance().getId()));
        justification.setJustificationType(justificationTypeService.getById(dto.getJustificationType().getId()));
        justification.setJustificationStatus(justificationStatusService.getById(dto.getJustificationStatus().getId()));

        return justification;
    }

    // Build Entity from DTO
    private Justification buildJustificationFromDto(JustificationDto dto, boolean isNew) {
        Justification justification = new Justification();

        justification.setAbsenceDate(dto.getAbsenceDate());
        justification.setJustificationDate(isNew ? LocalDate.now().toString() : dto.getJustificationDate());
        justification.setDescription(dto.getDescription());
        justification.setState(dto.getState());

        Optional.ofNullable(dto.getJustificationFile()).ifPresent(file -> {
            try {
                justification.setJustificationFile(file.getBytes());
            } catch (Exception e) {
                throw new CustomException("Error processing file: " + e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        });

        justification.setAttendance(attendancesService.getById(dto.getAttendance().getId()));
        justification.setJustificationType(justificationTypeService.getById(dto.getJustificationType().getId()));
        justification.setJustificationStatus(justificationStatusService.getById(dto.getJustificationStatus().getId()));

        return justification;
    }

    // Find All
    public Page<JustificationDto> findAll(Integer page, Integer size) {
        int validPage = Optional.ofNullable(page).filter(p -> p >= 0).orElse(0);
        int validSize = Optional.ofNullable(size).filter(s -> s > 0).orElse(10);
        int validPage = Optional.ofNullable(page).filter(p -> p >= 0).orElse(0);
        int validSize = Optional.ofNullable(size).filter(s -> s > 0).orElse(10);

        try {
            return justificationService.findAll(PageRequest.of(validPage, validSize)).map(this::mapToDto);
        try {
            return justificationService.findAll(PageRequest.of(validPage, validSize)).map(this::mapToDto);
        } catch (DataAccessException e) {
            throw new CustomException("Database error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            throw new CustomException("Database error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public JustificationDto findById(Long id) {
        return mapToDto(justificationService.getById(id));
        return mapToDto(justificationService.getById(id));
    }

    // Add
    public JustificationDto add(JustificationDto dto) {
        ValidationObject(dto);
        Justification justification = buildJustificationFromDto(dto, true);
        return mapToDto(justificationService.save(justification));
    public JustificationDto add(JustificationDto dto) {
        ValidationObject(dto);
        Justification justification = buildJustificationFromDto(dto, true);
        return mapToDto(justificationService.save(justification));
    }

    // Update
    public void update(Long id, JustificationDto dto) {
        ValidationObject(dto);
        Justification existing = justificationService.getById(id);
        Justification updated = buildJustificationFromDto(dto, false);
        updated.setId(existing.getId());
        justificationService.save(updated);
    }

    // Update Justification Status Only
    public void updateJustificationStatus(Long id, Long statusId) {
        try {
            // Only validate that the justification exists and the status is valid
            if (id == null) {
                throw new CustomException("Justification ID is required", HttpStatus.BAD_REQUEST);
    public void update(Long id, JustificationDto dto) {
        ValidationObject(dto);
        Justification existing = justificationService.getById(id);
        Justification updated = buildJustificationFromDto(dto, false);
        updated.setId(existing.getId());
        justificationService.save(updated);
    }

    // Update Justification Status Only
    public void updateJustificationStatus(Long id, Long statusId) {
        try {
            // Only validate that the justification exists and the status is valid
            if (id == null) {
                throw new CustomException("Justification ID is required", HttpStatus.BAD_REQUEST);
            }
            if (statusId == null) {
                throw new CustomException("Status ID is required", HttpStatus.BAD_REQUEST);
            if (statusId == null) {
                throw new CustomException("Status ID is required", HttpStatus.BAD_REQUEST);
            }
            
            Justification existing = justificationService.getById(id);
            existing.setJustificationStatus(justificationStatusService.getById(statusId));
            justificationService.save(existing);
            
            Justification existing = justificationService.getById(id);
            existing.setJustificationStatus(justificationStatusService.getById(statusId));
            justificationService.save(existing);
        } catch (CustomException e) {
            throw e; // Re-throw custom exceptions
        } catch (DataAccessException e) {
            throw new CustomException("Database error updating justification status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            throw e; // Re-throw custom exceptions
        } catch (DataAccessException e) {
            throw new CustomException("Database error updating justification status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("Error updating justification status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            throw new CustomException("Error updating justification status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete
    public void delete(Long id) {
        justificationService.delete(justificationService.getById(id));
    }
    
    // Find justifications by study sheet ID
    public List<JustificationDto> findByStudySheetId(Long studySheetId) {
        try {
            List<Justification> justifications = justificationService.findByStudySheetId(studySheetId);
            return justifications.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error finding justifications by study sheet: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
