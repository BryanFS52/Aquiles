package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.TrainersBusiness;
import com.senacsf.aquiles.app.dto.TrainersDto;
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
@RequestMapping("/api/trainers")
public class TrainersController {

    @Autowired
     private TrainersBusiness trainersBusiness;

    @GetMapping("/all") // Anotación para manejar solicitudes GET en la ruta /all
    public ResponseEntity<List<TrainersDto>> getAllTrainers (@RequestParam(defaultValue = "10") int size,@RequestParam(defaultValue = "0")int page){
        List<TrainersDto> trainersList = trainersBusiness.findAll();
        if (trainersList.isEmpty()){
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(trainersList);
        }
    }

    @GetMapping("/{id}") // Anotación para manejar solicitudes GET en la ruta /{id}
    public ResponseEntity<Map<String , Object>> getTrainerById (@PathVariable Long id){
        try {
            TrainersDto trainers = trainersBusiness.getById(id);
            Map<String , Object > response = new HashMap<>();
            response.put("status", "success");
            response.put("data", trainers);
            response.put("code" , 200);
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException(e);
        }
    }

    @PostMapping("/create") // Anotación para manejar solicitudes POST en la ruta /create
    public ResponseEntity<Map<String, Object>> createTrainer(@Validated @RequestBody TrainersDto trainersDto){
        try {
            trainersBusiness.create(trainersDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Trainer  created successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (CustomException e ){
            return handleException(e);
        }
    }

    @PutMapping("/update") // Anotación para manejar solicitudes PUT en la ruta /update
    public ResponseEntity<Map<String, Object>> updateTrainer(@Validated @RequestBody TrainersDto trainersDto){
        try {
            trainersBusiness.update(trainersDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Trainer  updated successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException(e);
        }
    }

    @DeleteMapping("/delete/{id}") // Anotación para manejar solicitudes DELETE en la ruta /delete/{id}
    public ResponseEntity<Map<String, Object>> deleteTrainer(@PathVariable Long id){
        try {
            trainersBusiness.delete(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Trainer  deleted successfully");
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
