package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.StateAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;  // Importar List

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE a.trainer.trainerId = :trainerId AND a.stateAttendance.stateAttendanceId = :presentStateId")
    long countPresentByTrainerId(@Param("trainerId") Long trainerId, @Param("presentStateId") Long presentStateId);

    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE a.trainer.trainerId = :trainerId AND a.stateAttendance.stateAttendanceId = :absentStateId")
    long countAbsentByTrainerId(@Param("trainerId") Long trainerId, @Param("absentStateId") Long absentStateId);

    boolean existsByAttendanceDateAndStateAttendance(Date attendanceDate, StateAttendance stateAttendance);

    // Obtén todas las asistencias ausentes sin excusa
    @Query("SELECT a FROM Attendance a WHERE a.stateAttendance.status = 'Absent' AND a.justification IS NULL")
    List<Attendance> findAbsentWithoutJustification();  // Aquí se usa List
}
