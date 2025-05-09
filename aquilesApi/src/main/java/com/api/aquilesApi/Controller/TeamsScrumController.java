package com.api.aquilesApi.Controller;


import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class TeamsScrumController {

    private final TeamsScrumBusiness teamsScrumBusiness;

    public TeamsScrumController(TeamsScrumBusiness teamsScrumBusiness) {
        this.teamsScrumBusiness = teamsScrumBusiness;
    };

    // FindAll TeamsScrums (GraphQL)
    @QueryMapping
    public Map<String , Object> allTeamsScrums(@Argument int page, @Argument int size){
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
                        "No attendances found",
                        0,
                        0,
                        0);
            }
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Teams Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById TeamScrum (GraphQL)
    @QueryMapping
    public Map<String , Object> teamScrumById(@Argument Long id){
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
    @MutationMapping
    public Map<String , Object>addTeamScrum(@Argument("input")TeamsScrumDto teamsScrumDto){
        try {
            TeamsScrumDto teamsScrumDto1 = teamsScrumBusiness.add(teamsScrumDto);
            return ResponseHttpApi.responseHttpAction(
                    teamsScrumDto1.getTeamScrumId(),
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
    @MutationMapping
    public Map<String , Object>updateTeamScrum(@Argument Long id , @Argument ("input")TeamsScrumDto teamsScrumDto){
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
    @MutationMapping
    public Map<String , Object> deleteTeamScrum(@Argument Long id) {
        {
            try {
                teamsScrumBusiness.delete(id);
                return ResponseHttpApi.responseHttpAction(
                        id,
                        ResponseHttpApi.CODE_OK,
                        "Delete ok"
                );
            } catch (CustomException e) {
                return ResponseHttpApi.responseHttpError(
                        e.getMessage(), HttpStatus.BAD_REQUEST);
            } catch (Exception e) {
                return ResponseHttpApi.responseHttpError(
                        "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}