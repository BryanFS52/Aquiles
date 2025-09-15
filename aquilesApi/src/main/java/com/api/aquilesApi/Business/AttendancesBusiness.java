package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Service.AttendanceStateService;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.AttendanceMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AttendancesBusiness {

    private final AttendancesService attendancesService;
    private final AttendanceStateService attendanceStateService;

    public AttendancesBusiness(
            AttendancesService attendancesService,
            AttendanceStateService attendanceStateService,
            ModelMapper modelMapper
    ) {
        this.attendancesService = attendancesService;
        this.attendanceStateService = attendanceStateService;
    }

    // Validation Object
    private void validationObject(TeamsScrumDto teamsScrumDto) throws CustomException {

    }

    // Get all attendances (paginated)
    public Page<AttendanceDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Attendance> attendancesPage = attendancesService.findAll(pageRequest);
            return AttendanceMap.INSTANCE.EntityToDTOs(attendancesPage);
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
            return AttendanceMap.INSTANCE.EntityToDTO(attendance);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get attendances by student ID
    public List<Attendance> findAllByStudentId(Long studentId) {
        try {
            return attendancesService.findAllByStudentId(studentId);
        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get All attendance ByStudentIdAndCompetenceQuarter
    public List<Attendance> getAllByStudentIdAndCompetenceQuarter(Long studentId, Long competenceQuarterId) {
        try {
            return attendancesService.getAllByStudentIdAndCompetenceQuarter(studentId, competenceQuarterId);

        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get attendances by competence quarter ID
    public List<AttendanceDto> findAllByCompetenceQuarterId(Long id) {
        try {
            List<Attendance> attendanceList = attendancesService.findAllByCompetenceQuarterId(id);
            return AttendanceMap.INSTANCE.EntityToDTOs(attendanceList);
        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get filtered attendances (student and state)
    public Page<AttendanceDto> findAllByStudentId(Long studentId, Long idState, Pageable pageable) {
        try {
            Page<Attendance> attendancePage = attendancesService.findAllByFilter(studentId, idState, pageable);
            return AttendanceMap.INSTANCE.EntityToDTOs(attendancePage);
        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add new attendance
    public AttendanceDto add(AttendanceDto attendanceDto) {
        try {
            Attendance attendance = new Attendance();
            AttendanceState attendanceState = attendanceStateService.getById(attendanceDto.getAttendanceState().getId());
            attendance.setAttendanceState(attendanceState);
            AttendanceMap.INSTANCE.updateAttendance(attendanceDto, attendance);
            Attendance savedAttendance = attendancesService.save(attendance);
            return AttendanceMap.INSTANCE.EntityToDTO(savedAttendance);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing attendance
    public void update(Long attendanceId, AttendanceDto attendanceDto) {
        try {
            attendanceDto.setId(attendanceId);
            Attendance attendance = attendancesService.getById( attendanceId);
            AttendanceMap.INSTANCE.updateAttendance(attendanceDto, attendance);
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