package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Juries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuriesRepository extends JpaRepository<Juries, Long> {
}
