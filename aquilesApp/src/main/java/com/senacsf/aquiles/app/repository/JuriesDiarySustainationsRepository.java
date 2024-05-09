package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.JuriesDiarySustainations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuriesDiarySustainationsRepository extends JpaRepository<JuriesDiarySustainations, Long> {
}
