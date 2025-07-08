package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Repository.TeamScrumRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamScrumService implements Idao<TeamsScrum, Long> {
    private final TeamScrumRepository teamsScrumRepository;

    public TeamScrumService(TeamScrumRepository teamsScrumRepository) {
        this.teamsScrumRepository = teamsScrumRepository;
    }

    @Override
    public Page<TeamsScrum> findAll(PageRequest pageRequest) {
        return teamsScrumRepository.findAll(pageRequest);
    }

    @Override
    public TeamsScrum getById(Long id) {
        return teamsScrumRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    public List<TeamsScrum> findAllByStudentId(Long studentId) {
        return teamsScrumRepository.findByMemberId(studentId);
    }

    @Override
    public void update(TeamsScrum entity) {
        this.teamsScrumRepository.save(entity);
    }

    @Override
    public TeamsScrum save(TeamsScrum entity) {
        return teamsScrumRepository.save(entity);
    }

    @Override
    public void delete(TeamsScrum entity) {
        this.teamsScrumRepository.delete(entity);
    }

    @Override
    public void create(TeamsScrum entity) {
        this.teamsScrumRepository.save(entity);
    }
}
