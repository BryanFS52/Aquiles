package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.AttendanceEntity;
import com.api.aquilesApi.Repository.AttendancesRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendancesService implements Idao<AttendanceEntity, Long> {

    private final AttendancesRepository attendancesRepository;

    public AttendancesService(AttendancesRepository attendancesRepository) {
        this.attendancesRepository = attendancesRepository;
    }

    @Override
    public Page<AttendanceEntity> findAll(PageRequest pageRequest) {
        return attendancesRepository.findAll(pageRequest);
    }

    @Override
    public AttendanceEntity getById(Long id) {
        return attendancesRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(AttendanceEntity entity) {
        this.attendancesRepository.save(entity);
    }

    @Override
    public AttendanceEntity save(AttendanceEntity entity) {
        return attendancesRepository.save(entity);
    }

    @Override
    public void delete(AttendanceEntity entity) {
        this.attendancesRepository.delete(entity);
    }

    @Override
    public void create(AttendanceEntity entity) {
        this.attendancesRepository.save(entity);
    }

    public List<AttendanceEntity> findAllByStudentId(Long studentId) {
        return attendancesRepository.findAllByStudentId(studentId);
    }
    public List<AttendanceEntity> findAllByStudentId(Long studentId, Long attendanceState) {
        return attendancesRepository.findByStudentIdAndOrAttendanceStateId(studentId, attendanceState);
    }
}
