package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementPlanActivityRepository extends JpaRepository<ImprovementPlanActivity, Long> {
}
