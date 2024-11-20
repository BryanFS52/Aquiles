package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TeamScrum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamScrumRepository extends JpaRepository<TeamScrum , Long> {
    // Método para buscar un proyecto por nombre de proyecto
    TeamScrum findByNameProject(String name_project); // Define un método de consulta para buscar un proyecto por su nombre
}
