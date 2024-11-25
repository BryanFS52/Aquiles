package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Project;
import com.api.aquilesApi.Repository.ProjectRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ProjectService implements Idao<Project , Long> {
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Page<Project> findAll(PageRequest pageRequest) {
        return projectRepository.findAll(pageRequest);
    }

    @Override
    public Project getById(Long id) {
        return projectRepository.findById(id).orElseThrow(() ->
                new CustomException("Project with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Project entity) {
        this.projectRepository.save(entity);
    }

    @Override
    public Project save(Project entity) {
        return projectRepository.save(entity);
    }

    @Override
    public void delete(Project entity) {
        this.projectRepository.delete(entity);
    }

    @Override
    public void create(Project entity) {
        this.projectRepository.save(entity);
    }
}
