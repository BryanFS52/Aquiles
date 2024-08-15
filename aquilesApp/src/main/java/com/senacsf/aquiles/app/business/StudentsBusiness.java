package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.StudentsDto;
import com.senacsf.aquiles.app.entities.Students;
import com.senacsf.aquiles.app.service.StudentsService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class StudentsBusiness {
    @Autowired
    private StudentsService studentsService;

    private final ModelMapper modelMapper = new ModelMapper();

    public List<StudentsDto> findAll() {
        try {
            List<Students> studentsList = studentsService.findAll();

            if (studentsList.isEmpty()) {
                return new ArrayList<>();
            }
            List<StudentsDto> studentsDtoList = new ArrayList<>();

            studentsList.forEach(Students -> studentsDtoList.add(modelMapper.map(Students, StudentsDto.class)));
            return studentsDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting Students"); // Lanzar una excepción personalizada en caso de error
        }
    }

    public StudentsDto getById(Long id) {
        try {
            Students students = studentsService.getById(id);
            if (students == null) {
                throw new CustomException("Student with id " + id + " not found");
            }
            return modelMapper.map(students, StudentsDto.class);
        } catch (Exception e) {
            throw new CustomException("Error getting student by ID");
        }
    }

    public void update(StudentsDto studentsDto) {
        try {
            Students students = modelMapper.map(studentsDto, Students.class);
            studentsService.save(students);
        } catch (Exception e) {
            throw new CustomException("Error saving Student");
        }
    }

    public void create(StudentsDto studentsDto) {
        try {
            // Verificar si el estudiante con el mismo número de documento ya existe en la base de datos
            Long documentNumber = studentsDto.getDocument_number();
            Students existingStudent = studentsService.findByDocument_Number(documentNumber);
            if (existingStudent != null) {
                throw new CustomException("The student with document number " + documentNumber + " already exists."); // Lanzar una excepción si el estudiante ya existe
            }

            // Mapear el DTO a la entidad Students
            Students student = modelMapper.map(studentsDto, Students.class);

            // Guardar el nuevo estudiante usando el servicio
            studentsService.save(student);
        } catch (Exception e) {
            throw new CustomException("Error creating Student"); // Lanzar una excepción personalizada en caso de error
        }
    }

    public void delete (Long studentId){
        try {
            Students students = studentsService.getById(studentId);

            if (students == null){
                throw new CustomException("Student with id " + studentId + " not found");
            }
        } catch (Exception e){
            System.err.println(e.getMessage()); // Imprimir el mensaje de error en la consola
        }

    }
}

