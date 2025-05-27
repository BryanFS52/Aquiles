package com.api.aquilesApi.Service;
/*
import com.api.aquilesApi.Entity.ChecklistEntity;
import com.api.aquilesApi.Entity.JuriesEntity;
import com.api.aquilesApi.Entity.ProjectEntity;
import com.api.aquilesApi.Repository.ChecklistRepository;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Repository.ProjectRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChecklistService implements Idao<ChecklistEntity, Long> {

    private final ChecklistRepository checklistRepository;
    private final ProjectRepository projectRepository;  // Repositorio de ProjectEntity
    private final JuriesRepository juriesRepository;    // Repositorio de JuriesEntity

    public ChecklistService(ChecklistRepository checklistRepository, ProjectRepository projectRepository, JuriesRepository juriesRepository) {
        this.checklistRepository = checklistRepository;
        this.projectRepository = projectRepository;
        this.juriesRepository = juriesRepository;
    }

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
        // Validar que el proyecto asociado no sea null
        if (entity.getAssociatedProject() == null) {
            throw new CustomException("El proyecto asociado es obligatorio", HttpStatus.BAD_REQUEST);
        }

        // Manejo de la relación ManyToOne con ProjectEntity
        Long projectId = entity.getAssociatedProject().getId();
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException("Project with id " + projectId + " not found", HttpStatus.NOT_FOUND));
        entity.setAssociatedProject(project);

        // Manejo de la relación ManyToMany con JuriesEntity
        if (entity.getJuries() != null && !entity.getJuries().isEmpty()) {
            Set<JuriesEntity> juries = new HashSet<>(
                    juriesRepository.findAllById(
                            entity.getJuries().stream()
                                    .map(JuriesEntity::getId)
                                    .collect(Collectors.toList())
                    )
            );
            entity.setJuries(juries);
        } else {
            entity.setJuries(new HashSet<>()); // evita null
        }

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
 */