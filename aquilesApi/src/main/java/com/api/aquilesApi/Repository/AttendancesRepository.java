package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendanceEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendanceEntity, Long> {

    List<AttendanceEntity> findAllByStudentId(Long studentId);
    @Transactional
    @Query("""
    SELECT a FROM AttendanceEntity a
    WHERE (:studentId IS NULL OR a.studentId = :studentId)
      AND (:attendanceStateId IS NULL OR a.attendanceState.id = :attendanceStateId)
    """)
    List<AttendanceEntity> findByStudentIdAndOrAttendanceStateId(
            @Param("studentId") Long studentId,
            @Param("attendanceStateId") Long attendanceStateId
    );



}