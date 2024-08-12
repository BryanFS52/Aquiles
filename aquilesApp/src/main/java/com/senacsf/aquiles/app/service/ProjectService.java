package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Project;
import com.senacsf.aquiles.app.repository.ProjectRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService implements Idao<Project, Long> {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = false)
    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = false)
    public Project getById(Long projectId) {
        return projectRepository.findById(projectId).orElse(null);
    }

    @Override
    @Transactional(readOnly = false)
    public void update(Project entity) {
        this.projectRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = false)
    public Project save(Project entity) {
        return this.projectRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = false)
    public void create(Project entity) {
        this.projectRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Project entity) {
        this.projectRepository.delete(entity);
    }

    public Project findByDescription(String description) {
        return projectRepository.findByDescription(description);
    }

}
