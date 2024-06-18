package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.ProjectBusiness;
import com.senacsf.aquiles.app.dto.ProjectDetailsDto;
import com.senacsf.aquiles.app.dto.ProjectDto;
import com.senacsf.aquiles.app.entities.Project;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectBusiness projectBusiness;

    @GetMapping("/all")
    public List<ProjectDto> findAllProjects() {
        return projectBusiness.findAll();
    }

    @PostMapping("/create")
    public void createProject(@RequestBody ProjectDto projectDto) {
        projectBusiness.create(projectDto);
    }

    @PutMapping("/update")
    public void updateProject(@RequestBody ProjectDto projectDto) {
        projectBusiness.update(projectDto);
    }

    @GetMapping("/details")
    public List<ProjectDetailsDto> getProjectDetails() {
        return projectBusiness.getProjectDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getById(@PathVariable("id") Long projectId) {
        ProjectDto projectDto = projectBusiness.getById(projectId);
        if (projectDto != null) {
            return ResponseEntity.ok(projectDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
