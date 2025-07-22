/*
package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.FollowUpBusiness;
import com.api.aquilesApi.Dto.StateFollowUpsDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class FollowUpResolver {
    private final FollowUpBusiness followUpBusiness;

    public FollowUpResolver(FollowUpBusiness followUpBusiness) {
        this.followUpBusiness = followUpBusiness;
    }

    // FindAll followUps (GraphQl)
    @DgsQuery
    public Map<String, Object> AllFollowUps(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<StateFollowUpsDto> stateFollowUpsDtoPage = followUpBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    stateFollowUpsDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    stateFollowUpsDtoPage.getTotalPages(),
                    page,
                    (int) stateFollowUpsDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retriving FollowUps: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindID followUps (GraphQl)
    @DgsQuery
    public Map<String, Object> followUpById(@InputArgument Long id) {
        try {
            StateFollowUpsDto stateFollowUpsDto = followUpBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    stateFollowUpsDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving FollowUps: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new followUps (GraphQL)
    @DgsMutation
    public Map<String, Object> AddFollowUp(@InputArgument(name = "input") StateFollowUpsDto stateFollowUpsDto) {
        try {
            StateFollowUpsDto stateFollowUpsDto1 = followUpBusiness.add(stateFollowUpsDto);
            return ResponseHttpApi.responseHttpAction(
                    stateFollowUpsDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding FollowUp: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
 */
