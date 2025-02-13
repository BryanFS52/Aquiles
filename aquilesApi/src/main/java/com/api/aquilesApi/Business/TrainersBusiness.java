package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.TrainersDto;
import com.api.aquilesApi.Entity.TrainersEntity;
import com.api.aquilesApi.Service.TrainersService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.json.JSONException;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TrainersBusiness {
    @Autowired
    private TrainersService trainersService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();


    // Validación Objeto
    private TrainersDto validationObject(Map<String, Object> json, TrainersDto trainersDto) {
        // Extrae Datos Del Objeto JSON
        JSONObject dataObject = util.getData(json);

        // Validaciones de campos requeridos y tipos de datos
        if (!dataObject.has("trainerId") || dataObject.isNull("trainerId")) {
            throw new CustomException("trainerId is required", HttpStatus.BAD_REQUEST);
        }
        if (!dataObject.has("trainerState") || dataObject.isNull("trainerState")) {
            throw new CustomException("trainerState is required", HttpStatus.BAD_REQUEST);
        }
        if (!dataObject.has("idPerson") || dataObject.isNull("idPerson")) {
            throw new CustomException("idPerson is required", HttpStatus.BAD_REQUEST);
        }
        if (!dataObject.has("documentNumber") || dataObject.isNull("documentNumber")) {
            throw new CustomException("documentNumber is required", HttpStatus.BAD_REQUEST);
        }

        // Asignar y validar los valores del JSON al DTO
        try {
            long trainerId = dataObject.getLong("trainerId");
            boolean trainerState = dataObject.getBoolean("trainerState");
            long idPerson = dataObject.getLong("idPerson");
            BigInteger documentNumber = new BigInteger(dataObject.getString("documentNumber"));

            // Validaciones de valores
            if (trainerId <= 0) {
                throw new CustomException("trainerId must be greater than zero", HttpStatus.BAD_REQUEST);
            }
            if (idPerson <= 0) {
                throw new CustomException("idPerson must be greater than zero", HttpStatus.BAD_REQUEST);
            }
            if (documentNumber.compareTo(BigInteger.ZERO) <= 0) {
                throw new CustomException("documentNumber must be a positive number", HttpStatus.BAD_REQUEST);
            }

            // Asignación al DTO
            trainersDto.setTrainerId(trainerId);
            trainersDto.setTrainerState(trainerState);
            trainersDto.setIdPerson(idPerson);
            trainersDto.setDocumentNumber(documentNumber);
        } catch (JSONException e) {
            throw new CustomException("Invalid data format: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        return trainersDto;
    }


    // Find All
    public Page<TrainersDto> findAll (int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<TrainersEntity> trainersEntityPage = trainersService.findAll(pageRequest);

            List<TrainersDto> trainersDtoList = trainersEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, TrainersDto.class))
                    .collect(Collectors.toList());
            return new PageImpl<>( trainersDtoList , pageRequest , trainersEntityPage.getTotalElements());
        } catch (Exception e){
            throw new CustomException("Error Retrieving Trainers : " + e.getMessage() , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public TrainersDto findById(Long id){
        try {
            TrainersEntity trainers = trainersService.getById(id);
            // Configurar El Mapeo Manualmente si es necesario
            modelMapper.typeMap(TrainersEntity.class , TrainersDto.class)
                    .addMapping(TrainersEntity::getTrainerId , TrainersDto::setTrainerId);

            return modelMapper.map(trainers , TrainersDto.class);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting Trainer By Id: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public void add (Map<String , Object> json){
        try {
            TrainersDto trainersDto = new TrainersDto();

            // Validar Y Asignar Datos Del JSON al DTO
            trainersDto = validationObject(json , trainersDto);

            // Convertir El Dto A Entidad
            TrainersEntity trainersEntity = modelMapper.map(trainersDto , TrainersEntity.class);

            // Guardar La Entidad
            trainersService.create(trainersEntity);

        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Creating Trainer: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long trainerId , Map<String , Object> json){
        try {
            var trainerDto = modelMapper.map(trainersService.getById(trainerId) , TrainersDto.class);
            var trainer = modelMapper.map(this.validationObject(json , trainerDto) , TrainersEntity.class);
            trainersService.save(trainer);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Updating Trainer: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long trainerId){
        try {
            TrainersEntity trainers = trainersService.getById(trainerId);
            trainersService.delete(trainers);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting Trainer: " + e.getMessage() ,HttpStatus.BAD_REQUEST);
        }
    }

}
