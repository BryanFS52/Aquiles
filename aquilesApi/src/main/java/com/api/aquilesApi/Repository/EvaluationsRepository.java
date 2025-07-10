package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Evaluations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationsRepository extends JpaRepository<Evaluations, Long> {
}
