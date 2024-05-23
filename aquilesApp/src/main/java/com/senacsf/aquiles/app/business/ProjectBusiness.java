package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.ProjectDetailsDto;
import com.senacsf.aquiles.app.dto.ProjectDto;
import com.senacsf.aquiles.app.dto.TeamsScrumDto;
import com.senacsf.aquiles.app.entities.Project;
import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.service.ProjectService;
import com.senacsf.aquiles.app.service.Teams_scrumService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class ProjectBusiness {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private Teams_scrumService teamsScrumService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ModelMapper modelMapper = new ModelMapper();

    public List<ProjectDto> findAll() {
        try {
            List<Project> projectsList = projectService.findAll();
            if (projectsList.isEmpty()) {
                return new ArrayList<>();
            }
            List<ProjectDto> projectDtoList = new ArrayList<>();
            projectsList.forEach(project -> projectDtoList.add(modelMapper.map(project, ProjectDto.class)));
            return projectDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting project");
        }
    }

    public void create(ProjectDto projectDto) {
        try {
            // Obtener el equipo scrum por su ID
            Long teamScrumId = projectDto.getFk_team_scrum_id();
            Teams_scrum teamScrum = teamsScrumService.getById(teamScrumId);
            if (teamScrum == null) {
                throw new CustomException("Team Scrum with ID " + teamScrumId + " does not exist.");
            }

            // Verificar si el equipo scrum ya tiene un proyecto asociado
            List<Project> existingProjects = projectService.findAll();
            for (Project existingProject : existingProjects) {
                if (existingProject.getFk_team_scrum_id().getTeam_scrum_id().equals(teamScrumId)) {
                    throw new CustomException("Team Scrum with ID " + teamScrumId + " already has a project associated.");
                }
            }

            // Mapear el DTO a la entidad Project
            Project project = modelMapper.map(projectDto, Project.class);

            // Asignar el equipo scrum a la entidad Project
            project.setFk_team_scrum_id(teamScrum);

            // Guardar el nuevo proyecto usando el servicio
            Project savedProject = projectService.save(project);


        } catch (Exception e) {
            throw new CustomException("Error creating project");
        }
    }

    // Método para actualizar un Project
    public void update(ProjectDto projectDto) {
        try {
            // Obtener el proyecto existente por su ID
            Long projectId = projectDto.getProjectId();
            Project existingProject = projectService.getById(projectId);
            if (existingProject == null) {
                throw new CustomException("Project with ID " + projectId + " does not exist.");
            }

            // Obtener el equipo scrum por su ID
            Long teamScrumId = projectDto.getFk_team_scrum_id();
            Teams_scrum teamScrum = teamsScrumService.getById(teamScrumId);
            if (teamScrum == null) {
                throw new CustomException("Team Scrum with ID " + teamScrumId + " does not exist.");
            }

            // Mapear los campos del DTO a la entidad existente
            modelMapper.map(projectDto, existingProject);

            // Asignar el equipo scrum al proyecto
            existingProject.setFk_team_scrum_id(teamScrum);

            // Actualizar el proyecto usando el servicio
            projectService.update(existingProject);

        } catch (Exception e) {
            throw new CustomException("Error updating project");
        }
    }

    // Método para obtener detalles del proyecto usando la función almacenada
    public List<ProjectDetailsDto> getProjectDetails() {
        try {
            // Definir la consulta SQL para llamar a la función almacenada
            String sql = "SELECT * FROM get_project_details()";

            // Ejecutar la consulta SQL y mapear el resultado a una lista de ProjectDetailsDto
            return jdbcTemplate.query(sql, (rs, rowNum) -> new ProjectDetailsDto(
                    rs.getString("description"),   // Obtener la columna 'description' del resultado y asignarla al campo correspondiente en ProjectDetailsDto
                    rs.getString("problem"),       // Obtener la columna 'problem' del resultado y asignarla al campo correspondiente en ProjectDetailsDto
                    rs.getString("objectives"),    // Obtener la columna 'objectives' del resultado y asignarla al campo correspondiente en ProjectDetailsDto
                    rs.getString("justification"), // Obtener la columna 'justification' del resultado y asignarla al campo correspondiente en ProjectDetailsDto
                    rs.getString("name_project")   // Obtener la columna 'name_project' del resultado y asignarla al campo correspondiente en ProjectDetailsDto
            ));
        } catch (Exception e) {
            // Capturar cualquier excepción y lanzar una CustomException con un mensaje de error
            throw new CustomException("Error getting project details");
        }
    }

}
