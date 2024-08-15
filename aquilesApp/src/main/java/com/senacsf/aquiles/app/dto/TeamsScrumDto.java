package com.senacsf.aquiles.app.dto; // Declara el paquete al que pertenece esta clase DTO

import com.senacsf.aquiles.app.entities.Students;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor; // Importa la anotación AllArgsConstructor de Lombok para generar un constructor con todos los argumentos
import lombok.Data; // Importa la anotación Data de Lombok para generar automáticamente getters, setters, toString, equals y hashCode
import lombok.NoArgsConstructor; // Importa la anotación NoArgsConstructor de Lombok para generar un constructor sin argumentos

import java.util.Set;

@Data // Anotación de Lombok que combina @Getter, @Setter, @ToString, @EqualsAndHashCode y @RequiredArgsConstructor
@NoArgsConstructor // Anotación de Lombok para generar un constructor sin argumentos
@AllArgsConstructor // Anotación de Lombok para generar un constructor con todos los argumentos
public class TeamsScrumDto { // Define una clase DTO para representar datos de TeamsScrum

    // Propiedad para almacenar los datos de la entidad Teams_scrum
    private Long team_scrum_id; // ID del equipo scrum

    @NotNull(message = "Project name cannot be null")
    @Size(max = 100, message = "Project name cannot exceed 100 characters")
    private String nameProject;
}
