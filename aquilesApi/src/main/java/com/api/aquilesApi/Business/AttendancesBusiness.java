package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.StateAttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AttendancesBusiness {

    private final AttendancesService attendancesService;
    private final StateAttendanceService stateAttendanceService;
    private final ModelMapper modelMapper;

    public AttendancesBusiness(
            AttendancesService attendancesService,
            StateAttendanceService stateAttendanceService,
            Util util,
            ModelMapper modelMapper
    ) {
        this.attendancesService = attendancesService;
        this.stateAttendanceService = stateAttendanceService;
        this.modelMapper = modelMapper;
    }

    // Validation Object
    private void validationObject(TeamsScrumDto teamsScrumDto) throws CustomException {

    }


    // Get all attendances (paginated)
    public Page<AttendanceDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Attendance> attendancesPage = attendancesService.findAll(pageRequest);

            return attendancesPage.map(entity -> modelMapper.map(entity, AttendanceDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get attendance by ID
    public AttendanceDto findById(Long id) {
        try {
            Attendance attendance = attendancesService.getById(id);
            return modelMapper.map(attendance, AttendanceDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get attendances by student ID
    public List<AttendanceDto> findAllByStudentId(Long studentId) {
        try {
            List<Attendance> attendanceList = attendancesService.findAllByStudentId(studentId);
            return attendanceList.stream()
                    .map(entity -> modelMapper.map(entity, AttendanceDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get filtered attendances (student and state)
    public Page<AttendanceDto> findAllByStudentId(Long studentId, Long idState, Pageable pageable) {
        try {
            Page<Attendance> attendancePage = attendancesService.findAllByFilter(studentId, idState, pageable);
            return attendancePage.map(entity -> modelMapper.map(entity, AttendanceDto.class));
        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add new attendance
    public AttendanceDto add(AttendanceDto attendancesDto) {
        try {
            Attendance attendance = new Attendance();
            attendance.setAttendanceDate(attendancesDto.getAttendanceDate());
            AttendanceState attendanceState = stateAttendanceService.getById(attendancesDto.getAttendanceState().getId());
            attendance.setAttendanceState(attendanceState);
            attendance.setStudentId(attendancesDto.getStudentId());

            return modelMapper.map(attendancesService.save(attendance), AttendanceDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing attendance
    public void update(Long attendanceId, AttendanceDto attendancesDto) {
        try {
            attendancesDto.setId(attendanceId);
            Attendance attendance = modelMapper.map(attendancesDto, Attendance.class);
            attendancesService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete attendance by ID
    public void delete(Long attendanceId) {
        try {
            Attendance attendance = attendancesService.getById(attendanceId);
            attendancesService.delete(attendance);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}