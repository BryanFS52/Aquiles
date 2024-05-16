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
        return List.of();
    }

    @Override
    public Students getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Students obje) {
        this.studentsRepository.save(obje);
    }

    @Override
    public void save(Students obje) {
        this.studentsRepository.save(obje);
    }

    @Override
    public void delete(Students obje) {
        this.studentsRepository.delete(obje);
    }
}
