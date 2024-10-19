package com.senacsf.aquiles.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.senacsf.aquiles.app.business.StudentsBusiness;
import com.senacsf.aquiles.app.dto.StudentsDto;
import com.senacsf.aquiles.app.utilities.CustomException;

@RestController // Anotación para definir esta clase como un controlador REST
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentsBusiness studentsBusiness;


    @GetMapping("/all")
    public ResponseEntity<List<StudentsDto>> getAllStudents(){
        List<StudentsDto> studentList = studentsBusiness.findAll();
        if (studentList.isEmpty()){
            return  ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(studentList);
        }
    }

    @GetMapping("/{id}") // Anotación para manejar solicitudes GET en la ruta /{id}
    public ResponseEntity<Map<String, Object>> getStudentById (@PathVariable Long id){
        try {
            StudentsDto student = studentsBusiness.getById(id);
            Map<String , Object> response = new HashMap<>();
            response.put("status" , "success");
            response.put("data" , student);
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException(e);

        }
    }

    @PostMapping("/create") // Anotación para manejar solicitudes POST en la ruta /create
    public ResponseEntity<Map<String, Object>> createStudent (@Validated @PathVariable StudentsDto studentsDto){
        try {
            studentsBusiness.create(studentsDto);
            Map<String , Object> response = new HashMap<>();
            response.put("status" , "success");
            response.put("message " , "Student Created successfully");
            return new ResponseEntity<>(response , HttpStatus.CREATED);
        } catch (CustomException e){
            return handleException(e);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateStudent (@Validated @PathVariable StudentsDto studentsDto){
        try {
            studentsBusiness.update(studentsDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Team Scrum updated successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e ){
            return handleException(e);
        }
    }

    @DeleteMapping("/delete/{id}") // Anotación para manejar solicitudes DELETE en la ruta /delete/{id}
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id){
        try {
            studentsBusiness.delete(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Student deleted successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e){
             return  handleException(e);
        }
    }

    private ResponseEntity<Map<String, Object>> handleException(CustomException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
