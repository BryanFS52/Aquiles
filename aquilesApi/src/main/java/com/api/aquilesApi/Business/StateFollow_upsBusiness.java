package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.StateFollow_upsDto;
import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import com.api.aquilesApi.Service.StateFollow_upsService;
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
public class StateFollow_upsBusiness {

    @Autowired
    private StateFollow_upsService stateFollowUpsService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación del objeto para StateFollow_upsDto
    private StateFollow_upsDto validationObject(Map<String, Object> json, StateFollow_upsDto stateFollowUpsDto) {
        JSONObject dataObject = util.getData(json);

        // Validar que el ID y el estado están presentes
        if (!dataObject.has("stateFollowUpId") || dataObject.isNull("stateFollowUpId")) {
            throw new CustomException("State Follow-up Id is required", HttpStatus.BAD_REQUEST);
        }
        if (!dataObject.has("status") || dataObject.isNull("status")) {
            throw new CustomException("Status is required", HttpStatus.BAD_REQUEST);
        }

        // Asignar valores al DTO desde el JSON
        stateFollowUpsDto.setStateFollowUpId(dataObject.getLong("stateFollowUpId"));
        stateFollowUpsDto.setStatus(dataObject.getString("status"));

        // Validación adicional si es necesaria
        if (stateFollowUpsDto.getStatus().isEmpty()) {
            throw new CustomException("Status cannot be empty", HttpStatus.BAD_REQUEST);
        }

        return stateFollowUpsDto;
    }

    // Método para encontrar todos los registros con paginación
    public Page<StateFollow_upsDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<StateFollow_upsEntity> stateFollowUpsEntityPage = stateFollowUpsService.findAll(pageRequest);

            List<StateFollow_upsDto> stateFollowUpsDtoList = stateFollowUpsEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, StateFollow_upsDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(stateFollowUpsDtoList, pageRequest, stateFollowUpsEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error Retrieving State Follow Ups: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Método para encontrar un registro por ID
    public StateFollow_upsDto findById(Long id) {
        try {
            StateFollow_upsEntity stateFollowUps = stateFollowUpsService.getById(id);
            return modelMapper.map(stateFollowUps, StateFollow_upsDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting State Follow Up By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Método para agregar un nuevo estado de seguimiento
    public void add(Map<String, Object> json) {
        try {
            StateFollow_upsDto stateFollowUpsDto = new StateFollow_upsDto();
            var stateFollowUp = modelMapper.map(this.validationObject(json, stateFollowUpsDto), StateFollow_upsEntity.class);
            this.stateFollowUpsService.create(stateFollowUp);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Creating State: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Método para actualizar un estado de seguimiento
    public void update(Long stateFollowUpId, Map<String, Object> json) {
        try {
            // Verificar si el estado de asistencia existe
            var existingStateFollowUp = stateFollowUpsService.getById(stateFollowUpId);
            if (existingStateFollowUp == null) {
                throw new CustomException("State Follow-up not found", HttpStatus.NOT_FOUND);
            }

            // Validar si el campo `status` está presente
            if (!json.containsKey("status") || json.get("status") == null || ((String) json.get("status")).isEmpty()) {
                throw new CustomException("Status is required", HttpStatus.BAD_REQUEST);
            }

            // Actualizar la entidad con el nuevo estado
            var stateFollowUpsDto = modelMapper.map(existingStateFollowUp, StateFollow_upsDto.class);
            stateFollowUpsDto.setStatus((String) json.get("status"));
            var stateFollowUpEntity = modelMapper.map(stateFollowUpsDto, StateFollow_upsEntity.class);

            // Guardar la entidad actualizada
            stateFollowUpsService.save(stateFollowUpEntity);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Updating State Follow Up: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Método para eliminar un estado de seguimiento
    public void delete(Long stateFollowUpId) {
        try {
            StateFollow_upsEntity stateFollowUps = stateFollowUpsService.getById(stateFollowUpId);
            stateFollowUpsService.delete(stateFollowUps);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting State Follow Up: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
