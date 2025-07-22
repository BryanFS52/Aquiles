package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
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
    public Page<TeamsScrumDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<TeamsScrum> teamsScrumEntityPage = teamScrumService.findAll(pageRequest);

            List<TeamsScrumDto> teamsScrumDtoList = teamsScrumEntityPage.getContent()
                    .stream()
                    .map(entity -> modelMapper.map(entity, TeamsScrumDto.class))
                    .collect(Collectors.toList());

            return new PageImpl<>(teamsScrumDtoList, pageRequest, teamsScrumEntityPage.getTotalElements());
        } catch (Exception e) {
            throw new CustomException("Error retrieving TeamScrums: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find ById
    public TeamsScrumDto findById(Long id) {
        try {
            TeamsScrum teamsScrum = teamScrumService.getById(id);
            modelMapper.typeMap(TeamsScrum.class, TeamsScrumDto.class)
                    .addMapping(TeamsScrum::getId, TeamsScrumDto::setId);

            return modelMapper.map(teamsScrum, TeamsScrumDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Find By StudentId
    public List<TeamsScrumDto> findAllByStudentId(Long studentId) {
        try {
            System.out.println(studentId);
            List<TeamsScrum> teamsScrumList = teamScrumService.findAllByStudentId(studentId);
            return teamsScrumList.stream()
                    .map(entity -> modelMapper.map(entity, TeamsScrumDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add
    public TeamsScrumDto add(TeamsScrumDto teamsScrumDto) {
        try {
            TeamsScrum teamsScrum = modelMapper.map(teamsScrumDto, TeamsScrum.class);
            return modelMapper.map(teamScrumService.save(teamsScrum), TeamsScrumDto.class);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long teamScrumId, TeamsScrumDto teamsScrumDto) {
        try {
            teamsScrumDto.setId(teamScrumId);
            validationObject(teamsScrumDto);

            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);
            modelMapper.map(teamsScrumDto, teamsScrum);
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

    // a

}