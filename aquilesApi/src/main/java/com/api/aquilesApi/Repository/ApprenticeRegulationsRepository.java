package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ApprenticeRegulationsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprenticeRegulationsRepository extends JpaRepository<ApprenticeRegulationsEntity, Long> {
}
