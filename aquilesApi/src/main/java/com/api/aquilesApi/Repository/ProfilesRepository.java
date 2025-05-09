package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ProfilesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilesRepository extends JpaRepository<ProfilesEntity, Long> {
}
