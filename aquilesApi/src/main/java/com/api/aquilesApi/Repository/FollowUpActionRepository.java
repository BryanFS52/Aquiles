package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.FollowUpAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowUpActionRepository extends JpaRepository<FollowUpAction, Long> {
}