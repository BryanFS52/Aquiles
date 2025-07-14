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

    @Query(value = """
    SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
    FROM team_scrum_members tm
    JOIN teams_scrum ts ON ts.id = tm.team_id
    WHERE ts.study_sheet_id = :studySheetId
    AND tm.user_id IN (:memberIds)
""", nativeQuery = true)
    boolean existsByStudySheetIdAndMemberIds(@Param("studySheetId") Long studySheetId, @Param("memberIds") List<Long> memberIds);
}
