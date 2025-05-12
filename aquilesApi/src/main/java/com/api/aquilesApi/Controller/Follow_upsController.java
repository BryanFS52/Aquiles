package com.api.aquilesApi.Controller;


import com.api.aquilesApi.Business.Follow_upsBusiness;
import com.api.aquilesApi.Dto.Follow_upsDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class Follow_upsController {
    private final Follow_upsBusiness followUpsBusiness;

    public Follow_upsController(Follow_upsBusiness followUpsBusiness) {
        this.followUpsBusiness = followUpsBusiness;
    };

    // FindAll FollowUps (GraphQL)
    @QueryMapping
    public Map<String , Object> allFollowUps(@Argument int page, @Argument int size){
        try {
            Page<Follow_upsDto> followUpsDtoPage = followUpsBusiness.findAll(page, size);
                return ResponseHttpApi.responseHttpFindAll(
                        followUpsDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        followUpsDtoPage.getSize(),
                        followUpsDtoPage.getTotalPages(),
                        (int) followUpsDtoPage.getTotalElements()
                );
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Follow Ups: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById (GraphQL)
    @QueryMapping
    public Map<String , Object> followUpById(@Argument Long id){
        try {
            Follow_upsDto followUpsDto = this.followUpsBusiness.findById(id);
            return  ResponseHttpApi.responseHttpFindId(
                    followUpsDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"
            );
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error getting Follow Up By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Add New FollowUp (GraphQL)
    @MutationMapping
    public Map<String , Object> addFollowUp(@Argument("input") Follow_upsDto followUpsDto){
        try {
            Follow_upsDto followUpsDto1 = followUpsBusiness.add(followUpsDto);
            return  ResponseHttpApi.responseHttpAction(
                    followUpsDto1.getFollowUpId(),
                    ResponseHttpApi.CODE_OK,
                    "Follow Up added successfully"
            );
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error adding Follow Up: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update FollowUp (GraphQL)
    @MutationMapping
    public Map<String ,Object> updateFollowUp(@Argument Long id, @Argument("input")Follow_upsDto followUpsDto){
        try {
            followUpsBusiness.update(id, followUpsDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error updating Follow Up: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete FollowUp (GraphQL)
    @MutationMapping
    public Map<String , Object> deleteFollowUp(@Argument Long id){
        try {
            followUpsBusiness.delete(id);
            return  ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}