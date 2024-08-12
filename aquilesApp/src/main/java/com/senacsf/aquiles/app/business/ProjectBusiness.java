package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.ProjectDetailsDto;
import com.senacsf.aquiles.app.dto.ProjectDto;
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
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class ProjectBusiness {

    private static final Logger LOGGER = Logger.getLogger(ProjectBusiness.class.getName());

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
            return projectsList.stream()
                    .map(project -> modelMapper.map(project, ProjectDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            LOGGER.severe("Error getting projects: " + e.getMessage());
            throw new CustomException("Error getting projects");
        }
    }

    public void create(ProjectDto projectDto) {
        try {
            Long teamScrumId = projectDto.getFk_team_scrum_id();
            Teams_scrum teamScrum = Optional.ofNullable(teamsScrumService.getById(teamScrumId))
                    .orElseThrow(() -> new CustomException("Team Scrum with ID " + teamScrumId + " does not exist."));

            boolean teamScrumHasProject = projectService.findAll().stream()
                    .anyMatch(existingProject -> existingProject.getFk_team_scrum_id().getTeam_scrum_id().equals(teamScrumId));

            if (teamScrumHasProject) {
                throw new CustomException("Team Scrum with ID " + teamScrumId + " already has a project associated.");
            }

            Project project = modelMapper.map(projectDto, Project.class);
            project.setFk_team_scrum_id(teamScrum);
            projectService.save(project);

        } catch (Exception e) {
            LOGGER.severe("Error creating project: " + e.getMessage());
            throw new CustomException("Error creating project");
        }
    }

    public void update(ProjectDto projectDto) {
        try {
            Long projectId = projectDto.getProjectId();
            Project existingProject = Optional.ofNullable(projectService.getById(projectId))
                    .orElseThrow(() -> new CustomException("Project with ID " + projectId + " does not exist."));

            Long teamScrumId = projectDto.getFk_team_scrum_id();
            Teams_scrum teamScrum = Optional.ofNullable(teamsScrumService.getById(teamScrumId))
                    .orElseThrow(() -> new CustomException("Team Scrum with ID " + teamScrumId + " does not exist."));

            modelMapper.map(projectDto, existingProject);
            existingProject.setFk_team_scrum_id(teamScrum);
            projectService.update(existingProject);

        } catch (Exception e) {
            LOGGER.severe("Error updating project: " + e.getMessage());
            throw new CustomException("Error updating project");
        }
    }

    public ProjectDto getById(Long projectId) {
        Project project = Optional.ofNullable(projectService.getById(projectId))
                .orElseThrow(() -> new CustomException("Project with ID " + projectId + " does not exist."));
        return modelMapper.map(project, ProjectDto.class);
    }
<<<<<<< HEAD

}
=======
}
>>>>>>> origin/jeissonDev
