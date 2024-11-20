package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.Follow_upsBusiness;
import com.api.aquilesApi.Dto.Follow_upsDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/followUp")
public class Follow_upsController {
    @Autowired
    private Follow_upsBusiness followUpsBusiness;

    //End-Point Para Traer Todos Los Follow Ups
    @GetMapping("/all")
    public ResponseEntity<Map<String , Object>> findAll(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size){
        try {
            Page<Follow_upsDto> followUpsDtoPage = followUpsBusiness.findAll(page, size);
            if (!followUpsDtoPage.isEmpty()){
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        followUpsDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        followUpsDtoPage.getSize(),
                        followUpsDtoPage.getTotalPages(),
                        (int) followUpsDtoPage.getTotalElements()),
                        HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No Follow Up found",
                        0,
                        0,
                        0),
                        HttpStatus.NO_CONTENT);
            }
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error retrieving Follow Ups: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Traer Por Id
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String , Object>> findById(@PathVariable Long id){
        try {
            Follow_upsDto followUpsDto = this.followUpsBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    followUpsDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting Follow Up By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // End-Point Crear Un Nuevo Follow Up
    @PostMapping("/create")
    public ResponseEntity<Map<String , Object>> add(@RequestBody Map<String ,Object> json){
        try {
            followUpsBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Follow Up added successfully"),
                    HttpStatus.CREATED);
        }catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding Follow Up: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Actualizar Un Follow Up
    @PutMapping("/update")
    public ResponseEntity<Map<String ,Object>> update(@PathVariable Long id ,  @RequestBody Map<String , Object> json ){
        try {
            followUpsBusiness.update(id, json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Trainer updated successfully"), HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error updating Follow Up: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Eliminar Un Follow Up
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String , Object>> delete (@PathVariable Long id){
        try {
            followUpsBusiness.delete(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Follow Up deleted successfully"),
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



