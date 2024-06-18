package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Excuses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExcusesRepository extends JpaRepository<Excuses, Long> {
}
