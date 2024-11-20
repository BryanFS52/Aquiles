package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Student;
import com.api.aquilesApi.Repository.StudentRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class StudentService implements Idao<Student, Long> {

    @Autowired
    private StudentRepository studentRepository;


    @Override
    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new CustomException("Student with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Transactional
    @Override
    public Student save(Student obje) {
        return this.studentRepository.save(obje);
    }

    @Transactional
    @Override
    public void create(Student entity) {
        this.save(entity); // Llama a save para manejar la creación
    }

    @Transactional
    @Override
    public void delete(Student obje) {
        this.studentRepository.delete(obje);
    }

    @Override
    public Page<Student> findAll(PageRequest pageRequest) {
        return studentRepository.findAll(pageRequest);
    }


    public boolean existsPerson(Long idPerson, Long document) {
        return studentRepository.existsByPerson_IdPersonAndPerson_Document(idPerson, document);
    }


    @Override
    public void update(Student entity) {
        this.save(entity); // Usa save para actualizar la entidad
    }
}
