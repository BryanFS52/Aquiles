package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.Follow_upsDto;
import com.api.aquilesApi.Entity.Follow_upsEntity;
import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import com.api.aquilesApi.Service.Follow_upsService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class Follow_upsBusiness {
    @Autowired
    private Follow_upsService followUpsService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación del objeto JSON
    private Follow_upsDto validationObject(Map<String, Object> json, Follow_upsDto followUpsDto) {
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Validaciones de campos requeridos y tipos de datos
        if (!dataObject.has("followUpId") || dataObject.isNull("followUpId")) {
            throw new CustomException("El campo followUpId es obligatorio", HttpStatus.BAD_REQUEST);
        }

        // Validar el campo followUpId
        followUpsDto.setFollowUpId(dataObject.getLong("followUpId"));

        // Validar el campo stateFollowUps
        if (dataObject.has("stateFollowUps")) {
            Long stateFollowUpId = dataObject.getLong("stateFollowUps");

            // Validar si el estado existe
            StateFollow_upsEntity stateFollowUps = followUpsService.findStateById(stateFollowUpId);
            if (stateFollowUps == null) {
                throw new CustomException("ID de stateFollowUps inválido", HttpStatus.BAD_REQUEST);
            }

            // Si el ID es válido, asigna el objeto al DTO
            followUpsDto.setStateFollowUps(stateFollowUps);
        } else {
            throw new CustomException("El campo stateFollowUps es obligatorio", HttpStatus.BAD_REQUEST);
        }

        // Retorna el DTO validado
        return followUpsDto;
    }

    // Obtener todos los Follow Ups
    public Page<Follow_upsDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Follow_upsEntity> followUpsEntityPage = followUpsService.findAll(pageRequest);

            List<Follow_upsDto> followUpsDtoList = followUpsEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, Follow_upsDto.class))
                    .collect(Collectors.toList());
            return new PageImpl<>(followUpsDtoList, pageRequest, followUpsEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error al recuperar los Follow Ups: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener Follow Up por ID
    public Follow_upsDto findById(Long id) {
        try {
            Follow_upsEntity followUps = followUpsService.getById(id);
            return modelMapper.map(followUps, Follow_upsDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error al obtener el Follow Up por ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Agregar un nuevo Follow Up
    public void add(Map<String, Object> json) {
        try {
            Follow_upsDto followUpsDto = new Follow_upsDto();
            followUpsDto = validationObject(json, followUpsDto);
            Follow_upsEntity followUpsEntity = modelMapper.map(followUpsDto, Follow_upsEntity.class);
            followUpsService.create(followUpsEntity);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error al crear el Follow Up: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Actualizar Follow Up
    public void update(Long followUpId, Map<String, Object> json) {
        try {
            Follow_upsDto followUpDto = modelMapper.map(followUpsService.getById(followUpId), Follow_upsDto.class);
            Follow_upsEntity followUp = modelMapper.map(this.validationObject(json, followUpDto), Follow_upsEntity.class);
            followUpsService.update(followUp);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error al actualizar el Follow Up: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Eliminar Follow Up
    public void delete(Long followUpId) {
        try {
            Follow_upsEntity followUps = followUpsService.getById(followUpId);
            followUpsService.delete(followUps);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error al eliminar el Follow Up: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}


