package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.ProjectBusiness;
import com.senacsf.aquiles.app.dto.ProjectDetailsDto;
import com.senacsf.aquiles.app.dto.ProjectDto;
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
    public ResponseEntity<String> createProject(@RequestBody ProjectDto projectDto) {
        try {
            projectBusiness.create(projectDto);
            return ResponseEntity.status(201).body("Project created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating project.");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProject(@RequestBody ProjectDto projectDto) {
        try {
            projectBusiness.update(projectDto);
            return ResponseEntity.ok("Project updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating project.");
        }
    }

    @GetMapping("/details")
    public ResponseEntity<List<ProjectDetailsDto>> getProjectDetails() {
        try {
            List<ProjectDetailsDto> projectDetails = projectBusiness.getProjectDetails();
            return ResponseEntity.ok(projectDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getById(@PathVariable("id") Long projectId) {
        try {
            ProjectDto projectDto = projectBusiness.getById(projectId);
            if (projectDto != null) {
                return ResponseEntity.ok(projectDto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
