package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    // Verifica si existe una persona con un documento específico
    boolean existsByDocument(Long document);

    // Verifica si existe una persona con un correo electrónico específico
    boolean existsByEmail(String email);
}
