package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Repository.AttendancesRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendancesService implements Idao<Attendance, Long> {

    private final AttendancesRepository attendancesRepository;

    public AttendancesService(AttendancesRepository attendancesRepository) {
        this.attendancesRepository = attendancesRepository;
    }

    // Get all attendances paginated
    @Override
    public Page<Attendance> findAll(PageRequest pageRequest) {
        return attendancesRepository.findAll(pageRequest);
    }

    // Get attendance by ID or throw exception if not found
    @Override
    public Attendance getById(Long id) {
        return attendancesRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    // Update an existing attendance
    @Override
    public void update(Attendance entity) {
        this.attendancesRepository.save(entity);
    }

    // Save a new attendance (returns the saved entity)
    @Override
    public Attendance save(Attendance entity) {
        return attendancesRepository.save(entity);
    }

    // Delete an attendance
    @Override
    public void delete(Attendance entity) {
        this.attendancesRepository.delete(entity);
    }

    // Create a new attendance
    @Override
    public void create(Attendance entity) {
        this.attendancesRepository.save(entity);
    }

    // Get all attendances for a specific student
    public List<Attendance> findAllByStudentId(Long studentId) {
        return attendancesRepository.findAllByStudentId(studentId);
    }

    public List<Attendance> findAllByCompetenceQuarterId(Long id) {
        return attendancesRepository.findAllByCompetenceQuarter(id);
    }

    // Filter attendances by student and/or state
    public Page<Attendance> findAllByFilter(Long studentId, Long attendanceState, Pageable pageable) {
        return attendancesRepository.findByStudentIdAndOrAttendanceStateId(studentId, attendanceState, pageable);
    }
}
