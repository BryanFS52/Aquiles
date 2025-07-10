package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JustificationRepository extends JpaRepository<Justification, Long> {
}
