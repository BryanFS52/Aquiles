package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Entity.AttendancesEntity;
import com.api.aquilesApi.Service.AttendancesService;
import com.api.aquilesApi.Service.StateAttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Component
public class AttendancesBusiness {

    private final AttendancesService attendancesService;
    private final StateAttendanceService stateAttendanceService;
    private final Util util;
    private final ModelMapper modelMapper = new ModelMapper();


    public AttendancesBusiness(AttendancesService attendancesService, StateAttendanceService stateAttendanceService, Util util) {
        this.attendancesService = attendancesService;
        this.stateAttendanceService = stateAttendanceService;
        this.util = util;
    }

    // Validación Objeto
    private void validationObject(Map<String, Object> json, AttendancesDto attendancesDTO) {
        /*
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asigna el valor del JSON al DTO
        attendancesDTO.setAttendanceId(dataObject.getLong("attendanceId"));
        attendancesDTO.setAttendanceDate(convertToDate(dataObject.getString("attendanceDate"))); // Convierte el string a Date

        // Busca el estado de asistencia basado en el ID proporcionado
        Long stateAttendanceId = dataObject.getLong("fk_stateAttendance_id");
        StateAttendanceEntity stateAttendance = stateAttendanceService.getById(stateAttendanceId);

        // Verifica si el estado de asistencia existe
        if (stateAttendance == null) {
            throw new CustomException("State Attendance not found for id: " + stateAttendanceId, HttpStatus.BAD_REQUEST);
        }
        attendancesDTO.setStateAttendance(stateAttendance); // Establece el objeto StateAttendanceEntity

        // Validación para evitar duplicados
        if (attendancesService.existsByAttendanceDateAndStateAttendance(attendancesDTO.getAttendanceDate(), stateAttendance)) {

            throw new CustomException("Duplicate attendance entry for date: " + attendancesDTO.getAttendanceDate(), HttpStatus.BAD_REQUEST);
        }

        return attendancesDTO;

         */
    }
    private Date convertToDate(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        try {
            return dateFormat.parse(dateString);
        } catch (ParseException e) {
            throw new CustomException("Invalid date format: " + dateString, HttpStatus.BAD_REQUEST);
        }
    }

    // Find All
    public Page<AttendancesDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<AttendancesEntity> attendancesEntityPage = attendancesService.findAll(pageRequest);

            System.out.println("Total Attendances: " + attendancesEntityPage.getTotalElements());

            return attendancesEntityPage.map(entity -> modelMapper.map(entity, AttendancesDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public AttendancesDto findById(Long id) {
        try {
            AttendancesEntity attendances = attendancesService.getById(id);
            return modelMapper.map(attendances, AttendancesDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public AttendancesDto add(AttendancesDto attendancesDto) {
        try {
            AttendancesEntity attendancesEntity = modelMapper.map(attendancesDto, AttendancesEntity.class);
            return modelMapper.map(attendancesService.save(attendancesEntity), AttendancesDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long attendanceId, AttendancesDto attendancesDto) {
        try {
            attendancesDto.setAttendanceId(attendanceId);
            AttendancesEntity attendance = modelMapper.map( attendancesDto, AttendancesEntity.class);
            attendancesService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            AttendancesEntity attendances = attendancesService.getById(attendanceId);
            attendancesService.delete(attendances);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
