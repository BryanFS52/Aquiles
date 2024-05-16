package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Project;
import com.senacsf.aquiles.app.repository.ProjectRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService implements Idao<Project, Long> {

    @Autowired
    ProjectRepository projectRepository;

    @Override
    public List<Project> findAll() {
        return List.of();
    }

    @Override
    public Project getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Project obje) {
        this.projectRepository.save(obje);
    }

    @Override
    public void save(Project obje) {
        this.projectRepository.save(obje);
    }

    @Override
    public void create(Project obje) {
        this.projectRepository.save(obje);
    }

    @Override
    public void delete(Project obje) {
        this.projectRepository.delete(obje);
    }

}
