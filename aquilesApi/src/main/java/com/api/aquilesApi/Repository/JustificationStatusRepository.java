package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.JustificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JustificationStatusRepository extends JpaRepository<JustificationStatus, Long> {

    boolean existsByName(String name);


}
