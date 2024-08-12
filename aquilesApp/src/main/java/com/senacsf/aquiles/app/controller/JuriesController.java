package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.JuriesBusiness;
import com.senacsf.aquiles.app.dto.JuriesDto;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController // Anotación para definir esta clase como un controlador REST
@RequestMapping("/api/juries")
public class JuriesController {
    @Autowired
    JuriesBusiness juriesBusiness;


    @GetMapping("/all")
    public ResponseEntity<List<JuriesDto>> getAllJuries(){
        List<JuriesDto> juriesList = juriesBusiness.findAll();
        if (juriesList.isEmpty()){
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(juriesList);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String , Object>> getJuryById (@PathVariable Long id){
        try {
            JuriesDto juries  = juriesBusiness.getById(id);
            Map<String , Object> response = new HashMap<>();
            response.put("status" , "success");
            response.put("data" , juries);
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException(e);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createJury(@Validated @RequestBody JuriesDto juriesDto) {
        try {
            juriesBusiness.create(juriesDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Jury created successfully"); // Corregido el espacio adicional
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateJury (@Validated @RequestBody JuriesDto juriesDto){
        try {
            juriesBusiness.update(juriesDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Jury updated successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String , Object>> deleteJury (@PathVariable Long id){
        try {
            juriesBusiness.delete(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Jury deleted successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException(e);
        }
    }

    private ResponseEntity<Map<String, Object>> handleException(CustomException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
