package com.senacsf.aquiles.app.repository; // Declara el paquete al que pertenece esta interfaz

import com.senacsf.aquiles.app.entities.Teams_scrum; // Importa la entidad Teams_scrum

import org.springframework.data.jpa.repository.JpaRepository; // Importa la interfaz JpaRepository de Spring Data JPA
import org.springframework.stereotype.Repository; // Importa la anotación Repository de Spring

@Repository // Marca esta interfaz como un componente de repositorio de Spring
public interface Teams_scrumRepository extends JpaRepository<Teams_scrum, Long> { // Extiende JpaRepository para trabajar con la entidad Teams_scrum y el tipo de ID Long

    // Método para buscar un proyecto por nombre de proyecto
    Teams_scrum findByNameProject(String name_project); // Define un método de consulta para buscar un proyecto por su nombre
}
