package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.StudySheetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudySheetRepository extends JpaRepository<StudySheetEntity, Long> {

}
