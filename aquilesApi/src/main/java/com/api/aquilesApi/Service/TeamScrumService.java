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

    // Get all scrum teams paginated
    @Override
    public Page<TeamsScrum> findAll(PageRequest pageRequest) {
        return teamsScrumRepository.findAll(pageRequest);
    }

    // Get scrumTeam by ID or throw exception if not found
    @Override
    public TeamsScrum getById(Long id) {
        return teamsScrumRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    // Get all teams where the student is a member
    public List<TeamsScrum> findAllByStudentId(Long studentId) {
        return teamsScrumRepository.findByMemberIds_StudentId(studentId);
    }

    // Get teams by associated study sheet ID
    public List<TeamsScrum> findByStudySheetId(Long studySheetId) {
        return teamsScrumRepository.findByStudySheetId(studySheetId);
    }

    // Update an existing scrum team
    @Override
    public void update(TeamsScrum entity) {
        this.teamsScrumRepository.save(entity);
    }

    // Save a scrum team (create or update)
    @Override
    public TeamsScrum save(TeamsScrum entity) {
        return teamsScrumRepository.save(entity);
    }

    // Delete a scrum team
    @Override
    public void delete(TeamsScrum entity) {
        this.teamsScrumRepository.delete(entity);
    }

    // Create a new scrum team
    @Override
    public void create(TeamsScrum entity) {
        this.teamsScrumRepository.save(entity);
    }

    // Check if team exists for a study sheet and members
    public boolean existsByStudySheetIdAndMemberIds(Long studySheetId, List<Long> memberIds) {
        return teamsScrumRepository.existsByStudySheetIdAndMemberIds(studySheetId, memberIds);
    }
}