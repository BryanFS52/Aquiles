package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendancesEntity;
import com.api.aquilesApi.Entity.StateAttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendancesEntity, Long> {
    boolean existsByAttendanceDateAndStateAttendance(String attendanceDate, StateAttendanceEntity stateAttendance);

}