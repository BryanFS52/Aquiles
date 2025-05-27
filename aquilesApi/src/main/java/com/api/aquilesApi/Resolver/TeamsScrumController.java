package com.api.aquilesApi.Resolver;


import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.DataConvert;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class TeamsScrumController {

    private final TeamsScrumBusiness teamsScrumBusiness;
    private final DataConvert dataConvert = new DataConvert();

    public TeamsScrumController(TeamsScrumBusiness teamsScrumBusiness) {
        this.teamsScrumBusiness = teamsScrumBusiness;
    };

    // FindAll TeamsScrums (GraphQL)
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
    public Map<String , Object> teamScrumById(@InputArgument String id){
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            TeamsScrumDto teamsScrumDto = this.teamsScrumBusiness.findById(idLong);
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
    public Map<String , Object>updateTeamScrum(@InputArgument String id , @InputArgument (name = "input")TeamsScrumDto teamsScrumDto){
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            teamsScrumBusiness.update(idLong, teamsScrumDto);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
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
    public Map<String, Object> deleteTeamScrum(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            teamsScrumBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
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