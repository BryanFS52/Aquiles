package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Repository.AttendanceStateRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AttendanceStateService implements Idao<AttendanceState, Long> {
    private final AttendanceStateRepository AttendanceStateRepository;

    public AttendanceStateService(AttendanceStateRepository stateAttendanceRepository) {
        AttendanceStateRepository = stateAttendanceRepository;
    }

    @Override
    public Page<AttendanceState> findAll(PageRequest pageRequest) {
        return AttendanceStateRepository.findAll(pageRequest);
    }

    @Override
    public AttendanceState getById(Long id) {
        return AttendanceStateRepository.findById(id).orElseThrow(() ->
                new CustomException("State Attendance with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(AttendanceState entity) {
        this.AttendanceStateRepository.save(entity);
    }

    @Override
    public AttendanceState save(AttendanceState entity) {
        return AttendanceStateRepository.save(entity);
    }

    @Override
    public void delete(AttendanceState entity) {
        this.AttendanceStateRepository.delete(entity);
    }

    @Override
    public void create(AttendanceState entity) {
        this.AttendanceStateRepository.save(entity);
    }

}