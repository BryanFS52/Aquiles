package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.Teams_ScrumBusiness;
import com.api.aquilesApi.Dto.Teams_ScrumDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/teamScrum")
public class Teams_ScrumController {

    @Autowired
    private Teams_ScrumBusiness teamsScrumBusiness;

    //End-Point Para Traer Todos Los Teams Scrum
    @GetMapping("/all")
    public ResponseEntity<Map<String , Object>> findAll(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size){
        try {
            Page<Teams_ScrumDto> teamsScrumDtoPage = teamsScrumBusiness.findAll(page, size);
            if (!teamsScrumDtoPage.isEmpty()){
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        teamsScrumDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        teamsScrumDtoPage.getSize(),
                        teamsScrumDtoPage.getTotalPages(),
                        (int) teamsScrumDtoPage.getTotalElements()),
                        HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No attendances found",
                        0,
                        0,
                        0),
                        HttpStatus.NO_CONTENT);
            }
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error retrieving Teams Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Traer Un Team Scrum Por Id
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String , Object>> findById(@PathVariable Long id){
        try {
            Teams_ScrumDto teamsScrumDto = this.teamsScrumBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    teamsScrumDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting Team Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //End-Point Para Crear Un Nuevo Team Scrum
    @PostMapping("/create")
    public ResponseEntity<Map<String , Object>> add(@RequestBody Map<String , Object> json){
        try {
            teamsScrumBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Team Scrum added successfully"),
                    HttpStatus.CREATED);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding Team Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Editar-Actualizar un Team Scrum
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String , Object>> update(@PathVariable Long id , @RequestBody Map<String , Object> json){
        try {
            teamsScrumBusiness.update(id, json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Team Scrum updated successfully"), HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error updating Team Scrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Eliminar Un Team Scrum
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String , Object>> delete(@PathVariable Long id) {
        {
            try {
                teamsScrumBusiness.delete(id);
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
}
