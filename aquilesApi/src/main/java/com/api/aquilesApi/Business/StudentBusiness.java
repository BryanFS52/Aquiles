package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.StudentDTO;
import com.api.aquilesApi.Entity.Student;
import com.api.aquilesApi.Service.StudentService;
import com.api.aquilesApi.Utilities.CustomException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StudentBusiness {

    @Autowired
    private StudentService studentService;

    public StudentDTO getStudentById(Long id) {
        Student student = studentService.getById(id);
        return mapToDTO(student);
    }

    public Student createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        student.setState(studentDTO.getState());
        // Mapear PersonDTO y StudySheetDTO a sus entidades correspondientes
        studentService.save(student);
        return student;
    }

    public void deleteStudent(Long id) {
        Student student = studentService.getById(id);
        studentService.delete(student);
    }

    private StudentDTO mapToDTO(Student student) {
        return new StudentDTO(
                student.getStudentId(),  // Cambia de getId() a getStudentId()
                student.getState(),
                student.getCreatedAt(),
                student.getUpdatedAt(),
                null,  // Mapear el PersonDTO aquí
                null   // Mapear el StudySheetDTO aquí
        );
    }
}
