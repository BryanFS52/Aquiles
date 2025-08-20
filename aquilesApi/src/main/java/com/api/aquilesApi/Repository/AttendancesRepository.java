package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendancesRepository extends JpaRepository<Attendance, Long> {

    // Finds attendances by studentId and/or attendanceStateId, ignoring null filters.
    List<Attendance> findAllByStudentId(Long studentId);
    @Query("""
    SELECT a FROM Attendance a
    WHERE (:studentId IS NULL OR a.studentId = :studentId)
      AND (:attendanceStateId IS NULL OR a.attendanceState.id = :attendanceStateId)
    """)
    Page<Attendance> findByStudentIdAndOrAttendanceStateId(
            @Param("studentId") Long studentId,
            @Param("attendanceStateId") Long attendanceStateId,
            Pageable pageable
    );

    // Finds all attendances that have a justification
    @Query("SELECT a FROM Attendance a WHERE a.justification IS NOT NULL")
    List<Attendance> findAllAttendancesWithJustification();

    // Finds all attendances that have a justification with pagination
    @Query("SELECT a FROM Attendance a WHERE a.justification IS NOT NULL")
    Page<Attendance> findAllAttendancesWithJustification(Pageable pageable);

}
