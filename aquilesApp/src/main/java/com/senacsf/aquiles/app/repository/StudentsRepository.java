package com.senacsf.aquiles.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.senacsf.aquiles.app.entities.Students;

@Repository
public interface StudentsRepository extends JpaRepository<Students, Long> {
    @Query("SELECT s FROM Students s WHERE s.document_number = :documentNumber")
    Students findByDocumentNumber(Long documentNumber); // Define un método de consulta para buscar un proyecto por su nombre

}
