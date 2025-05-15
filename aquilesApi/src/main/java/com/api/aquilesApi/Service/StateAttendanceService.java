package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.StateAttendanceEntity;
import com.api.aquilesApi.Repository.StateAttendanceRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class StateAttendanceService implements Idao<StateAttendanceEntity , Long> {
    private final StateAttendanceRepository stateAttendanceRepository;

    public StateAttendanceService(StateAttendanceRepository stateAttendanceRepository) {
        this.stateAttendanceRepository = stateAttendanceRepository;
    }

    @Override
    public Page<StateAttendanceEntity> findAll(PageRequest pageRequest) {
        return stateAttendanceRepository.findAll(pageRequest);
    }

    @Override
    public StateAttendanceEntity getById(Long id) {
        return stateAttendanceRepository.findById(id).orElseThrow(() ->
                new CustomException("State Attendance with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(StateAttendanceEntity entity) {
        this.stateAttendanceRepository.save(entity);
    }

    @Override
    public StateAttendanceEntity save(StateAttendanceEntity entity) {
        return stateAttendanceRepository.save(entity);
    }

    @Override
    public void delete(StateAttendanceEntity entity) {
        this.stateAttendanceRepository.delete(entity);
    }

    @Override
    public void create(StateAttendanceEntity entity) {
        this.stateAttendanceRepository.save(entity);
    }

    public boolean existsStateAttendance(Long stateAttendanceId) {
        return stateAttendanceRepository.existsByStateAttendanceId(stateAttendanceId);
    }
}
