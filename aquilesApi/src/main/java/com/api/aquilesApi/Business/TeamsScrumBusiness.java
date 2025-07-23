package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.MapStruct.TeamScrumMap;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Component
public class TeamsScrumBusiness {

    private final TeamScrumService teamScrumService;    
    private final ModelMapper modelMapper;

    public TeamsScrumBusiness(TeamScrumService teamScrumService, ModelMapper modelMapper) {
        this.teamScrumService = teamScrumService;
        this.modelMapper = modelMapper;
    }

    // Validation object
    public void validationObject(TeamsScrumDto teamsScrumDto) throws CustomException {
        // Validation max 4 members
        if (teamsScrumDto.getMemberIds() != null && teamsScrumDto.getMemberIds().size() > 4) {
            throw new CustomException("A Team Scrum can have a maximum of 4 members.", HttpStatus.BAD_REQUEST);
        }

        boolean studentResult = teamScrumService.existsByStudySheetIdAndMemberIds(
                teamsScrumDto.getStudySheetId(),
                teamsScrumDto.getMemberIds()
        );

        if (studentResult) {
            throw new CustomException("Some of the selected students are already assigned to a Team Scrum within this study sheet.", HttpStatus.CONFLICT);
        }
    }

    // Find All
    public Page<TeamsScrumDto> findAll(Pageable pageable) {
        try {
            PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
            Page<TeamsScrum> teamsScrumPage = teamScrumService.findAll(pageRequest);
            if (teamsScrumPage.isEmpty()) return Page.empty();
            return TeamScrumMap.INSTANCE.teamScrumToTeamScrumDtoPage(teamsScrumPage);
        } catch (Exception e) {
            throw new CustomException("Error retrieving TeamScrums: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find ById
    public TeamsScrumDto findById(Long id) {
        try {
            TeamsScrum teamsScrum = teamScrumService.getById(id);
            return TeamScrumMap.INSTANCE.teamScrumToTeamScrumDto(teamsScrum);
        } catch (NoSuchElementException e) {
            throw new CustomException("Attendance not found.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Find By StudentId
    public List<TeamsScrumDto> findAllByStudentId(Long studentId) {
        try {
            List<TeamsScrum> teamsScrumList = teamScrumService.findAllByStudentId(studentId);
            return teamsScrumList.stream()
                    .map(entity -> modelMapper.map(entity, TeamsScrumDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By StudySheetId
    public List<TeamsScrumDto> findAllByStudySheetId(Long studySheetId) {
        List<TeamsScrum> entities = teamScrumService.findByStudySheetId(studySheetId);
        List<TeamsScrumDto> dtos = new ArrayList<>();
        if (entities != null) {
            for (TeamsScrum entity : entities) {
                TeamsScrumDto dto = modelMapper.map(entity, TeamsScrumDto.class);
                System.out.println("✅ DTO mapeado: " + dto);
                dtos.add(dto);
            }
        }
        return dtos;
    }

    // Add
    public TeamsScrumDto add(TeamsScrumDto teamsScrumDto) {
        try {
            TeamsScrum teamsScrum = TeamScrumMap.INSTANCE.teamScrumDtoToTeamScrum(teamsScrumDto);
            TeamsScrum saved = teamScrumService.save(teamsScrum);
            return TeamScrumMap.INSTANCE.teamScrumToTeamScrumDto(teamsScrum);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long teamScrumId, TeamsScrumDto teamsScrumDto) {
        try {
            validationObject(teamsScrumDto);
            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);
            TeamScrumMap.INSTANCE.updateTeamScrumFromDto(teamsScrumDto, teamsScrum);
            teamScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error Updating Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long teamScrumId) {
        try {
            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);
            teamScrumService.delete(teamsScrum);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}