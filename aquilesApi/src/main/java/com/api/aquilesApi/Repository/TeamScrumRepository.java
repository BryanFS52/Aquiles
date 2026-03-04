package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TeamsScrum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamScrumRepository extends JpaRepository<TeamsScrum, Long> {

    @Query("SELECT t FROM TeamsScrum t JOIN t.memberIds m WHERE m.studentId = :studentId")
    List<TeamsScrum> findByMemberIds_StudentId(@Param("studentId") Long studentId);

    List<TeamsScrum> findByStudySheetId(Long studySheetId);

    @Query("""
    SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
    FROM TeamsScrum t JOIN t.memberIds m
    WHERE t.studySheetId = :studySheetId
    AND m.studentId IN :memberIds
""")
    boolean existsByStudySheetIdAndMemberIds(
            @Param("studySheetId") Long studySheetId,
            @Param("memberIds") List<Long> memberIds
    );

}
