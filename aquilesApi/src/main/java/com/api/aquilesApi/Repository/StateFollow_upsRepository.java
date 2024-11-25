package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateFollow_upsRepository extends JpaRepository<StateFollow_upsEntity , Long> {
}
