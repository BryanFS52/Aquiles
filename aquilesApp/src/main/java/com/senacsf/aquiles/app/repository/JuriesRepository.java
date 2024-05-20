package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Juries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuriesRepository extends JpaRepository<Juries, Long> {
}
