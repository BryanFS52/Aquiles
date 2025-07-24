package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.Profile;
import com.api.aquilesApi.Dto.Student;
import com.api.aquilesApi.Dto.StudySheet;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.*;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@DgsComponent
public class TeamsScrumResolver {

    private final TeamsScrumBusiness teamsScrumBusiness;
    private final ModelMapper modelMapper;

    public TeamsScrumResolver(TeamsScrumBusiness teamsScrumBusiness, ModelMapper modelMapper) {
        this.teamsScrumBusiness = teamsScrumBusiness;
        this.modelMapper = modelMapper;
    };

    @DgsEntityFetcher(name = "Profile")
    public Profile getProfile(Map<String, Object> values) {
        String id = (String) values.get("id");
        if (id == null) return null;
        Profile profile = new Profile();
        profile.setId(id);
        return profile;
    }

    @DgsEntityFetcher(name = "StudySheet")
    public StudySheet studySheetReference(Map<String, Object> values) {
        System.out.println("→ Resolviendo entidad federada StudySheet con values: " + values);
        String idStr = (String) values.get("id");
        Long id  = Long.parseLong(idStr);
        return new StudySheet(id);
    }

    @DgsEntityFetcher(name = "TeamsScrum")
    public TeamsScrum teamScrum(Map<String, Object> values) {
        try {
            System.out.println(values);
            Long id = values.get("id") != null ? Long.valueOf((String) values.get("id")) : null;
            TeamsScrumDto dto = teamsScrumBusiness.findById(id);
            return modelMapper.map(dto, TeamsScrum.class);
        } catch (CustomException e) {
            System.out.println("TeamsScrum no encontrado: " + e.getMessage());
            return null;
        }
    }

    @DgsData(parentType = "StudySheet", field = "teamsScrum")
    public List<TeamsScrum> teamScrums(DgsDataFetchingEnvironment dfe) {
        StudySheet studySheet = dfe.getSource();
        assert studySheet != null;
        Long studySheetId = studySheet.getId();

        List<TeamsScrumDto> dtos = teamsScrumBusiness.findAllByStudySheetId(studySheetId);

        return dtos.stream()
                .map(dto -> modelMapper.map(dto, TeamsScrum.class))
                .collect(Collectors.toList());
    }

    @DgsData(parentType = "Student", field = "teamScrums")
    public List<TeamsScrum> teamsScrum(DgsDataFetchingEnvironment env) {
        Student student = env.getSource();
        assert student != null;
        Long studentId = student.getId();

        List<TeamsScrumDto> teamsScrumDtoList = teamsScrumBusiness.findAllByStudentId(studentId);

        return teamsScrumDtoList.stream()
                .map(dto -> modelMapper.map(dto, TeamsScrum.class))
                .collect(Collectors.toList());
    }

    @DgsData(parentType = "Student", field = "profiles")
    public List<Map<String, String>> profilesReference(DgsDataFetchingEnvironment env) {
        Object source = env.getSource();

        Long studentId;

        if (source instanceof Map<?, ?> map && map.containsKey("id")) {
            studentId = Long.parseLong(map.get("id").toString());
        } else {
            return Collections.emptyList();
        }

        List<TeamsScrumDto> teamsScrumDtoList = teamsScrumBusiness.findAllByStudentId(studentId);

        return teamsScrumDtoList.stream()
                .flatMap(dto -> dto.getMemberIds().stream())
                .filter(member -> member.getProfileId() != null)
                .map(member -> Map.of("id", member.getProfileId()))
                .collect(Collectors.toList());

    }

    @DgsData(parentType = "TeamsScrum", field = "studySheet")
    public Map<String, Object> resolveStudySheet(DgsDataFetchingEnvironment env) {
        Object source = env.getSource();
        assert source != null;
        System.out.println("Source class: " + source.getClass());

        TeamsScrum teamsScrum;
        if (source instanceof TeamsScrumDto) {
            teamsScrum = modelMapper.map((TeamsScrumDto) source, TeamsScrum.class);
        } else {
            teamsScrum = (TeamsScrum) source;
        }

        if (teamsScrum == null || teamsScrum.getStudySheetId() == null) {
            return null;
        }

        return Map.of("id", teamsScrum.getStudySheetId().toString());
    }
/*
    @DgsData(parentType = "TeamScrum", field = "processMethodology")
    public Map<String, Object> resolveProcessMethodology(DgsDataFetchingEnvironment env) {
        Object source = env.getSource();
        assert source != null;
        System.out.println("Source class: " + source.getClass());

        TeamsScrum teamsScrum;
        if (source instanceof TeamsScrumDto) {
            teamsScrum = modelMapper.map((TeamsScrumDto) source, TeamsScrum.class);
        } else {
            teamsScrum = (TeamsScrum) source;
        }

        if (teamsScrum == null || teamsScrum.getProcessMethodologyId() == null) {
            return null;
        }

        return Map.of("id", teamsScrum.getProcessMethodologyId().toString());
    }

 */

    @DgsQuery
    public Map<String , Object> allTeamsScrums(@InputArgument Integer page, @InputArgument Integer size){
        try {
            Page<TeamsScrumDto> teamsScrumDtoPage = teamsScrumBusiness.findAll(page, size);
            if (!teamsScrumDtoPage.isEmpty()){
                return ResponseHttpApi.responseHttpFindAll(
                        teamsScrumDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        teamsScrumDtoPage.getSize(),
                        teamsScrumDtoPage.getTotalPages(),
                        (int) teamsScrumDtoPage.getTotalElements());
            } else {
                return ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No TeamScrums found",
                        0,
                        0,
                        0);
            }
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Teams Scrums: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById TeamScrum (GraphQL)
    @DgsQuery
    public Map<String , Object> teamScrumById(@InputArgument Long id){
        try {
            TeamsScrumDto teamsScrumDto = this.teamsScrumBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    teamsScrumDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error getting Team Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new teamScrum (GraphQL)
    @DgsMutation
    public Map<String , Object>addTeamScrum(@InputArgument(name = "input")TeamsScrumDto teamsScrumDto){
        try {
            TeamsScrumDto teamsScrumDto1 = teamsScrumBusiness.add(teamsScrumDto);
            return ResponseHttpApi.responseHttpAction(
                    teamsScrumDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Team Scrum added successfully");
        } catch (CustomException e){
            return ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error adding Team Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update TeamScrum (GraphQL)
    @DgsMutation
    public Map<String , Object>updateTeamScrum(@InputArgument Long id , @InputArgument (name = "input")TeamsScrumDto teamsScrumDto){
        try {
            teamsScrumBusiness.update(id, teamsScrumDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error updating Team Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete TeamScrum (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteTeamScrum(@InputArgument Long id) {
        try {
            teamsScrumBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (CustomException e) {
            return ResponseHttpApi.responseHttpError(
                    e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting TeamScrum: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}