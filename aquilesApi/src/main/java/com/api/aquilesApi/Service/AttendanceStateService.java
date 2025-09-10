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
    private final AttendanceStateRepository attendanceStateRepository;

    public AttendanceStateService(AttendanceStateRepository attendanceStateRepository) {
        this.attendanceStateRepository = attendanceStateRepository;
    }

    @Override
    public Page<AttendanceState> findAll(PageRequest pageRequest) {
        return attendanceStateRepository.findAll(pageRequest);
    }

    @Override
    public AttendanceState getById(Long id) {
        return attendanceStateRepository.findById(id).orElseThrow(() ->
                new CustomException("State Attendance with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(AttendanceState entity) {
        this.attendanceStateRepository.save(entity);
    }

    @Override
    public AttendanceState save(AttendanceState entity) {
        return attendanceStateRepository.save(entity);
    }

    @Override
    public void delete(AttendanceState entity) {
        this.attendanceStateRepository.delete(entity);
    }

    @Override
    public void create(AttendanceState entity) {
        this.attendanceStateRepository.save(entity);
    }

}