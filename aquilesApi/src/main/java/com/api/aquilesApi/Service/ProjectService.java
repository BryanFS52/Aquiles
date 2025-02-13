package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ProjectEntity;
import com.api.aquilesApi.Repository.ProjectRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService implements Idao<ProjectEntity , Long> {
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Page<ProjectEntity> findAll(PageRequest pageRequest) {
        return projectRepository.findAll(pageRequest);
    }

    @Override
    public ProjectEntity getById(Long id) {
        return projectRepository.findById(id).orElseThrow(() ->
                new CustomException("Project with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ProjectEntity entity) {
        this.projectRepository.save(entity);
    }

    @Override
    public ProjectEntity save(ProjectEntity entity) {
        return projectRepository.save(entity);
    }

    @Override
    public void delete(ProjectEntity entity) {
        this.projectRepository.delete(entity);
    }

    @Override
    public void create(ProjectEntity entity) {
        this.projectRepository.save(entity);
    }
}
