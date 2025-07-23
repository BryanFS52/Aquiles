package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.StateAttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.MapStruct.AttendanceMap;
import com.api.aquilesApi.Utilities.Util;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Component
public class AttendancesBusiness {

    private final AttendancesService attendancesService;
    private final StateAttendanceService stateAttendanceService;
    private final ModelMapper modelMapper;


    public AttendancesBusiness(AttendancesService attendancesService, StateAttendanceService stateAttendanceService, Util util, ModelMapper modelMapper) {
        this.attendancesService = attendancesService;
        this.stateAttendanceService = stateAttendanceService;
        this.modelMapper = modelMapper;
    }

    // Validation object
    private void validationObject(Map<String, Object> json, AttendancesDto attendancesDTO) {
        /*
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asigna el valor del JSON al DTO
        attendanceDTO.setId();(dataObject.getLong("attendanceId"));
        attendanceDTO.setAttendanceDate(convertToDate(dataObject.getString("attendanceDate"))); // Convierte el string a Date

        // Busca el estado de asistencia basado en el ID proporcionado
        Long stateAttendanceId = dataObject.getLong("fk_stateAttendance_id");
        AttendanceState stateAttendance = stateAttendanceService.getById(stateAttendanceId);

        // Verifica si el estado de asistencia existe
        if (stateAttendance == null) {
            throw new CustomException("State Attendance not found for id: " + stateAttendanceId, HttpStatus.BAD_REQUEST);
        }
        attendanceDTO.setStateAttendance(stateAttendance); // Establece el objeto AttendanceState

        // Validación para evitar duplicados
        if (attendancesService.existsByAttendanceDateAndStateAttendance(attendanceDTO.getAttendanceDate(), stateAttendance)) {

            throw new CustomException("Duplicate attendance entry for date: " + attendanceDTO.getAttendanceDate(), HttpStatus.BAD_REQUEST);
        }

        return attendanceDTO;

         */
    }

    // Find All
    public Page<AttendancesDto> findAll(Pageable pageable) {
        try {
            PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
            Page<Attendance> attendancesPage = attendancesService.findAll(pageRequest);
            if(attendancesPage.isEmpty()) return Page.empty();
            return AttendanceMap.INSTANCE.attendancesToAttendanceDtoPage(attendancesPage);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find ById
    public AttendancesDto findById(Long id) {
        try {
            Attendance attendance = attendancesService.getById(id);
            return AttendanceMap.INSTANCE.attendanceToAttendanceDto(attendance);
        } catch (NoSuchElementException e) {
            throw new CustomException("Attendance not found.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: ", HttpStatus.BAD_REQUEST);
        }
    }

    // Find All ByStudentId
    public List<AttendancesDto> findAllByStudentId(Long studentId) {
        try {
            List<Attendance> attendanceList =  attendancesService.findAllByStudentId(studentId);
            return attendanceList.stream().map(entity -> modelMapper.map(entity, AttendancesDto.class)).collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("error " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindByFilter
    public Page<AttendancesDto> findAllByFilter(Long studentId, Long idState, Pageable pageable) {
        try {
            PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
            Page<Attendance> attendanceList =  attendancesService.findAllByFilter(studentId, idState, pageRequest);
            return AttendanceMap.INSTANCE.attendancesToAttendanceDtoPage(attendanceList);
        } catch (Exception e) {
            throw new CustomException("error " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add
    public AttendancesDto add(AttendancesDto attendancesDto) {
        try {
            Attendance attendance = AttendanceMap.INSTANCE.attendanceDtoToAttendance(attendancesDto);
            AttendanceState attendanceState = stateAttendanceService.getById(attendancesDto.getAttendanceState().getId());
            attendance.setAttendanceState(attendanceState);
            Attendance saved = attendancesService.save(attendance);
            return AttendanceMap.INSTANCE.attendanceToAttendanceDto(saved);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long attendanceId, AttendancesDto attendancesDto) {
        try {
            Attendance attendance = attendancesService.getById(attendanceId);
            AttendanceMap.INSTANCE.updateAttendanceFromDto(attendancesDto, attendance);
            attendancesService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            Attendance attendances = attendancesService.getById(attendanceId);
            attendancesService.delete(attendances);
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}