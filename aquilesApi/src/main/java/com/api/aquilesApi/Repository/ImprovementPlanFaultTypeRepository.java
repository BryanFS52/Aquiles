package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlanFaultType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementPlanFaultTypeRepository extends JpaRepository<ImprovementPlanFaultType, Long> {
}
