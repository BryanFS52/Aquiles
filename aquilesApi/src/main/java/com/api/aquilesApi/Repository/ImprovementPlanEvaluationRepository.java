package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlanEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImprovementPlanEvaluationRepository extends JpaRepository<ImprovementPlanEvaluation, Long> {

    @Query("SELECT ipe FROM ImprovementPlanEvaluation ipe WHERE ipe.improvementPlan.id = :improvementPlanId")
    Optional<ImprovementPlanEvaluation> findByImprovementPlanId(@Param("improvementPlanId") Long improvementPlanId);

    boolean existsByImprovementPlanId(Long improvementPlanId);
}

