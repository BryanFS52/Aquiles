package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.JustificationTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JustificationTypeRepository extends JpaRepository<JustificationTypeEntity, Long> {
}
