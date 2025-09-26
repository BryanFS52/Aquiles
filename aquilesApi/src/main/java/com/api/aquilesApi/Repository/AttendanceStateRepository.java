package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendanceState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceStateRepository extends JpaRepository<AttendanceState, Long> {
    // Check if an AttendanceState with the given status exists
    boolean existsByStatus(String status);
}
