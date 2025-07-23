package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.FollowUpActionBusiness;
import com.api.aquilesApi.Dto.FollowUpActionDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.http.HttpStatus;
import java.util.Map;

@DgsComponent
public class FollowUpActionResolver {
    private final FollowUpActionBusiness followUpActionBusiness;

    public FollowUpActionResolver(FollowUpActionBusiness followUpActionBusiness) {
        this.followUpActionBusiness = followUpActionBusiness;
    }

    // FindAll FollowUpActions (GraphQl)
    @DgsQuery
    public Map<String, Object> AllFollowUpsAction(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<FollowUpActionDto> stateFollowUpsDtoPage = followUpActionBusiness.findAll(page, size);
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
                    "Error retriving FollowUpAction: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById FollowUpAction (GraphQl)
    @DgsQuery
    public Map<String, Object> FollowUpActionById(@InputArgument Long id) {
        try {
            FollowUpActionDto followUpActionDto = followUpActionBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    followUpActionDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving FollowUpAction: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new FollowUpAction (GraphQL)
    @DgsMutation
    public Map<String, Object> AddFollowUpAction(@InputArgument(name = "input") FollowUpActionDto followUpActionDto) {
        try {
            FollowUpActionDto followUpActionDto1 = followUpActionBusiness.add(followUpActionDto);
            return ResponseHttpApi.responseHttpAction(
                    followUpActionDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding FollowUp: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update FollowUpAction (GraphQL)
    @DgsMutation
    public Map<String , Object> UpdateFollowUpAction(@InputArgument Long id, @InputArgument(name = "input") FollowUpActionDto followUpActionDto ) {
        try {
            followUpActionBusiness.update(id, followUpActionDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error updating FollowUp: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}