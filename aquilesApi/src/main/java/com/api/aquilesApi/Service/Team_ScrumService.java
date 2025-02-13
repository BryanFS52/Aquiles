package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Teams_ScrumEntity;
import com.api.aquilesApi.Repository.Team_ScrumRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class Team_ScrumService implements Idao<Teams_ScrumEntity , Long> {
    @Autowired // Inyecta automáticamente el repositorio Teams_scrumRepository
    private Team_ScrumRepository teamsScrumRepository;

    // Método para encontrar un equipo scrum por el nombre del proyecto
    @Transactional(readOnly = false)
    public Teams_ScrumEntity findByName_project(String name_project) {
        return teamsScrumRepository.findByNameProject(name_project); // Llama al método del repositorio para encontrar un equipo scrum por el nombre del proyecto
    }

    @Override
    public Page<Teams_ScrumEntity> findAll(PageRequest pageRequest) {
        return teamsScrumRepository.findAll(pageRequest);
    }

    @Override
    public Teams_ScrumEntity getById(Long id) {
        return teamsScrumRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Teams_ScrumEntity entity) {
        this.teamsScrumRepository.save(entity);
    }

    @Override
    public Teams_ScrumEntity save(Teams_ScrumEntity entity) {
        return teamsScrumRepository.save(entity);
    }

    @Override
    public void delete(Teams_ScrumEntity entity) {
        this.teamsScrumRepository.delete(entity);
    }

    @Override
    public void create(Teams_ScrumEntity entity) {
        this.teamsScrumRepository.save(entity);
    }
}
