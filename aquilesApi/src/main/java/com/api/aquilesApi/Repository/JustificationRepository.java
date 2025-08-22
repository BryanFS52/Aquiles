package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JustificationRepository extends JpaRepository<Justification, Long> {
    // Custom query to find all Justifications by attendance by student ID
    List<Justification> findAllByAttendanceStudentId(Long studentId);
}