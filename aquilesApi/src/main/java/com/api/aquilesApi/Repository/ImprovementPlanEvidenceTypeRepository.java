package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlanEvidenceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementPlanEvidenceTypeRepository extends JpaRepository<ImprovementPlanEvidenceType, Long> {
    // Custom query method to check existence by name
    boolean existsByName(String name);
}