package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceStateDto;
import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Service.AttendanceStateService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AttendanceStateBusiness {
    private final AttendanceStateService attendanceStateService;
    private final ModelMapper modelMapper;

    public AttendanceStateBusiness(AttendanceStateService attendanceStateService, ModelMapper modelMapper) {
        this.attendanceStateService = attendanceStateService;
        this.modelMapper = modelMapper;
    }

    // Validation object
    private void validationObject(AttendanceStateDto attendanceStateDto) throws CustomException {

    }

    // Find all
    public Page<AttendanceStateDto> findAll(int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<AttendanceState>  stateAttendancesPage = attendanceStateService.findAll(pageRequest);

            return stateAttendancesPage.map(entity -> modelMapper.map(entity, AttendanceStateDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public AttendanceStateDto findById(Long id){
        try {
            AttendanceState attendanceState = this.attendanceStateService.getById(id);
            return modelMapper.map(attendanceState, AttendanceStateDto.class);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting State : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public AttendanceStateDto add(AttendanceStateDto attendanceStateDto){
        try {
            AttendanceState attendanceState = modelMapper.map(attendanceStateDto, AttendanceState.class);
            return modelMapper.map(this.attendanceStateService.save(attendanceState) , AttendanceStateDto.class);
        } catch (Exception e){
            throw new CustomException("Error Creating State: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long stateAttendanceId, AttendanceStateDto attendanceStateDto) {
        try {
           attendanceStateDto.setId(stateAttendanceId);
           AttendanceState attendanceState = modelMapper.map(attendanceStateDto, AttendanceState.class);
           this.attendanceStateService.save(attendanceState);
        } catch (Exception e) {
            throw new CustomException("Error Updating State Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
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
