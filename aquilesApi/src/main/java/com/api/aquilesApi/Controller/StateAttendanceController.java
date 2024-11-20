package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.StateAttendancesBusiness;
import com.api.aquilesApi.Dto.StateAttendanceDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/stateAttendance")
public class StateAttendanceController {
    @Autowired
    private StateAttendancesBusiness stateAttendancesBusiness;

    //End-Point Para Traer

    @GetMapping("/all")
    public ResponseEntity<Map<String , Object>> findAll (@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        try {
            Page<StateAttendanceDto> stateAttendanceDtoPage  = stateAttendancesBusiness.findAll(page, size);
            if (!stateAttendanceDtoPage.isEmpty()){
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        stateAttendanceDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        stateAttendanceDtoPage.getSize(),
                        stateAttendanceDtoPage.getTotalPages(),
                        (int) stateAttendanceDtoPage.getTotalElements()),
                        HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "State Attendance not found",
                        0,
                        0,
                        0),
                        HttpStatus.NO_CONTENT);
            }
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting State Attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Traer Un Estado Por Id
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String , Object>> findById(@PathVariable Long id){
        try {
            StateAttendanceDto stateAttendanceDto = this.stateAttendancesBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    stateAttendanceDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting State Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Metodo Para Crear-Add Un Estado De Asistencia
    @PostMapping("/create")
    public ResponseEntity<Map<String , Object>> add (@RequestBody Map<String , Object> json){
        try {
            stateAttendancesBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Add State Attendance  successfully"),
                    HttpStatus.CREATED);
        } catch (CustomException e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        }    catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding  State Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Metodo Para Actualizar Un Estado De Asistencia
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Map<String, Object> json) {
        try {
            // Verificar si el estado de asistencia existe
            StateAttendanceDto existingState = stateAttendancesBusiness.findById(id);
            if (existingState == null) {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                        "State Attendance with ID " + id + " not found.", HttpStatus.NOT_FOUND, "Not Found"),
                        HttpStatus.NOT_FOUND);
            }

            // Validar el contenido del JSON (ajusta según tus necesidades)
            if (!json.containsKey("status")) {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                        "Missing required field: status", HttpStatus.BAD_REQUEST, "Bad Request"),
                        HttpStatus.BAD_REQUEST);
            }

            // Actualizar el estado de asistencia
            stateAttendancesBusiness.update(id, json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "State Attendance updated successfully"), HttpStatus.OK);
        } catch (CustomException e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error State Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Metodo Para Eliminar Un Estado Asistencia
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        try {
            stateAttendancesBusiness.delete(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "State Attendance deleted successfully"),
                    HttpStatus.OK);
        } catch (CustomException e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error State Attendance : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
