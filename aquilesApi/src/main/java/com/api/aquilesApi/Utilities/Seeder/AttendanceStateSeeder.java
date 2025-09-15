package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Repository.StateAttendanceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AttendanceStateSeeder implements CommandLineRunner {

    private final StateAttendanceRepository attendanceStateRepository;

    public AttendanceStateSeeder(StateAttendanceRepository attendanceStateRepository) {
        this.attendanceStateRepository = attendanceStateRepository;
    }

    @Override
    public void run(String... args) {
        createStateIfNotExists("Presente");
        createStateIfNotExists("Ausente");
        createStateIfNotExists("Justificado");
        createStateIfNotExists("Retardo");
        createStateIfNotExists("Injustificado");
    }

    private void createStateIfNotExists(String status) {
        if (!attendanceStateRepository.existsByStatus(status)) {
            AttendanceState attendanceState = new AttendanceState();
            attendanceState.setStatus(status);
            attendanceStateRepository.save(attendanceState);
        }
    }
}
