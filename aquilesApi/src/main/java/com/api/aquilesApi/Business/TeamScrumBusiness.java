package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.AttendanceDTO;
import com.api.aquilesApi.Dto.TeamScrumDTO;
import com.api.aquilesApi.Entity.TeamScrum;
import com.api.aquilesApi.Service.TeamScrumService;
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
public class TeamScrumBusiness {

    @Autowired
    private TeamScrumService teamScrumService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación Objeto
    private TeamScrumDTO validationObject(Map<String, Object> json, TeamScrumDTO teamsScrumDto) {
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
    public Page<TeamScrumDTO> findAll(int page , int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<TeamScrum> teamsScrumEntityPage = teamScrumService.findAll(pageRequest);

            List<TeamScrumDTO> teamsScrumDtoList = teamsScrumEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, TeamScrumDTO.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(teamsScrumDtoList , pageRequest , teamsScrumEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public TeamScrumDTO findById(Long id) {
        try {
            TeamScrum teamsScrum = teamScrumService.getById(id);
            // Configurar el mapeo manualmente si es necesario
            modelMapper.typeMap(TeamScrum.class, TeamScrumDTO.class)
                    .addMapping(TeamScrum::getTeamScrumId, TeamScrumDTO::setTeamScrumId);

            return modelMapper.map(teamsScrum, TeamScrumDTO.class);
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
            TeamScrumDTO teamsScrumDto = new TeamScrumDTO();

            // Validar y asignar datos del JSON al DTO
            teamsScrumDto = validationObject(json, teamsScrumDto);

            // Convertir el DTO a entidad
            TeamScrum teamsScrumEntity = modelMapper.map(teamsScrumDto, TeamScrum.class);

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
            var teamScrumDto = modelMapper.map(teamScrumService.getById(teamScrumId) , TeamScrumDTO.class);
            var teamScrum = modelMapper.map(this.validationObject(json , teamScrumDto) , TeamScrum.class);
            teamScrumService.save(teamScrum);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Updating Team Scrum: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long teamScrumId) {
        try {
            // Obtener la entidad desde el servicio
            TeamScrum teamScrumEntity = teamScrumService.getById(teamScrumId);

            // Convertir la entidad al DTO si es necesario (para fines de validación o respuesta)
            TeamScrumDTO teamScrum = modelMapper.map(teamScrumEntity, TeamScrumDTO.class);

            // Eliminar la entidad utilizando el servicio
            teamScrumService.delete(teamScrumEntity);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
