package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.MethodologiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MethodologiesRepository extends JpaRepository<MethodologiesEntity, Long> {
}
