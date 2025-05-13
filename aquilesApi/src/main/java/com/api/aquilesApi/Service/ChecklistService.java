package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistEntity;
import com.api.aquilesApi.Entity.JuriesEntity;
import com.api.aquilesApi.Entity.ProjectEntity;
import com.api.aquilesApi.Repository.ChecklistRepository;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Repository.ProjectRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChecklistService implements Idao<ChecklistEntity, Long> {

    @Autowired
    private ChecklistRepository checklistRepository;

    @Autowired
    private ProjectRepository projectRepository;  // Repositorio de ProjectEntity

    @Autowired
    private JuriesRepository juriesRepository;    // Repositorio de JuriesEntity

    @Override
    public Page<ChecklistEntity> findAll(PageRequest pageRequest) {
        return checklistRepository.findAll(pageRequest);
    }

    @Override
    public ChecklistEntity getById(Long id) {
        return checklistRepository.findById(id).orElseThrow(() ->
                new CustomException("CheckList with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(ChecklistEntity entity) {
        checklistRepository.save(entity);
    }


    @Override
    public ChecklistEntity save(ChecklistEntity entity) {
        // Manejo de la relación ManyToOne con ProjectEntity
        ProjectEntity project = projectRepository.findById(entity.getAssociatedProject().getId())
                .orElseThrow(() -> new CustomException("Project with id " + entity.getAssociatedProject().getId() + " not found", HttpStatus.NOT_FOUND));
        entity.setAssociatedProject(project);

        // Manejo de la relación ManyToMany con JuriesEntity
        Set<JuriesEntity> juries = new HashSet<>(
                juriesRepository.findAllById(
                        entity.getJuries().stream()
                                .map(JuriesEntity::getId)
                                .collect(Collectors.toList())
                )
        );
        entity.setJuries(juries);

        return checklistRepository.save(entity);
    }

    @Override
    public void delete(ChecklistEntity entity) {
        checklistRepository.delete(entity);
    }

    @Override
    public void create(ChecklistEntity entity) {
        // Al crear la entidad, también necesitamos manejar las relaciones como en el método `save`
        save(entity);
    }
}
