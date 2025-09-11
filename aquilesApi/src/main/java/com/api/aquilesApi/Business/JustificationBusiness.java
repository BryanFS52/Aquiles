package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Entity.*;
import com.api.aquilesApi.Service.*;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.JustificationMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Component
public class JustificationBusiness {

    private final JustificationService justificationService;
    private final AttendancesService attendancesService;
    private final JustificationTypeService justificationTypeService;
    private final JustificationStatusService justificationStatusService;
    private final AttendanceStateService attendanceStateService;


    public JustificationBusiness(JustificationService justificationService, AttendancesService attendancesService, JustificationTypeService
            justificationTypeService, JustificationStatusService justificationStatusService, AttendanceStateService attendanceStateService) {
        this.justificationService = justificationService;
        this.attendancesService = attendancesService;
        this.justificationTypeService = justificationTypeService;
        this.justificationStatusService = justificationStatusService;
        this.attendanceStateService = attendanceStateService;

    }

   public Page<JustificationDto> findAll(Integer page, Integer size) {
        PageRequest pageRequest =  PageRequest.of(page, size);
        try {
            Page<Justification> justification = justificationService.findAll(pageRequest);
            System.out.println("JESUS");
            System.out.println(justification.getTotalElements());
            return JustificationMap.INSTANCE.EntityToDTOs(justification);

        } catch (Exception e) {
            System.err.println("EL DIABLO");
            System.err.println(e.getMessage());
            System.out.println(e.getMessage());
            e.printStackTrace();
            throw new CustomException("Database error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public JustificationDto findById(Long id) {
        try {
            Justification justification = justificationService.getById(id);
            return  JustificationMap.INSTANCE.EntityToDTO(justification);
        } catch (Exception e) {
            throw new CustomException("Justification error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By attendance by Student ID
    public List<JustificationDto> findByStudentId(Long studentId) {
        try {
            List<Justification> justifications = justificationService.findByStudentId(studentId);
            return  JustificationMap.INSTANCE.EntityToDTOs(justifications);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("Database error retrieving Justifications by Student ID: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add
    public JustificationDto add(JustificationDto dto) {
        try {

            Justification justification =  new Justification();
            JustificationMap.INSTANCE.updateEntity(dto, justification);

            Attendance attendance = attendancesService.getById(dto.getAttendance().getId());
            System.out.println(dto.getAttendance().getId());

            JustificationType justificationType = justificationTypeService.getById(dto.getJustificationType().getId());
            long daysBetween = ChronoUnit.DAYS.between(attendance.getAttendanceDate(), justification.getJustificationDate());

            if (daysBetween > 3) {
                throw new CustomException(
                    "La justificación no puede superar los 3 días desde la fecha de asistencia",
                    HttpStatus.BAD_REQUEST
                );
            }
            justification.setAttendance(attendance);
            justification.setJustificationType(justificationType);
            return JustificationMap.INSTANCE.EntityToDTO(justificationService.save(justification));
        } catch (Exception e) {

            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long id, JustificationDto dto) {

        Justification existing = justificationService.getById(id);
        JustificationMap.INSTANCE.updateEntity(dto, existing);
        existing.setId(existing.getId());
        justificationService.save(existing);
    }

    // Update Justification Status Only
    public void UpdateStatusInJustification(Long id, Long statusId) {
        try {

            Justification existing = justificationService.getById(id);
            JustificationStatus justificationStatus = justificationStatusService.getById(statusId);
            if (Objects.equals(justificationStatus.getName(), "Aceptado")){
                AttendanceState attendanceState = attendanceStateService.getById(3L);
                existing.getAttendance().setAttendanceState(attendanceState);
            }
//            if (Objects.equals(justificationStatus.getName(), "Denegado")){
//                AttendanceState attendanceState = stateAttendanceService.getById(4L);
//                existing.getAttendance().setAttendanceState(attendanceState);
//            }
            existing.setJustificationStatus(justificationStatus);
            justificationService.save(existing);

        } catch (CustomException e) {
            throw e;
        } catch (DataAccessException e) {
            throw new CustomException("Database error updating justification status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("Error updating justification status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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