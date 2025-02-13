package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Teams_ScrumEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Team_ScrumRepository extends JpaRepository<Teams_ScrumEntity , Long> {
    // Método para buscar un proyecto por nombre de proyecto
    Teams_ScrumEntity findByNameProject(String name_project); // Define un método de consulta para buscar un proyecto por su nombre
}
