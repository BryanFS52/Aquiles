package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.DiarySustainationsDto;
import com.api.aquilesApi.Entity.DiarySustainationsEntity;
import com.api.aquilesApi.Entity.JuriesEntity;
import com.api.aquilesApi.Service.DiarySustainationsService;
import com.api.aquilesApi.Service.JuriesService;
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

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class DiarySustainationsBusiness {

    @Autowired
    private DiarySustainationsService diarySustainationsService;

    @Autowired
    private JuriesService juriesService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación de Objeto Simplificada
    private DiarySustainationsDto validationObject(Map<String, Object> json, DiarySustainationsDto diarySustainationsDto) {
        // Extraer datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asignación de valores
        diarySustainationsDto.setDiaryId(dataObject.optLong("diaryId", 0L));

        // Conversión de String a LocalDateTime para el campo dateTime
        String dateTimeStr = dataObject.optString("dateTime", "1970-01-01T00:00:00");
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime localDateTime = LocalDateTime.parse(dateTimeStr, formatter); // Conversión de String a LocalDateTime
            diarySustainationsDto.setDateTime(localDateTime);
        } catch (DateTimeParseException e) {
            throw new CustomException("Invalid date format for dateTime", HttpStatus.BAD_REQUEST);
        }

        // Asignación directa de place
        diarySustainationsDto.setPlace(dataObject.optString("place", ""));

        return diarySustainationsDto;
    }


    // Find All
    public Page<DiarySustainationsDto> findAll(int page , int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<DiarySustainationsEntity> diarySustainationsEntityPage = diarySustainationsService.findAll(pageRequest);

            List<DiarySustainationsDto> sustainationsDtoList = diarySustainationsEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity , DiarySustainationsDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(sustainationsDtoList , pageRequest , diarySustainationsEntityPage.getTotalElements());
        } catch (Exception e){
            throw new CustomException("Error Retrieving Substantiations : " + e.getMessage() , HttpStatus.INTERNAL_SERVER_ERROR );
        }
     }

     // Find By id
    public DiarySustainationsDto findById(Long id){
        try {
            DiarySustainationsEntity diarySustainations = diarySustainationsService.getById(id);
                // Configurar El Mapeo Manualmente Si Es Necesario
                modelMapper.typeMap(DiarySustainationsEntity.class , DiarySustainationsDto.class)
                        .addMapping(DiarySustainationsEntity::getDiaryId , DiarySustainationsDto::setDiaryId);
                return modelMapper.map(diarySustainations , DiarySustainationsDto.class);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting Substantiation By Id : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public void add(Map<String , Object> json){
        try {
            //Crear Un Nuevo DTO
            DiarySustainationsDto diarySustainationsDto = new DiarySustainationsDto();
            // Validar Y Asignar Datos del JSON Al DTO
            diarySustainationsDto = validationObject(json , diarySustainationsDto );
            // Convertir DTO a Entidad
            DiarySustainationsEntity diarySustainationsEntity = modelMapper.map(diarySustainationsDto , DiarySustainationsEntity.class);
            // Obtener La Entidad Del Diary Por Su ID
            DiarySustainationsEntity diarySustainations = diarySustainationsService.getById(diarySustainationsDto.getDiaryId());
            // Guardar La Entidad De Diary
            diarySustainationsService.create(diarySustainations);
        }catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Creating Diary Substantiation: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

        /*
            // add
    public void add(Map<String, Object> json) {
        try {
            // Crear un nuevo DTO
            ProjectDto projectDto = new ProjectDto();

            // Validar y asignar datos del JSON al DTO
            projectDto = validationObject(json, projectDto);

            // Convertir DTO a Entidad
            ProjectEntity projectEntity = modelMapper.map(projectDto, ProjectEntity.class);

            // Obtener la entidad del equipo Scrum por su ID usando directamente fk_team_scrum_id
            Teams_ScrumEntity teamScrum = teamScrumService.getById(projectDto.getFk_team_scrum_id());

            // Asignar la entidad del equipo Scrum al proyecto antes de guardarlo
            projectEntity.setFk_team_scrum_id(teamScrum);

            // Guardar la entidad de proyecto
            projectService.create(projectEntity);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Creating Project: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
         */

}
