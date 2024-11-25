package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceDTO;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.StateAttendance;
import com.api.aquilesApi.Service.AttendanceService;
import com.api.aquilesApi.Service.StateAttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
public class AttendanceBusiness {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private StateAttendanceService stateAttendanceService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación Objeto
    private AttendanceDTO validationObject(Map<String, Object> json, AttendanceDTO attendanceDTO) {
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asigna el valor del JSON al DTO
        attendanceDTO.setAttendanceId(dataObject.getLong("attendanceId"));
        attendanceDTO.setAttendanceDate(convertToDate(dataObject.getString("attendanceDate"))); // Convierte el string a Date

        // Busca el estado de asistencia basado en el ID proporcionado
        Long stateAttendanceId = dataObject.getLong("fk_stateAttendance_id");
        StateAttendance stateAttendance = stateAttendanceService.getById(stateAttendanceId);

        // Verifica si el estado de asistencia existe
        if (stateAttendance == null) {
            throw new CustomException("State Attendance not found for id: " + stateAttendanceId, HttpStatus.BAD_REQUEST);
        }
        attendanceDTO.setStateAttendance(stateAttendance); // Establece el objeto StateAttendance

        // Validación para evitar duplicados
        if (attendanceService.existsByAttendanceDateAndStateAttendance(attendanceDTO.getAttendanceDate(), stateAttendance)) {
            throw new CustomException("Duplicate attendance entry for date: " + attendanceDTO.getAttendanceDate(), HttpStatus.BAD_REQUEST);
        }

        return attendanceDTO;
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
    public Page<AttendanceDTO> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Attendance> attendancePage = attendanceService.findAll(pageRequest);

            System.out.println("Total Attendances: " + attendancePage.getTotalElements());

            return attendancePage.map(entity -> modelMapper.map(entity, AttendanceDTO.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public AttendanceDTO findById(Long id) {
        try {
            Attendance attendance = attendanceService.getById(id);
            return modelMapper.map(attendance, AttendanceDTO.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public void add(Map<String, Object> json) {
        try {
            AttendanceDTO attendanceDto = new AttendanceDTO();
            attendanceDto.setAttendanceId(((Number) json.get("attendanceId")).longValue());
            attendanceDto.setAttendanceDate(convertToDate((String) json.get("attendanceDate")));

            Long stateAttendanceId = ((Number) json.get("fk_stateAttendance_id")).longValue();
            StateAttendance stateAttendance = stateAttendanceService.getById(stateAttendanceId);

            if (stateAttendance == null) {
                throw new CustomException("State Attendance not found for id: " + stateAttendanceId, HttpStatus.BAD_REQUEST);
            }

            // Asigna el estado de asistencia
            attendanceDto.setStateAttendance(stateAttendance); // Aquí asignas el objeto StateAttendance

            // Convierte el DTO a entidad y guarda
            var attendance = modelMapper.map(attendanceDto, Attendance.class);
            this.attendanceService.create(attendance);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Creating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long attendanceId, Map<String, Object> json) {
        try {
            var attendanceDto = modelMapper.map(attendanceService.getById(attendanceId), AttendanceDTO.class);
            var attendance = modelMapper.map(this.validationObject(json, attendanceDto), Attendance.class);
            attendanceService.save(attendance);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            Attendance attendance = attendanceService.getById(attendanceId);
            attendanceService.delete(attendance);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
