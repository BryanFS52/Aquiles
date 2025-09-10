package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Repository.StateAttendanceRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AttendanceStateService implements Idao<AttendanceState, Long> {
    private final StateAttendanceRepository StateAttendanceRepository;

    public AttendanceStateService(StateAttendanceRepository stateAttendanceRepository) {
        StateAttendanceRepository = stateAttendanceRepository;
    }

    @Override
    public Page<AttendanceState> findAll(PageRequest pageRequest) {
        return StateAttendanceRepository.findAll(pageRequest);
    }

    @Override
    public AttendanceState getById(Long id) {
        return StateAttendanceRepository.findById(id).orElseThrow(() ->
                new CustomException("State Attendance with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(AttendanceState entity) {
        this.StateAttendanceRepository.save(entity);
    }

    @Override
    public AttendanceState save(AttendanceState entity) {
        return StateAttendanceRepository.save(entity);
    }

    @Override
    public void delete(AttendanceState entity) {
        this.StateAttendanceRepository.delete(entity);
    }

    @Override
    public void create(AttendanceState entity) {
        this.StateAttendanceRepository.save(entity);
    }

}