package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceStateDto;
import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Service.StateAttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class StateAttendancesBusiness {
    private final StateAttendanceService stateAttendanceService;
    private final Util util;
    private final ModelMapper modelMapper;

    public StateAttendancesBusiness(StateAttendanceService stateAttendanceService, Util util, ModelMapper modelMapper) {
        this.stateAttendanceService = stateAttendanceService;
        this.util = util;
        this.modelMapper = modelMapper;
    }

    // Validation object
    private AttendanceStateDto validationObject(Map<String, Object> json, AttendanceStateDto attendanceStateDto) {
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asigna el valor del JSON al DTO
        attendanceStateDto.setId(dataObject.getLong("stateAttendanceId"));
        attendanceStateDto.setStatus(dataObject.getString("status"));

        return attendanceStateDto;
    }

    // Find all
    public Page<AttendanceStateDto> findAll(int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<AttendanceState> stateAttendanceEntityPage = this.stateAttendanceService.findAll(pageRequest);

            List<AttendanceStateDto> attendanceStateDtoList = stateAttendanceEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, AttendanceStateDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(attendanceStateDtoList, pageRequest , stateAttendanceEntityPage.getTotalElements());
        }  catch (Exception e){
            throw new CustomException("Error retrieving State Attendance" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public AttendanceStateDto findById(Long id){
        try {
            AttendanceState stateAttendance = this.stateAttendanceService.getById(id);
            return modelMapper.map(stateAttendance , AttendanceStateDto.class);
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
            return modelMapper.map(this.stateAttendanceService.save(attendanceState) , AttendanceStateDto.class);
        } catch (Exception e){
            throw new CustomException("Error Creating State: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long stateAttendanceId, AttendanceStateDto attendanceStateDto) {
        try {
           attendanceStateDto.setId(stateAttendanceId);
           AttendanceState attendanceState = modelMapper.map(attendanceStateDto, AttendanceState.class);
           this.stateAttendanceService.save(attendanceState);
        } catch (Exception e) {
            throw new CustomException("Error Updating State Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete (Long stateAttendanceId){
        try {
            AttendanceState stateAttendance = stateAttendanceService.getById(stateAttendanceId);
            stateAttendanceService.delete(stateAttendance);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting State Attendance : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }
}