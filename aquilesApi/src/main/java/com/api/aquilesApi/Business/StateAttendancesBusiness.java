package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.StateAttendanceDto;
import com.api.aquilesApi.Entity.StateAttendanceEntity;
import com.api.aquilesApi.Service.StateAttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private StateAttendanceService stateAttendanceService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();


    // Método de validación
    private StateAttendanceDto validationObject(Map<String, Object> json, StateAttendanceDto stateAttendanceDto) {
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asigna el valor del JSON al DTO
        stateAttendanceDto.setStateAttendanceId(dataObject.getLong("stateAttendanceId"));
        stateAttendanceDto.setStatus(dataObject.getString("status"));// Asegúrate de que el nombre del campo coincide con el JSON

        // Validación para evitar duplicados (ajusta según tu lógica)
        if (stateAttendanceService.existsStateAttendance(stateAttendanceDto.getStateAttendanceId())) {
            throw new CustomException("Duplicate state attendance entry for id: " + stateAttendanceDto.getStateAttendanceId(), HttpStatus.BAD_REQUEST);
        }

        return stateAttendanceDto;
    }

    // Metodo Para Obtener Todos Los Estados De Asistencia
    public Page<StateAttendanceDto> findAll(int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<StateAttendanceEntity> stateAttendanceEntityPage = this.stateAttendanceService.findAll(pageRequest);

            // Convertir las entidades a DTOs
            List<StateAttendanceDto> stateAttendanceDtoList = stateAttendanceEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, StateAttendanceDto.class))
                    .collect(Collectors.toList());

            // Crear Una Nueva Pagina Con Los Dtos
            return new PageImpl<>(stateAttendanceDtoList , pageRequest , stateAttendanceEntityPage.getTotalElements());
        }  catch (Exception e){
            throw new CustomException("Error retrieving State Attendance" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Metodo Para Obtener Los Estados Por Id
    public StateAttendanceDto findById(Long id){
        try {
            StateAttendanceEntity stateAttendance = this.stateAttendanceService.getById(id);
            return modelMapper.map(stateAttendance , StateAttendanceDto.class);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting State : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Metodo Para Crear-Add Nuevo Estado
    public void add(Map<String , Object> json){
        try {
            StateAttendanceDto stateAttendanceDto = new StateAttendanceDto();
            var stateAttendance = modelMapper.map(this.validationObject(json , stateAttendanceDto) , StateAttendanceEntity.class);
            this.stateAttendanceService.create(stateAttendance);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Creating State: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Metodo Para Editar - Actualizar Un Estado de Asistencia
    public void update(Long stateAttendanceId, Map<String, Object> json) {
        try {
            // Verificar si el estado de asistencia existe
            var existingStateAttendance = stateAttendanceService.getById(stateAttendanceId);

            if (existingStateAttendance == null) {
                throw new CustomException("State Attendance not found", HttpStatus.NOT_FOUND);
            }

            // Extraer el estado del JSON
            if (!json.containsKey("status")) {
                throw new CustomException("Missing required field: status", HttpStatus.BAD_REQUEST);
            }

            // Mapear los datos a DTO y luego a la entidad
            var stateAttendanceDto = modelMapper.map(existingStateAttendance, StateAttendanceDto.class);

            // Actualizar el DTO con nuevos valores
            stateAttendanceDto.setStatus((String) json.get("status"));

            // Mapear el DTO de vuelta a la entidad
            var stateAttendanceEntity = modelMapper.map(stateAttendanceDto, StateAttendanceEntity.class);

            // Guardar la entidad actualizada
            stateAttendanceService.save(stateAttendanceEntity);
        } catch (CustomException e) {
            throw e; // Propagar excepciones personalizadas
        } catch (Exception e) {
            throw new CustomException("Error Updating State Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //  Metodo Para Eliminar Un Estado De Asistencia
    public void delete (Long stateAttendanceId){
        try {
            StateAttendanceEntity stateAttendance = stateAttendanceService.getById(stateAttendanceId);
            stateAttendanceService.delete(stateAttendance);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting State Attendance : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

}
