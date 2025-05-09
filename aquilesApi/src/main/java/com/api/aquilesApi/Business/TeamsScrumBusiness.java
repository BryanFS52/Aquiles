package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrumEntity;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Util;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TeamsScrumBusiness {

    @Autowired
    private TeamScrumService teamScrumService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();
    /*
    // Validación Objeto
    private TeamsScrumDto validationObject(Map<String, Object> json, TeamsScrumDto teamsScrumDto) {
        JSONObject dataObject = util.getData(json);

        // Solo si viene el teamScrumId lo asignamos y validamos
        if (dataObject.has("teamScrumId")) {
            teamsScrumDto.setTeamScrumId(dataObject.getLong("teamScrumId"));

            if (teamsScrumDto.getTeamScrumId() == null || teamsScrumDto.getTeamScrumId() <= 0) {
                throw new CustomException("Invalid Team Scrum ID", HttpStatus.BAD_REQUEST);
            }
        }

        // nameProject es obligatorio siempre
        if (!dataObject.has("nameProject")) {
            throw new CustomException("Project name is required", HttpStatus.BAD_REQUEST);
        }

        teamsScrumDto.setNameProject(dataObject.getString("nameProject"));

        if (teamsScrumDto.getNameProject() == null || teamsScrumDto.getNameProject().isEmpty()) {
            throw new CustomException("Project name cannot be empty", HttpStatus.BAD_REQUEST);
        }

        return teamsScrumDto;
    }
     */


    // Find All
    public Page<TeamsScrumDto> findAll(int page , int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<TeamsScrumEntity> teamsScrumEntityPage = teamScrumService.findAll(pageRequest);

            List<TeamsScrumDto> teamsScrumDtoList = teamsScrumEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, TeamsScrumDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(teamsScrumDtoList , pageRequest , teamsScrumEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Find By Id
    public TeamsScrumDto findById(Long id) {
        try {
            TeamsScrumEntity teamsScrum = teamScrumService.getById(id);

            // Configurar el mapeo manualmente si los nombres no coinciden
            modelMapper.typeMap(TeamsScrumEntity.class, TeamsScrumDto.class)
                    .addMapping(TeamsScrumEntity::getId, TeamsScrumDto::setTeamScrumId);

            return modelMapper.map(teamsScrum, TeamsScrumDto.class);
        } catch (CustomException e) {
            throw e; // Lanzar la excepción personalizada
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    // Add
    public TeamsScrumDto add(TeamsScrumDto teamsScrumDto) {
        try {
            TeamsScrumEntity teamsScrumEntity = modelMapper.map(teamsScrumDto, TeamsScrumEntity.class);
            return modelMapper.map(teamScrumService.save(teamsScrumEntity), TeamsScrumDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long teamScrumId , TeamsScrumDto teamsScrumDto){
        try {
            teamsScrumDto.setTeamScrumId(teamScrumId);
            TeamsScrumEntity teamsScrumEntity = modelMapper.map(teamsScrumDto, TeamsScrumEntity.class);
            teamScrumService.save(teamsScrumEntity);
        } catch (Exception e){
            throw new CustomException("Error Updating Team Scrum: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long teamScrumId){
        try {
            TeamsScrumEntity teamsScrum = teamScrumService.getById(teamScrumId);
            teamScrumService.delete(teamsScrum);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting Team Scrum:" + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }
}
