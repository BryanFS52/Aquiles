package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.DiarySustainations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiarySustainationsRepository extends JpaRepository<DiarySustainations, Long> {
}
