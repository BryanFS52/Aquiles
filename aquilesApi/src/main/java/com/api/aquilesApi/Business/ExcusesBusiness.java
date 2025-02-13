package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Dto.ExcusesDto;
import com.api.aquilesApi.Entity.AttendancesEntity;
import com.api.aquilesApi.Entity.ExcusesEntity;
import com.api.aquilesApi.Service.ExcusesService;
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

import java.util.Map;

@Component
public class ExcusesBusiness {
    @Autowired
    private ExcusesService excusesService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación de Objeto
    private ExcusesDto validationObject(Map<String, Object> json, ExcusesDto excusesDto) {
        // Extrae datos del objeto JSON utilizando la utilidad 'getData'
        JSONObject dataObject = util.getData(json);

        // Asigna los valores del JSON al DTO, asegurando que se realicen las validaciones necesarias
        if (dataObject.has("excuseId")) {
            excusesDto.setExcuseId(dataObject.getLong("excuseId"));
        } else {
            throw new CustomException("Excuse ID is required", HttpStatus.BAD_REQUEST);
        }

        if (dataObject.has("excuseDocument") && !dataObject.getString("excuseDocument").isEmpty()) {
            excusesDto.setExcuseDocument(dataObject.getString("excuseDocument"));
        } else {
            throw new CustomException("Excuse document is required", HttpStatus.BAD_REQUEST);
        }

        if (dataObject.has("excuseDescription") && !dataObject.getString("excuseDescription").isEmpty()) {
            excusesDto.setExcuseDescription(dataObject.getString("excuseDescription"));
        } else {
            throw new CustomException("Excuse description is required", HttpStatus.BAD_REQUEST);
        }

        // Realiza validaciones adicionales según los requisitos de negocio

        // Por ejemplo, si necesitas verificar si un documento ya ha sido registrado:
        if (excusesService.existsByExcuseDocument(excusesDto.getExcuseDocument())) {
            throw new CustomException("Excuse document already exists", HttpStatus.BAD_REQUEST);
        }

        return excusesDto;
    }

    // Find All
    public Page<ExcusesDto> findAll(int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ExcusesEntity> excusesEntityPage = excusesService.findAll(pageRequest);
            return excusesEntityPage.map(entity -> modelMapper.map(entity, ExcusesDto.class));
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error retrieving Excuses due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ExcusesDto findById(Long id){
        try {
            ExcusesEntity excuses = excusesService.getById(id);
            return modelMapper.map(excuses , ExcusesDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Excuses: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public void add(Map<String, Object> json) {
        try {
            // Crea un nuevo objeto ExcusesDto
            ExcusesDto excusesDto = new ExcusesDto();

            // Válida y asigna los valores del JSON al DTO
            excusesDto = validationObject(json, excusesDto);

            // Mapea el DTO a la entidad
            ExcusesEntity excusesEntity = modelMapper.map(excusesDto, ExcusesEntity.class);

            // Guarda la entidad en la base de datos
            excusesService.save(excusesEntity);
        } catch (CustomException e) {
            // Lanza la excepción personalizada si ocurre
            throw e;
        } catch (DataAccessException e) {
            // Manejo específico para errores de acceso a datos
            throw new CustomException("Error saving Excuses due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Manejo genérico para cualquier otra excepción
            throw new CustomException("An unexpected error occurred while adding the excuse.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update
    public void update(Long excuseId , Map<String , Object> json){
        try {
            var excusesDTO = modelMapper.map(excusesService.getById(excuseId), ExcusesDto.class);
            var excuse = modelMapper.map(this.validationObject(json, excusesDTO), ExcusesEntity.class);
            excusesService.save(excuse);
        }  catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Updating Excuse: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long excuseId){
        try {
            ExcusesEntity excuses = excusesService.getById(excuseId);
            excusesService.delete(excuses);
        }catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Deleting Excuse: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
