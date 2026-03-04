package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.NotificationsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationsTypeRepository extends JpaRepository<NotificationsType, Long> {
}
