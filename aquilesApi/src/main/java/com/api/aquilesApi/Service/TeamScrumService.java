package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.TeamScrum;
import com.api.aquilesApi.Repository.TeamScrumRepository;
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
public class TeamScrumService implements Idao<TeamScrum , Long> {
    @Autowired // Inyecta automáticamente el repositorio Teams_scrumRepository
    private TeamScrumRepository teamsScrumRepository;

    // Método para encontrar un equipo scrum por el nombre del proyecto
    @Transactional(readOnly = false)
    public TeamScrum findByName_project(String name_project) {
        return teamsScrumRepository.findByNameProject(name_project); // Llama al método del repositorio para encontrar un equipo scrum por el nombre del proyecto
    }

    @Override
    public Page<TeamScrum> findAll(PageRequest pageRequest) {
        return teamsScrumRepository.findAll(pageRequest);
    }

    @Override
    public TeamScrum getById(Long id) {
        return teamsScrumRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(TeamScrum entity) {
        this.teamsScrumRepository.save(entity);
    }

    @Override
    public TeamScrum save(TeamScrum entity) {
        return teamsScrumRepository.save(entity);
    }

    @Override
    public void delete(TeamScrum entity) {
        this.teamsScrumRepository.delete(entity);
    }

    @Override
    public void create(TeamScrum entity) {
        this.teamsScrumRepository.save(entity);
    }
}
