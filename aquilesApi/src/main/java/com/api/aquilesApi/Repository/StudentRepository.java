package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Cambiar personKey a person.idPerson y person.document
    boolean existsByPerson_IdPersonAndPerson_Document(Long idPerson, Long document);
}
