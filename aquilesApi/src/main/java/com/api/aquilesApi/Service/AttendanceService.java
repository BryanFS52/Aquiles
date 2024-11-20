package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.StateAttendance;
import com.api.aquilesApi.Repository.AttendanceRepository;
import com.api.aquilesApi.Repository.StateAttendanceRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AttendanceService implements Idao<Attendance, Long> {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StateAttendanceRepository stateAttendanceRepository;

    @Override
    public Page<Attendance> findAll(PageRequest pageRequest) {
        return attendanceRepository.findAll(pageRequest);
    }

    @Override
    public Attendance getById(Long id) {
        return attendanceRepository.findById(id).orElseThrow(() ->
                new CustomException("Attendance with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Attendance entity) {
        this.attendanceRepository.save(entity);
    }

    @Override
    public Attendance save(Attendance entity) {
        return attendanceRepository.save(entity);
    }

    @Override
    public void delete(Attendance entity) {
        this.attendanceRepository.delete(entity);
    }

    @Override
    public void create(Attendance entity) {
        this.attendanceRepository.save(entity);
    }

    public long countPresentByTrainerId(Long trainerId, Long presentStateId) {
        return attendanceRepository.countPresentByTrainerId(trainerId, presentStateId);
    }

    public long countAbsentByTrainerId(Long trainerId, Long absentStateId) {
        return attendanceRepository.countAbsentByTrainerId(trainerId, absentStateId);
    }

    public boolean existsByAttendanceDateAndStateAttendance(Date attendanceDate, StateAttendance stateAttendance) {
        return attendanceRepository.existsByAttendanceDateAndStateAttendance(attendanceDate, stateAttendance);
    }

    /**
     * Sincroniza asistencias marcadas como "Ausente" para que pasen al estado "Enviar Excusa".
     */
    public void syncAbsentToPendingExcuse() {
        // Obtén el estado "PendingExcuse" desde el repositorio
        StateAttendance pendingExcuseState = stateAttendanceRepository.findByStatus("PendingExcuse");

        if (pendingExcuseState == null) {
            throw new IllegalStateException("El estado 'PendingExcuse' no está configurado en la base de datos.");
        }

        // Encuentra asistencias con estado "Ausente" y sin excusa
        List<Attendance> absencesWithoutExcuse = attendanceRepository.findAbsentWithoutJustification();

        // Actualiza las asistencias al estado "Enviar Excusa"
        absencesWithoutExcuse.forEach(attendance -> attendance.setStateAttendance(pendingExcuseState));

        // Guarda los cambios
        attendanceRepository.saveAll(absencesWithoutExcuse);
    }
}
