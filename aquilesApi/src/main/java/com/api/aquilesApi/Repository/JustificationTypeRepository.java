package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.JustificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JustificationTypeRepository extends JpaRepository<JustificationType, Long> {
}
