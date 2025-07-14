package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementPlanRepository extends JpaRepository<ImprovementPlan, Long> {
}
