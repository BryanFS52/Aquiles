package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.ProjectBusiness;
import com.senacsf.aquiles.app.dto.ProjectDetailsDto;
import com.senacsf.aquiles.app.dto.ProjectDto;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectBusiness projectBusiness;

    @GetMapping("/all")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projectDtoList = projectBusiness.findAll();
        if (projectDtoList.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(projectDtoList);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProjectById(@PathVariable Long id) {
        try {
            ProjectDto project = projectBusiness.getById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", project);
            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createProject(@Validated @RequestBody ProjectDto projectDto) {
        try {
            projectBusiness.create(projectDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Project Created Successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateProject( @Validated @RequestBody ProjectDto projectDto) {
        try {
            projectBusiness.update(projectDto);
            Map<String , Object> response = new HashMap<>();
            response.put("status" , "success");
            response.put("message" , "Project updated successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    private ResponseEntity<Map<String, Object>> handleException(CustomException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
