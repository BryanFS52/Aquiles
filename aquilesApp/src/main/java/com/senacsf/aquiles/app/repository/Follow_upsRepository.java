package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Follow_ups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Follow_upsRepository extends JpaRepository<Follow_ups, Long> {
}
