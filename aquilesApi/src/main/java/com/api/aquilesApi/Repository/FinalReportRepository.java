package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.FinalReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinalReportRepository extends JpaRepository<FinalReportEntity,Long> {
}
