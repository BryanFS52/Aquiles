package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Dto.Teams_ScrumDto;
import com.api.aquilesApi.Entity.Teams_ScrumEntity;
import com.api.aquilesApi.Service.Team_ScrumService;
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
public class Teams_ScrumBusiness {

    @Autowired
    private Team_ScrumService teamScrumService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación Objeto
    private Teams_ScrumDto validationObject(Map<String, Object> json, Teams_ScrumDto teamsScrumDto) {
        // Extrae datos del objeto JSON
        JSONObject dataObject = util.getData(json);

        // Asigna el valor del JSON al DTO
        teamsScrumDto.setTeamScrumId(dataObject.getLong("teamScrumId"));
        teamsScrumDto.setNameProject(dataObject.getString("nameProject"));

        // Aquí puedes agregar validaciones adicionales, por ejemplo:
        if (teamsScrumDto.getTeamScrumId() == null || teamsScrumDto.getTeamScrumId() <= 0) {
            throw new CustomException("Invalid Team Scrum ID", HttpStatus.BAD_REQUEST);
        }

        if (teamsScrumDto.getNameProject() == null || teamsScrumDto.getNameProject().isEmpty()) {
            throw new CustomException("Project name cannot be empty", HttpStatus.BAD_REQUEST);
        }

        return teamsScrumDto;
    }

    // Find All
    public Page<Teams_ScrumDto> findAll(int page , int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Teams_ScrumEntity> teamsScrumEntityPage = teamScrumService.findAll(pageRequest);

            List<Teams_ScrumDto> teamsScrumDtoList = teamsScrumEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, Teams_ScrumDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(teamsScrumDtoList , pageRequest , teamsScrumEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public Teams_ScrumDto findById(Long id) {
        try {
            Teams_ScrumEntity teamsScrum = teamScrumService.getById(id);
            // Configurar el mapeo manualmente si es necesario
            modelMapper.typeMap(Teams_ScrumEntity.class, Teams_ScrumDto.class)
                    .addMapping(Teams_ScrumEntity::getTeamScrumId, Teams_ScrumDto::setTeamScrumId);

            return modelMapper.map(teamsScrum, Teams_ScrumDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public void add(Map<String, Object> json) {
        try {
            // Crear un nuevo DTO
            Teams_ScrumDto teamsScrumDto = new Teams_ScrumDto();

            // Validar y asignar datos del JSON al DTO
            teamsScrumDto = validationObject(json, teamsScrumDto);

            // Convertir el DTO a entidad
            Teams_ScrumEntity teamsScrumEntity = modelMapper.map(teamsScrumDto, Teams_ScrumEntity.class);

            // Guardar la entidad
            teamScrumService.create(teamsScrumEntity);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Creating Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update

    public void update(Long teamScrumId , Map<String , Object> json){
        try {
            var teamScrumDto = modelMapper.map(teamScrumService.getById(teamScrumId) , Teams_ScrumDto.class);
            var teamScrum = modelMapper.map(this.validationObject(json , teamScrumDto) , Teams_ScrumEntity.class);
            teamScrumService.save(teamScrum);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Updating Team Scrum: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long teamScrumId){
        try {
            Teams_ScrumEntity teamsScrum = teamScrumService.getById(teamScrumId);
            teamScrumService.delete(teamsScrum);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting Team Scrum:" + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }
}
