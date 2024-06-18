package com.senacsf.aquiles.app.service;


import com.senacsf.aquiles.app.entities.Students;
import com.senacsf.aquiles.app.repository.StudentsRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentsService implements Idao<Students, Long> {

    @Autowired
    StudentsRepository studentsRepository;

    @Override
    public List<Students> findAll() {
        return studentsRepository.findAll();
    }

    @Override
    public Students getById(Long aLong) {
        return null;
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
    public void create(Students entity) {
        this.studentsRepository.save(entity);
    }

    @Override
    public void delete(Students entity) {
        this.studentsRepository.delete(entity);
    }
}
