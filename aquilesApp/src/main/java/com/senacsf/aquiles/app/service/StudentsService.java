package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Students;
import com.senacsf.aquiles.app.repository.StudentsRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentsService implements Idao<Students , Long> {

    @Autowired
    StudentsRepository studentsRepository;

    public Students findByDocument_Number(Long documentNumber){
        return studentsRepository.findByDocumentNumber(documentNumber);
    }

    @Override
    public List<Students> findAll() {
        return studentsRepository.findAll();
    }

    @Override
    public Students getById(Long id) {
        Optional<Students> optionalStudents = studentsRepository.findById(id);
        return optionalStudents.orElse(null);
    }

    @Override
    public void update(Students entity) {
        this.studentsRepository.save(entity);
    }

    @Override
    public Students save(Students entity) {
        return this.studentsRepository.save(entity);
    }

    @Override
    public void delete(Students entity) {
        this.studentsRepository.delete(entity);
    }

    @Override
    public void create(Students entity) {
        this.studentsRepository.save(entity);
    }
}
