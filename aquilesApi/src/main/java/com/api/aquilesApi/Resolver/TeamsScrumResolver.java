package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.ProcessMethodologyDto;
import com.api.aquilesApi.Dto.TeamScrumMemberIdDto;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Exception.BadRequestException;
import com.api.aquilesApi.Utilities.Exception.NotFoundException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@DgsComponent
public class TeamsScrumResolver {

    private final TeamsScrumBusiness teamsScrumBusiness;

    public TeamsScrumResolver(TeamsScrumBusiness teamsScrumBusiness) {
        this.teamsScrumBusiness = teamsScrumBusiness;
    };

    // FindAll TeamScrums (GraphQL)
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
                throw new NotFoundException("No TeamScrums found");
            }
        } catch (Exception e){
            throw new RuntimeException("Unexpected error in allTeamsScrums: " + e.getMessage(), e);
        }
    }

    // FindById TeamScrum (GraphQL)
    @DgsQuery
    public Map<String , Object> teamScrumById(@InputArgument Long id){
        try {
            TeamsScrumDto teamsScrumDto = teamsScrumBusiness.findById(id);
            if (teamsScrumDto == null) {
                throw new NotFoundException("TeamScrum not found for id: " + id);
            }
            return ResponseHttpApi.responseHttpFindId(
                    teamsScrumDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (Exception e){
            throw new RuntimeException("Unexpected error in teamScrumById: " + e.getMessage(), e);
        }
    }

    // Add a new teamScrum (GraphQL)
    @DgsMutation
    public Map<String , Object>addTeamScrum(@InputArgument(name = "input")TeamsScrumDto teamsScrumDto){
        try {
            if (teamsScrumDto == null) {
                throw new BadRequestException("TeamScrum input cannot be null");
            }
            TeamsScrumDto teamsScrumDto1 = teamsScrumBusiness.add(teamsScrumDto);
            return ResponseHttpApi.responseHttpAction(
                    teamsScrumDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Team Scrum added successfully");
        } catch (Exception e){
            throw new RuntimeException("Unexpected error in addTeamScrum: " + e.getMessage(), e);
        }
    }

    // Add a profile to a student (GraphQL)
    @DgsMutation
    public Map<String, Object> addProfileToStudent(@InputArgument(name = "input") List <ProcessMethodologyDto> processMethodologyDto) {
        try {
            List<TeamScrumMemberIdDto> updatedTeamsScrum = teamsScrumBusiness.addProfileToStudent(processMethodologyDto);
            return ResponseHttpApi.responseHttpMultiAction(
                    updatedTeamsScrum,
                    ResponseHttpApi.CODE_OK,
                    "Profile added to Student successfully");
        } catch (CustomException e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Profile to Student: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
                    "Error updating TeamScrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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