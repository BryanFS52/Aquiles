package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendancesEntity;
import com.api.aquilesApi.Entity.StateAttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendancesEntity, Long> {

    @Query("SELECT COUNT(a) FROM AttendancesEntity a WHERE a.trainer.trainerId = :trainerId AND a.stateAttendance.stateAttendanceId = :presentStateId")
    long countPresentByTrainerId(@Param("trainerId") Long trainerId, @Param("presentStateId") Long presentStateId);

    @Query("SELECT COUNT(a) FROM AttendancesEntity a WHERE a.trainer.trainerId = :trainerId AND a.stateAttendance.stateAttendanceId = :absentStateId")
    long countAbsentByTrainerId(@Param("trainerId") Long trainerId, @Param("absentStateId") Long absentStateId);


    boolean existsByAttendanceDateAndStateAttendance(Date attendanceDate, StateAttendanceEntity stateAttendance);

}
