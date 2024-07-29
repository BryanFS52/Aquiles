package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Attendances;
import com.senacsf.aquiles.app.repository.AttendancesRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AttendancesService implements Idao<Attendances, Long> {

    @Autowired
    AttendancesRepository attendancesRepository;

    @Override
    public List<Attendances> findAll() {
        return attendancesRepository.findAll();
    }

    @Override
    public Attendances getById(Long id) {
        Optional<Attendances> optionalAttendances = attendancesRepository.findById(id);
        return optionalAttendances.orElse(null);
    }

    @Override
    public void update(Attendances entity) {
        this.attendancesRepository.save(entity);
    }

    @Override
    public Attendances save(Attendances entity) {
        return this.attendancesRepository.save(entity);
    }

    @Override
    public void create(Attendances entity) {
        this.attendancesRepository.save(entity);
    }

    @Override
    public void delete(Attendances entity) {
        this.attendancesRepository.delete(entity);
    }

}
