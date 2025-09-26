package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ProcessMethodologyDto;
import com.api.aquilesApi.Dto.TeamScrumMemberIdDto;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamScrumMemberId;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.TeamScrumMap;
import com.api.aquilesApi.Utilities.Mapper.TeamScrumMemberIdMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TeamsScrumBusiness {

    private final TeamScrumService teamScrumService;

    public TeamsScrumBusiness(TeamScrumService teamScrumService) {
        this.teamScrumService = teamScrumService;
    }

    // Validation Object
    private void validationObject(TeamsScrumDto teamsScrumDto) throws CustomException {
        // Validate que memberIds no sea null y que no tenga más de 4 members
        if (teamsScrumDto.getMemberIds() != null && teamsScrumDto.getMemberIds().size() > 4) {
            throw new CustomException("A Team Scrum can have a maximum of 4 members.", HttpStatus.BAD_REQUEST);
        }

        // Solo continuar si memberIds no es null
        if (teamsScrumDto.getMemberIds() != null) {
            List<Long> memberIdList = teamsScrumDto.getMemberIds()
                    .stream()
                    .map(TeamScrumMemberIdDto::getStudentId)
                    .collect(Collectors.toList());

            boolean studentResult = teamScrumService.existsByStudySheetIdAndMemberIds(
                    teamsScrumDto.getStudySheetId(),
                    memberIdList
            );

            if (studentResult) {
                throw new CustomException(
                        "Some of the selected students are already assigned to a Team Scrum within this study sheet.",
                        HttpStatus.CONFLICT
                );
            }
        }
    }

    // Get all TeamsScrum (paginated)
    public Page<TeamsScrumDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<TeamsScrum> teamsScrumPage = teamScrumService.findAll(pageRequest);
            return TeamScrumMap.INSTANCE.EntityToDTOs(teamsScrumPage);
        } catch (Exception e) {
            throw new CustomException("Error retrieving TeamScrums: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find ById
    public TeamsScrumDto findById(Long id) {
        try {
            TeamsScrum teamsScrum = teamScrumService.getById(id);
            return TeamScrumMap.INSTANCE.EntityToDTO(teamsScrum);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Find By StudentId
    public List<TeamsScrumDto> findAllByStudentId(Long studentId) {
        try {
            List<TeamsScrum> teamsScrumList = teamScrumService.findAllByStudentId(studentId);
            return TeamScrumMap.INSTANCE.EntityToDTOs(teamsScrumList);
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By StudySheetId
    public List<TeamsScrumDto> findAllByStudySheetId(Long studySheetId) {
        try {
            List<TeamsScrum> entities = teamScrumService.findByStudySheetId(studySheetId);
            return TeamScrumMap.INSTANCE.EntityToDTOs(entities);
        } catch (Exception e) {
            throw new CustomException("Error getting TeamsScrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add new TeamScrum
    public TeamsScrumDto add(TeamsScrumDto teamsScrumDto) {
        try {
            validationObject(teamsScrumDto);
            TeamsScrum teamsScrum = new TeamsScrum();
            TeamScrumMap.INSTANCE.updateTeamScrum(teamsScrumDto, teamsScrum);
            TeamsScrum savedTeamScrum = teamScrumService.save(teamsScrum);
            return TeamScrumMap.INSTANCE.EntityToDTO(savedTeamScrum);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing TeamScrum
    public void update(Long teamScrumId, TeamsScrumDto teamsScrumDto) {
        try {
            teamsScrumDto.setId(teamScrumId);
            validationObject(teamsScrumDto);
            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);
            TeamScrumMap.INSTANCE.EntityToDTO(teamsScrum);

            // Validation explicit de memberIds
            if (teamsScrumDto.getMemberIds() != null) {
                List<TeamScrumMemberId> memberIds = teamsScrumDto.getMemberIds()
                        .stream()
                        .map(dto -> new TeamScrumMemberId(dto.getStudentId(), dto.getProfileId()))
                        .collect(Collectors.toList());

                teamsScrum.setMemberIds(memberIds);
            }

            teamScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error Updating Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add Profile to Student
    public List<TeamScrumMemberIdDto> addProfileToStudent(List<ProcessMethodologyDto> teamScrumMemberIds) {
        try {
            Long teamScrumId = teamScrumMemberIds.get(0).getTeamScrumId();
            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);

            for (ProcessMethodologyDto dto : teamScrumMemberIds) {
                // Validation Profile is unique
                if (Boolean.TRUE.equals(dto.getIsUnique())) {
                    boolean profileAlreadyExists = teamsScrum.getMemberIds().stream()
                            .anyMatch(m -> dto.getProfileId().equals(m.getProfileId()) &&
                                    !m.getStudentId().equals(dto.getStudentId()));

                    if (profileAlreadyExists) {
                        throw new CustomException("This profile is unique", HttpStatus.CONFLICT);
                    }
                }

                // Validation: Student cannot have two different profiles
                boolean studentAlreadyHasDifferentProfile = teamsScrum.getMemberIds().stream()
                        .anyMatch(m -> m.getStudentId().equals(dto.getStudentId())
                                && m.getProfileId() != null
                                && !m.getProfileId().isEmpty()
                                && !m.getProfileId().equals(dto.getProfileId()));

                if (studentAlreadyHasDifferentProfile) {
                    throw new CustomException("This student already has a different profile assigned", HttpStatus.CONFLICT);
                }

                // Assign profile to student
                teamsScrum.getMemberIds().stream()
                        .filter(m -> m.getStudentId().equals(dto.getStudentId()))
                        .findFirst()
                        .ifPresent(m -> m.setProfileId(dto.getProfileId()));
            }

            teamScrumService.save(teamsScrum);
            return TeamScrumMemberIdMap.INSTANCE.EntityToDTOs(teamsScrum.getMemberIds());

        } catch (Exception e) {
            throw new CustomException("Error Adding Profile to Student: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete TeamScrum by ID
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