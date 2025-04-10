package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.EvaluationsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationsRepository extends JpaRepository<EvaluationsEntity, Long> {
}
