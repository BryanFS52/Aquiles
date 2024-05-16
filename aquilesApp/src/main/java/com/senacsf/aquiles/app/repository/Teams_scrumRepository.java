package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Teams_scrum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Teams_scrumRepository extends JpaRepository<Teams_scrum, Long> {

    // Método para buscar un proyecto por nombre de proyecto
    Teams_scrum findByNameProject(String name_project);
}