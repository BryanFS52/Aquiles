package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Dto.StudentDTO;
import com.api.aquilesApi.Entity.Student;
import com.api.aquilesApi.Service.StudentService;
import com.api.aquilesApi.Utilities.CustomException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        Student student = studentService.getById(id);
        // Cambiar getId() por getStudentId()
        StudentDTO studentDTO = new StudentDTO(student.getStudentId(), student.getState(), student.getCreatedAt(), student.getUpdatedAt(), null, null);
        return ResponseEntity.ok(studentDTO);
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        Student student = new Student();
        student.setState(studentDTO.getState());
        // Mapear PersonDTO y StudySheetDTO a sus respectivas entidades
        // Asumiendo que tienes métodos para obtener y configurar estas relaciones
        studentService.save(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(student);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        Student student = studentService.getById(id);
        studentService.delete(student);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<Student>> getAllStudents(@RequestParam int page, @RequestParam int size) {
        Page<Student> students = studentService.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(students);
    }

    // Modificación aquí para pasar ambos parámetros en la URL
    @GetMapping("/exists/{idPerson}/{document}")
    public ResponseEntity<Boolean> existsByPersonDocument(@PathVariable Long idPerson, @PathVariable Long document) {
        boolean exists = studentService.existsPerson(idPerson, document);
        return ResponseEntity.ok(exists);
    }
}