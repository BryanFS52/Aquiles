package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.FollowUpsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUpsEntity, Long> {
}
