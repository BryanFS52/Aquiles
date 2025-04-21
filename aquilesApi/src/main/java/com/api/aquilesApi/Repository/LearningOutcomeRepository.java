package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.LearningOutcomeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningOutcomeRepository extends JpaRepository<LearningOutcomeEntity, Long> {
}
