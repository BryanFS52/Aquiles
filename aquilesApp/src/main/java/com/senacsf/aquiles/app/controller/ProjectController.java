package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.ProjectBusiness;
import com.senacsf.aquiles.app.dto.ProjectDto;
import org.springframework.beans.factory.annotation.Autowired;
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


}
