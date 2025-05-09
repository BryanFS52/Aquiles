package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.TrainersBusiness;
import com.api.aquilesApi.Dto.TrainersDto;
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
public class TrainersController {

    private final TrainersBusiness trainersBusiness;

    public TrainersController(TrainersBusiness trainersBusiness) {
        this.trainersBusiness = trainersBusiness;
    }

    // FindAll Trainers (GraphQL)
    @QueryMapping
    public Map<String , Object> findAllTrainers(@Argument int page, @Argument int size){
        try {
            Page<TrainersDto> trainersDtoPage = trainersBusiness.findAll(page, size);
            if (!trainersDtoPage.isEmpty()){
                return ResponseHttpApi.responseHttpFindAll(
                        trainersDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        trainersDtoPage.getSize(),
                        trainersDtoPage.getTotalPages(),
                        (int) trainersDtoPage.getTotalElements());
            } else {
                return ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No Trainers found",
                        0,
                        0,
                        0);
            }
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Trainers: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Trainer (GraphQL)
    @QueryMapping
    public Map<String , Object> findByIdTrainer(@Argument Long id){
        try {
            TrainersDto trainersDto  = this.trainersBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    trainersDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (CustomException e){
            return ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error getting Trainer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new Trainer (GraphQL)
    @MutationMapping
    public Map<String , Object> addTrainer(@Argument TrainersDto trainerDto){
        try {
             TrainersDto trainerDto1 = trainersBusiness.add(trainerDto);
            return  ResponseHttpApi.responseHttpAction(
                    trainerDto1.getTrainerId(),
                    ResponseHttpApi.CODE_OK,
                    "Trainer added successfully");
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error adding Trainer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    // Update Trainer (GraphQL)
    @MutationMapping
    public Map<String , Object> updateTrainer(@Argument Long id , @Argument TrainersDto trainerDto){
        try {
            trainersBusiness.update(id , trainerDto);
            return  ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (CustomException e){
            return ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error updating Trainer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete Trainer (GraphQL)
    @MutationMapping
    public Map<String , Object> deleteTrainer(@Argument Long id){
            try {
                trainersBusiness.delete(id);
                return  ResponseHttpApi.responseHttpAction(
                        id,
                        ResponseHttpApi.CODE_OK,
                        "Delete ok"
                );
            } catch (Exception e) {
                return ResponseHttpApi.responseHttpError(
                        "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
    }
}