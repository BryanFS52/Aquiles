package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.StateAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateAttendanceRepository extends JpaRepository<StateAttendance, Long> {
    boolean existsByStateAttendanceId(Long stateAttendanceId);

    // Método para buscar por el estado (status)
    StateAttendance findByStatus(String status);
}
