package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TeamsScrumEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamScrumRepository extends JpaRepository<TeamsScrumEntity, Long> {
    @Query("SELECT t FROM TeamsScrumEntity t JOIN t.memberIds m WHERE m = :memberId")
    List<TeamsScrumEntity> findByMemberId(@Param("memberId") Long memberId);

}
