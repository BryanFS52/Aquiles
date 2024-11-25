package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ProjectDTO;
import com.api.aquilesApi.Entity.Project;
import com.api.aquilesApi.Entity.TeamScrum;
import com.api.aquilesApi.Service.ProjectService;
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
public class ProjectBusiness {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TeamScrumService teamScrumService;

    @Autowired
    private Util util;

    private final ModelMapper modelMapper = new ModelMapper();

    // Validación Objeto
    private ProjectDTO validationObject(Map<String, Object> json, ProjectDTO projectDto) {
        JSONObject dataObject = util.getData(json);

        if (!dataObject.has("projectId") || dataObject.isNull("projectId")) {
            throw new CustomException("Project ID is missing", HttpStatus.BAD_REQUEST);
        }

        projectDto.setProjectId(dataObject.getLong("projectId"));
        projectDto.setDescription(dataObject.getString("description"));
        projectDto.setProblem(dataObject.getString("problem"));
        projectDto.setObjectives(dataObject.getString("objectives"));
        projectDto.setJustification(dataObject.getString("justification"));

        // Obtener el ID del equipo Scrum y asignarlo directamente
        Long teamScrumId = dataObject.getLong("fk_team_scrum_id");
        projectDto.setFk_team_scrum_id(teamScrumId);

        return projectDto;
    }

    // Find All
    public Page<ProjectDTO> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Project> projectEntityPage = projectService.findAll(pageRequest);

            List<ProjectDTO> projectDtoList = projectEntityPage.getContent()
                    .stream()
                    .map(entity -> {
                        ProjectDTO dto = new ProjectDTO();
                        dto.setProjectId(entity.getProjectId());
                        dto.setDescription(entity.getDescription());
                        dto.setProblem(entity.getProblem());
                        dto.setObjectives(entity.getObjectives());
                        dto.setJustification(entity.getJustification());

                        // Asignar manualmente el teamScrumId
                        if (entity.getFk_team_scrum_id() != null) {
                            dto.setFk_team_scrum_id(entity.getFk_team_scrum_id().getTeamScrumId());
                        } else {
                            dto.setFk_team_scrum_id(null);
                        }

                        return dto;
                    })
                    .collect(Collectors.toList());

            return new PageImpl<>(projectDtoList, pageRequest, projectEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error retrieving Projects: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By ID
    public ProjectDTO findById(Long id) {
        try {
            Project project = projectService.getById(id);

            // Crear el DTO manualmente y mapear los campos esenciales
            ProjectDTO projectDto = new ProjectDTO();
            projectDto.setProjectId(project.getProjectId());
            projectDto.setDescription(project.getDescription());
            projectDto.setProblem(project.getProblem());
            projectDto.setObjectives(project.getObjectives());
            projectDto.setJustification(project.getJustification());

            // Asignar manualmente el teamScrumId
            if (project.getFk_team_scrum_id() != null) {
                projectDto.setFk_team_scrum_id(project.getFk_team_scrum_id().getTeamScrumId());
            } else {
                projectDto.setFk_team_scrum_id(null);
            }

            return projectDto;
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Project By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // add
    public void add(Map<String, Object> json) {
        try {
            ProjectDTO projectDto = new ProjectDTO();
            projectDto = validationObject(json, projectDto);

            Project projectEntity = modelMapper.map(projectDto, Project.class);
            TeamScrum teamScrum = teamScrumService.getById(projectDto.getFk_team_scrum_id());
            projectEntity.setFk_team_scrum_id(teamScrum);

            projectService.create(projectEntity);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Creating Project: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long projectId, Map<String, Object> json){
        try {
            ProjectDTO projectDto = modelMapper.map(projectService.getById(projectId), ProjectDTO.class);
            Project projectEntity = modelMapper.map(this.validationObject(json, projectDto), Project.class);
            projectService.save(projectEntity);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Updating Project : " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long projectId){
        try {
            Project project = projectService.getById(projectId);
            projectService.delete(project);
        } catch (CustomException e){
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Deleting Project: " + e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }
}
