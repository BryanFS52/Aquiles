package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Attendances;
import com.senacsf.aquiles.app.repository.AttendancesRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendancesService implements Idao<Attendances, Long> {

    @Autowired
    AttendancesRepository attendancesRepository;

    @Override
    public List<Attendances> findAll() {
        return List.of();
    }

    @Override
    public Attendances getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Attendances obje) {
        this.attendancesRepository.save(obje);
    }

    @Override
    public void save(Attendances obje){
        this.attendancesRepository.save(obje);
    }

    @Override
    public void create(Attendances obje){
        this.attendancesRepository.save(obje);
    }

    @Override
    public void delete(Attendances obje){
        this.attendancesRepository.delete(obje);
    }

}
