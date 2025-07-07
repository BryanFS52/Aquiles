package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.TeamsScrumEntity;
import com.api.aquilesApi.Repository.TeamScrumRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamScrumService implements Idao<TeamsScrumEntity, Long> {
    private final TeamScrumRepository teamsScrumRepository;

    public TeamScrumService(TeamScrumRepository teamsScrumRepository) {
        this.teamsScrumRepository = teamsScrumRepository;
    }

    @Override
    public Page<TeamsScrumEntity> findAll(PageRequest pageRequest) {
        return teamsScrumRepository.findAll(pageRequest);
    }

    @Override
    public TeamsScrumEntity getById(Long id) {
        return teamsScrumRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    public List<TeamsScrumEntity> findAllByStudentId(Long studentId) {
        return teamsScrumRepository.findByMemberId(studentId);
    }

    @Override
    public void update(TeamsScrumEntity entity) {
        this.teamsScrumRepository.save(entity);
    }

    @Override
    public TeamsScrumEntity save(TeamsScrumEntity entity) {
        return teamsScrumRepository.save(entity);
    }

    @Override
    public void delete(TeamsScrumEntity entity) {
        this.teamsScrumRepository.delete(entity);
    }

    @Override
    public void create(TeamsScrumEntity entity) {
        this.teamsScrumRepository.save(entity);
    }
}
