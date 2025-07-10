package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TeamsScrum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamScrumRepository extends JpaRepository<TeamsScrum, Long> {

    @Query("SELECT t FROM TeamsScrum t JOIN t.memberIds m WHERE m = :memberId")
    List<TeamsScrum> findByMemberId(@Param("memberId") Long memberId);
    List<TeamsScrum> findByStudySheetId(Long studySheetId);
}
