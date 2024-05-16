package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.TeamsScrumDto;
import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.service.Teams_scrumService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TeamsScrumBusiness {

    @Autowired
    private Teams_scrumService teamsScrumService;

    private final ModelMapper modelMapper = new ModelMapper();

    public List<TeamsScrumDto> findAll() {
        try {
            List<Teams_scrum> teamsScrumList = teamsScrumService.findAll();
            if (teamsScrumList.isEmpty()) {
                return new ArrayList<>();
            }
            List<TeamsScrumDto> teamsScrumDtoList = new ArrayList<>();
            teamsScrumList.forEach(teamsScrum -> teamsScrumDtoList.add(modelMapper.map(teamsScrum, TeamsScrumDto.class)));
            return teamsScrumDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting teams scrum");
        }
    }

    public void update(TeamsScrumDto teamsScrumDto) {
        try {
            Teams_scrum teamsScrum = modelMapper.map(teamsScrumDto, Teams_scrum.class);
            teamsScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum");
        }
    }

    public void save(TeamsScrumDto teamsScrumDto) {
        try {
            Teams_scrum teamsScrum = modelMapper.map(teamsScrumDto, Teams_scrum.class);
            teamsScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum");
        }
    }

    public void create(TeamsScrumDto teamsScrumDto) {
        try {
            // Verificar si el nombre del proyecto ya existe
            String nameProject = teamsScrumDto.getNameProject();
            Teams_scrum existingProject = teamsScrumService.findByNameProject(nameProject);
            if (existingProject != null) {
                // Si el proyecto ya existe, lanzar una excepción
                throw new CustomException("The project with a name" + nameProject + " already exists.");
            }
            // Mapear el DTO a la entidad Teams_scrum
            Teams_scrum teamsScrum = modelMapper.map(teamsScrumDto, Teams_scrum.class);
            // Guardar el nuevo registro
            teamsScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum");
        }
    }


    public void delete(Long teamScrumId) {
        try {
            Teams_scrum teamsScrum = teamsScrumService.getById(teamScrumId);
            if (teamsScrum == null) {
                throw new CustomException("Teams scrum with id " + teamScrumId + " not found");
            }
            teamsScrumService.delete(teamsScrum);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
