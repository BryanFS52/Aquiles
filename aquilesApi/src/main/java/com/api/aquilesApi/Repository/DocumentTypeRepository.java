package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentTypeRepository extends JpaRepository<DocumentType, Long> {

    // Verifica si ya existe un tipo de documento con el mismo nombre
    boolean existsByName(String name);

    // Verifica si ya existe un tipo de documento con el mismo acrónimo
    boolean existsByAcronym(String acronym);
}
