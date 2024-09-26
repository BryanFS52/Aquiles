package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.stateAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface stateAttedanceRepository extends JpaRepository<stateAttendance, Long> {
}
