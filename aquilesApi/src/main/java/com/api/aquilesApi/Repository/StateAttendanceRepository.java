package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.StateAttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateAttendanceRepository extends JpaRepository<StateAttendanceEntity, Long> {
    boolean existsByStateAttendanceId(Long stateAttendanceId);
}
