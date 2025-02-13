package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.TrainersBusiness;
import com.api.aquilesApi.Dto.TrainersDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/trainers")
public class TrainersController {
    @Autowired
    private TrainersBusiness trainersBusiness;

    //End-Point Para Traer Todos Los Trainers
    @GetMapping("/all")
    public ResponseEntity<Map<String , Object>> findAll(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size){
        try {
            Page<TrainersDto> trainersDtoPage = trainersBusiness.findAll(page, size);
            if (!trainersDtoPage.isEmpty()){
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        trainersDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        trainersDtoPage.getSize(),
                        trainersDtoPage.getTotalPages(),
                        (int) trainersDtoPage.getTotalElements()),
                        HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No Trainers found",
                        0,
                        0,
                        0),
                        HttpStatus.NO_CONTENT);
            }
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error retrieving Trainers: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Traer Un Trainer Por Id
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String , Object>> findById(@PathVariable Long id){
        try {
            TrainersDto trainersDto  = this.trainersBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    trainersDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting Trainer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //End-Point Para Crear Un Nuevo Trainer
    @PostMapping("/create")
    public ResponseEntity<Map<String , Object>> add (@RequestBody Map<String , Object> json){
        try {
            trainersBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Trainer added successfully"),
                    HttpStatus.CREATED);
        }catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding Trainer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //End-Point Para Actualizar Un Trainer
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String , Object>> update (@PathVariable Long id , @RequestBody Map<String , Object> json){
        try {
            trainersBusiness.update(id , json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Trainer updated successfully"), HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error updating Trainer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    //End-Point Para Eliminar un Trainer
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String , Object>> delete (@PathVariable Long id){
            try {
                trainersBusiness.delete(id);
                return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                        ResponseHttpApi.CODE_OK, "Attendance deleted successfully"),
                        HttpStatus.OK);
            } catch (CustomException e) {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                        e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                        HttpStatus.BAD_REQUEST);
            } catch (Exception e) {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                        "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
    }

}
