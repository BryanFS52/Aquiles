package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceStateDto;
import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Service.AttendanceStateService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.AttendanceStateMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AttendanceStateBusiness {
    private final AttendanceStateService attendanceStateService;

    public AttendanceStateBusiness(AttendanceStateService attendanceStateService ) {
        this.attendanceStateService = attendanceStateService;
    }

    // Validation object
    private void validationObject(AttendanceStateDto attendanceStateDto) throws CustomException {

    }

    // Get all attendanceStates (paginated)
    public Page<AttendanceStateDto> findAll(int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<AttendanceState>  attendanceStatePage = attendanceStateService.findAll(pageRequest);

            return AttendanceStateMap.INSTANCE.EntityToDTOs(attendanceStatePage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get attendanceState by ID
    public AttendanceStateDto findById(Long id){
        try {
            AttendanceState attendanceState = attendanceStateService.getById(id);
            return AttendanceStateMap.INSTANCE.EntityToDTO(attendanceState);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting State : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Add new attendanceState
    public AttendanceStateDto add(AttendanceStateDto attendanceStateDto){
        try {
            AttendanceState attendanceState = new AttendanceState();
            AttendanceStateMap.INSTANCE.updateAttendanceState(attendanceStateDto, attendanceState);
            AttendanceState savedAttendanceState = attendanceStateService.save(attendanceState);
            return AttendanceStateMap.INSTANCE.EntityToDTO(savedAttendanceState);

        } catch (Exception e){
            throw new CustomException("Error Creating State: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing attendanceState
    public void update(Long stateAttendanceId, AttendanceStateDto attendanceStateDto) {
        try {
           attendanceStateDto.setId(stateAttendanceId);
           AttendanceState attendanceState = attendanceStateService.getById(stateAttendanceId);
           AttendanceStateMap.INSTANCE.updateAttendanceState(attendanceStateDto, attendanceState);
           attendanceStateService.save(attendanceState);
        } catch (Exception e) {
            throw new CustomException("Error Updating State Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete attendance state by ID
    public void delete (Long stateAttendanceId){
        try {
            AttendanceState attendanceState = attendanceStateService.getById(stateAttendanceId);
            attendanceStateService.delete(attendanceState);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting State Attendance : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }
}