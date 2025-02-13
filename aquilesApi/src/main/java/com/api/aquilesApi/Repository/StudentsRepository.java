package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentsRepository extends JpaRepository<StudentsEntity, Long> {

    @Query("SELECT s FROM StudentsEntity s WHERE s.documentNumber = :documentNumber")
    StudentsEntity findByDocumentNumber(Long documentNumber);
}
