package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.stateAttendance;
import com.senacsf.aquiles.app.repository.stateAttedanceRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class stateAttendanceService implements Idao<stateAttendance, Long> {
    @Autowired
    private stateAttedanceRepository stateAttedanceRepository;

    @Override
    public List<stateAttendance> findAll() {
        return stateAttedanceRepository.findAll();
    }

    @Override
    public stateAttendance getById(Long id) {
        Optional<stateAttendance> stateAttendance = stateAttedanceRepository.findById(id);
        return stateAttendance.orElse(null);
    }

    @Override
    public void update(stateAttendance entity) {
        this.stateAttedanceRepository.save(entity);
    }

    @Override
    public stateAttendance save(stateAttendance entity) {
        return stateAttedanceRepository.save(entity);
    }

    @Override
    public void delete(stateAttendance entity) {
        this.stateAttedanceRepository.delete(entity);
    }

    @Override
    public void create(stateAttendance entity) {
        this.stateAttedanceRepository.save(entity);
    }
}
