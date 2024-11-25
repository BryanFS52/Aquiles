package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.StudySheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudySheetRepository extends JpaRepository<StudySheet, Long> {
    boolean existsByNumber(Integer number);
    boolean existsByNum(Integer num);
}
