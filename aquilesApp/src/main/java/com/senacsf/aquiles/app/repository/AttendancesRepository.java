package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Attendances;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendancesRepository extends JpaRepository<Attendances, Long> {
}
