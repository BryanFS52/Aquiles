package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Repository.AttendancesRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendancesService implements Idao<Attendance, Long> {

    private final AttendancesRepository attendancesRepository;

    public AttendancesService(AttendancesRepository attendancesRepository) {
        this.attendancesRepository = attendancesRepository;
    }

    @Override
    public Page<Attendance> findAll(PageRequest pageRequest) {
        return attendancesRepository.findAll(pageRequest);
    }

    @Override
    public Attendance getById(Long id) {
        return attendancesRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Attendance entity) {
        this.attendancesRepository.save(entity);
    }

    @Override
    public Attendance save(Attendance entity) {
        return attendancesRepository.save(entity);
    }

    @Override
    public void delete(Attendance entity) {
        this.attendancesRepository.delete(entity);
    }

    @Override
    public void create(Attendance entity) {
        this.attendancesRepository.save(entity);
    }

    public List<Attendance> findAllByStudentId(Long studentId) {
        return attendancesRepository.findAllByStudentId(studentId);
    }

    public List<Attendance> findAllByStudentId(Long studentId, Long attendanceState) {
        return attendancesRepository.findByStudentIdAndOrAttendanceStateId(studentId, attendanceState);
    }
}
