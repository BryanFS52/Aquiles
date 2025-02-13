package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.AttendancesEntity;
import com.api.aquilesApi.Entity.StateAttendanceEntity;
import com.api.aquilesApi.Repository.AttendancesRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AttendancesService implements Idao<AttendancesEntity , Long> {

    @Autowired
    private AttendancesRepository attendancesRepository;

    @Override
    public Page<AttendancesEntity> findAll(PageRequest pageRequest) {
        return attendancesRepository.findAll(pageRequest);
    }


    @Override
    public AttendancesEntity getById(Long id) {
        return attendancesRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }


    @Override
    public void update(AttendancesEntity entity) {
        this.attendancesRepository.save(entity);
    }

    @Override
    public AttendancesEntity save(AttendancesEntity entity) {
        return attendancesRepository.save(entity);
    }

    @Override
    public void delete(AttendancesEntity entity) {
        this.attendancesRepository.delete(entity);
    }

    @Override
    public void create(AttendancesEntity entity) {
        this.attendancesRepository.save(entity);
    }

    public long countPresentByTrainerId(Long trainerId, Long presentStateId) {
        return attendancesRepository.countPresentByTrainerId(trainerId, presentStateId);
    }

    public long countAbsentByTrainerId(Long trainerId, Long absentStateId) {
        return attendancesRepository.countAbsentByTrainerId(trainerId, absentStateId);
    }


    public boolean existsByAttendanceDateAndStateAttendance(Date attendanceDate, StateAttendanceEntity stateAttendance) {
        return attendancesRepository.existsByAttendanceDateAndStateAttendance(attendanceDate , stateAttendance);
    }
}
