package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendanceState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateAttendanceRepository extends JpaRepository<AttendanceState, Long> {

}